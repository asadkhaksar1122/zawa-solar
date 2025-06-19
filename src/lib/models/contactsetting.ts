import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface IContactItem {
    value: string;
}

interface IContactSettings extends Document {
    whatsappNumbers: Types.DocumentArray<IContactItem>;
    emailAddresses: Types.DocumentArray<IContactItem>;
    phoneNumbers: Types.DocumentArray<IContactItem>;
    facebookUrl: string;
    officeAddress: string;
}

const contactItemSchema = new Schema<IContactItem>({
    value: {
        type: String,
        required: true,
        trim: true,
    },
});

const contactSettingsSchema = new Schema<IContactSettings>({
    whatsappNumbers: {
        type: [contactItemSchema],
        default: [],
    },
    emailAddresses: {
        type: [contactItemSchema],
        default: [],
    },
    phoneNumbers: {
        type: [contactItemSchema],
        default: [],
    },
    facebookUrl: {
        type: String,
        trim: true,
    },
    officeAddress: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    collection: 'contactsettings',
});

export const ContactSettings =
    mongoose.models.ContactSettings || model<IContactSettings>('ContactSettings', contactSettingsSchema);
