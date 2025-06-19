// lib/mongodb.ts
import mongoose from 'mongoose';

interface ConnectionObject {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    // Check if we have a connection to the database or if it's currently connecting
    if (connection.isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    // Check if mongoose has an existing connection
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;

        if (connection.isConnected === 1) {
            console.log('Using existing MongoDB connection');
            return;
        }

        await mongoose.disconnect();
    }

    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('Please define the MONGODB_URI environment variable');
        }

        const db = await mongoose.connect(mongoUri, {
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB successfully');

    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

// Disconnect function for cleanup
async function dbDisconnect(): Promise<void> {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = 0;
            console.log('Disconnected from MongoDB');
        } else {
            console.log('Not disconnecting from MongoDB in development');
        }
    }
}

// Get connection status
function getConnectionStatus(): string {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
}

export { dbConnect, dbDisconnect, getConnectionStatus };