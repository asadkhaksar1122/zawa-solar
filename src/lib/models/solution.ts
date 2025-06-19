import { Schema, model, Document, Types, models } from 'mongoose';
import { Company } from './company';

interface ISolarSolution extends Document {
    name: string;
    company: string;
    companyId: Types.ObjectId;
    description: string;
    imageUrl: string;
    powerOutput: string;
    efficiency: string;
    features: string[];
    warranty: string;
}

const solarSolutionSchema = new Schema<ISolarSolution>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        default: "https://i.pinimg.com/736x/69/86/29/69862974a76ebd3f794e1db19d215a09.jpg"
    },
    powerOutput: {
        type: String,
        required: true,
    },
    efficiency: {
        type: String,

    },
    features: {
        type: [String],
        required: true,
        default: [],
    },
    warranty: {
        type: String,

    },
}, {
    timestamps: true,
    collection: 'solarsolutions',
});

export const SolarSolution =
    models.SolarSolution || model<ISolarSolution>('SolarSolution', solarSolutionSchema);