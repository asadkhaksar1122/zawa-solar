import TeamMember from "@/lib/models/TeamMember";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

// GET - Fetch all team members
export async function GET() {
    try {
        await dbConnect();

        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve(true);
                });
            });
        }

        const allTeamMembers = await TeamMember.find({}).sort({ createdAt: -1 });
        return NextResponse.json(allTeamMembers);

    } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 500 }
        );
    }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve(true);
                });
            });
        }

        const body = await request.json();
        const { name, role, img, education, experience, achievements } = body;

        // Validate required fields
        if (!name || !role || !img) {
            return NextResponse.json(
                { success: false, message: "Name, role, and image are required" },
                { status: 400 }
            );
        }

        const newTeamMember = new TeamMember({
            name,
            role,
            img,
            education: education || "",
            experience: experience || "",
            achievements: achievements || ""
        });

        const savedTeamMember = await newTeamMember.save();
        return NextResponse.json(savedTeamMember, { status: 201 });

    } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 500 }
        );
    }
}

// PUT - Update team member
export async function PUT(request: NextRequest) {
    try {
        await dbConnect();

        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve(true);
                });
            });
        }

        const body = await request.json();
        const { _id, name, role, img, education, experience, achievements } = body;

        if (!_id) {
            return NextResponse.json(
                { success: false, message: "Team member ID is required" },
                { status: 400 }
            );
        }

        const updatedTeamMember = await TeamMember.findByIdAndUpdate(
            _id,
            {
                name,
                role,
                img,
                education: education || "",
                experience: experience || "",
                achievements: achievements || ""
            },
            { new: true, runValidators: true }
        );

        if (!updatedTeamMember) {
            return NextResponse.json(
                { success: false, message: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTeamMember);

    } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete team member
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve(true);
                });
            });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Team member ID is required" },
                { status: 400 }
            );
        }

        const deletedTeamMember = await TeamMember.findByIdAndDelete(id);

        if (!deletedTeamMember) {
            return NextResponse.json(
                { success: false, message: "Team member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Team member deleted successfully"
        });

    } catch (error: unknown) {
        let message = "An unknown error occurred";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 500 }
        );
    }
}