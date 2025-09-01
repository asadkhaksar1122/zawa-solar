import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import UserModel from '@/lib/models/user';
import SessionModel from '@/lib/models/session';

// GET endpoint to fetch all sessions for the current admin user
export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email: (session.user as any).email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if the current session exists in the database
     const currentSessionId = (session.user as any).sessionId;
     let currentSession = null;
     
     if (currentSessionId) {
       currentSession = await SessionModel.findById(currentSessionId).lean();
     }
     
     // If current session doesn't exist in the database, create it
     if (!currentSession && currentSessionId) {
       const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
       const userAgent = request.headers.get('user-agent') || 'unknown';
       
       try {
         const newSession = new SessionModel({
           _id: currentSessionId,
           userId: user._id,
           ipAddress,
           userAgent,
           createdAt: new Date(),
           lastAccessedAt: new Date(),
         });
         
         await newSession.save();
         
         // Add to user's sessions if not already there
         if (!user.sessions.includes(currentSessionId)) {
           user.sessions.push(currentSessionId);
           await user.save();
         }
         
         currentSession = newSession.toObject();
         console.log('Created new session:', currentSession);
       } catch (err) {
         console.error('Error creating session:', err);
       }
     } else if (!currentSession && !user.sessions.length) {
       // Only create a fallback session if no sessionId is available AND user has no sessions at all
       try {
         const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
         const userAgent = request.headers.get('user-agent') || 'unknown';
         
         const newSession = new SessionModel({
           userId: user._id,
           ipAddress,
           userAgent,
           createdAt: new Date(),
           lastAccessedAt: new Date(),
         });
         
         await newSession.save();
         user.sessions.push(newSession._id);
         await user.save();
         
         currentSession = newSession.toObject();
         console.log('Created fallback session:', currentSession);
       } catch (err) {
         console.error('Error creating fallback session:', err);
       }
     } else if (!currentSession && user.sessions.length > 0) {
       // If user has existing sessions but current session is not found,
       // use the most recent session as the current session instead of creating a new one
       try {
         const mostRecentSession = await SessionModel.findOne({ _id: { $in: user.sessions } })
           .sort({ lastAccessedAt: -1 })
           .lean();
           
         if (mostRecentSession) {
           currentSession = mostRecentSession;
           console.log('Using most recent session as current session');
         }
       } catch (err) {
         console.error('Error finding most recent session:', err);
       }
     }

    // Get all sessions for the user with additional details
    let sessions = await SessionModel.find({ _id: { $in: user.sessions } })
      .sort({ lastAccessedAt: -1 })
      .lean();
      
    // Clean up duplicate sessions with the same IP and user agent
    // Group sessions by IP and user agent
    const sessionsByIpAndAgent = {};
    sessions.forEach(s => {
      const key = `${s.ipAddress}-${s.userAgent}`;
      if (!sessionsByIpAndAgent[key]) {
        sessionsByIpAndAgent[key] = [];
      }
      sessionsByIpAndAgent[key].push(s);
    });
    
    // For each group with more than one session, keep only the most recent one
    const sessionsToRemove = [];
    for (const key in sessionsByIpAndAgent) {
      const group = sessionsByIpAndAgent[key];
      if (group.length > 1) {
        // Sort by lastAccessedAt in descending order
        group.sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt));
        // Keep the first one (most recent), mark the rest for removal
        for (let i = 1; i < group.length; i++) {
          sessionsToRemove.push(group[i]._id.toString());
        }
      }
    }
    
    // Remove duplicate sessions from the database and user's sessions array
    if (sessionsToRemove.length > 0) {
      console.log(`Removing ${sessionsToRemove.length} duplicate sessions`);
      
      // Remove from user's sessions array
      user.sessions = user.sessions.filter(
        (s: any) => !sessionsToRemove.includes(s.toString())
      );
      await user.save();
      
      // Remove from sessions collection
      await SessionModel.deleteMany({ _id: { $in: sessionsToRemove } });
      
      // Update the sessions array to exclude removed sessions
      sessions = sessions.filter(s => !sessionsToRemove.includes(s._id.toString()));
    }

    // If we have a current session object but it's not in the sessions list, add it
    // Only do this if the current session has a valid ID
    if (currentSession && currentSession._id && !sessions.some(s => s._id.toString() === currentSession._id.toString())) {
      // Check if there's already a session with the same IP and user agent
      const existingSessionWithSameSignature = sessions.find(
        s => s.ipAddress === currentSession.ipAddress && s.userAgent === currentSession.userAgent
      );
      
      if (!existingSessionWithSameSignature) {
        sessions.push(currentSession);
      } else {
        // Use the existing session as the current session instead
        currentSession = existingSessionWithSameSignature;
        console.log('Using existing session with same IP and user agent as current session');
      }
    }

    // Update the lastAccessedAt timestamp for the current session
    if (currentSession && currentSession._id) {
      try {
        await SessionModel.findByIdAndUpdate(
          currentSession._id,
          { $set: { lastAccessedAt: new Date() } }
        );
        
        // Update the timestamp in our local copy too
        currentSession.lastAccessedAt = new Date();
      } catch (err) {
        console.error('Error updating session lastAccessedAt:', err);
      }
    }
    
    // Add current session indicator
    const sessionsWithCurrentFlag = sessions.map(s => ({
      ...s,
      isCurrent: currentSession && s._id.toString() === currentSession._id.toString()
    }));
    
    console.log('Sessions with current flag:', sessionsWithCurrentFlag.length);
    console.log('Current session ID used for flag:', currentSession ? currentSession._id : 'none');

    return NextResponse.json({ sessions: sessionsWithCurrentFlag });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sessions.' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific session (logout from device)
export async function DELETE(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get the session ID to remove from the request
    let body;
    try {
      body = await request.json();
      console.log('DELETE request body:', body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Session ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user
    const user = await UserModel.findOne({ email: (session.user as any).email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // Prevent removing the current session
    const currentSessionId = (session.user as any).sessionId;
    console.log('Current session ID:', currentSessionId);
    console.log('Session ID to remove:', sessionId);
    
    // Convert both to strings for proper comparison
    const currentSessionIdStr = currentSessionId ? currentSessionId.toString() : '';
    const sessionIdToRemoveStr = sessionId ? sessionId.toString() : '';
    
    if (sessionIdToRemoveStr === currentSessionIdStr) {
      return NextResponse.json(
        { message: 'Cannot remove the current session. Please use logout instead.' },
        { status: 400 }
      );
    }

    // Check if the session exists in the user's sessions array
    const sessionExists = user.sessions.some(
      (s: any) => s.toString() === sessionIdToRemoveStr
    );
    
    if (!sessionExists) {
      return NextResponse.json(
        { message: 'Session not found for this user.' },
        { status: 404 }
      );
    }

    try {
      // Remove the session from the user's sessions array
       user.sessions = user.sessions.filter(
         (s: any) => s.toString() !== sessionIdToRemoveStr
       );
      await user.save();

      // Delete the session from the sessions collection
       const deletedSession = await SessionModel.findByIdAndDelete(sessionIdToRemoveStr);
       console.log('Deleted session:', deletedSession ? 'success' : 'not found');

      return NextResponse.json({ message: 'Session removed successfully.' });
    } catch (deleteError) {
      console.error('Error during session deletion:', deleteError);
      return NextResponse.json(
        { message: 'Failed to remove session due to database error.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error removing session:', error);
    return NextResponse.json(
      { message: 'Failed to remove session.' },
      { status: 500 }
    );
  }
}