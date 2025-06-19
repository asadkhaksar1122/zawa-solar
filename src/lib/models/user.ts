import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the user document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

// Create the schema
const UserSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true, // optional: adds createdAt and updatedAt
});

// Prevent model overwrite error in development
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
