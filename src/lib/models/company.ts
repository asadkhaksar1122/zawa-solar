import { Schema, model, Document, models } from 'mongoose';

interface ICompany extends Document {
    name: string;
}

const companySchema = new Schema<ICompany>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true,
    collection: 'companies',
});

export const Company = models.Company || model('Company', companySchema);