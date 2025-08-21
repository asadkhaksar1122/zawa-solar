import { Schema, model, models, Document } from "mongoose";

export interface ITeamMember extends Document {
    name: string;
    role: string;
    img: string;
    education: string;
    experience: string;
    achievements: string;
}

const TeamMemberSchema = new Schema<ITeamMember>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        img: {
            type: String,
            required: true,
            trim: true,
        },
        education: {
            type: String,
            required: false,
            trim: true,
        },
        experience: {
            type: String,
            required: false,
            trim: true,
        },
        achievements: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

// To prevent model overwrite error in Next.js hot reload
const TeamMember =
    models.TeamMember || model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;