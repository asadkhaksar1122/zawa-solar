import mongoose, { Schema, model, Document } from 'mongoose';

// Interface for color theme
interface IColorTheme extends Document {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Color theme schema
const colorThemeSchema = new Schema<IColorTheme>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  primaryColor: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i,
  },
  secondaryColor: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i,
  },
  accentColor: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
  collection: 'colorthemes',
});

// Create indexes
colorThemeSchema.index({ name: 1 });
colorThemeSchema.index({ createdBy: 1 });
colorThemeSchema.index({ isDefault: 1 });

export const ColorTheme = 
  mongoose.models.ColorTheme || model<IColorTheme>('ColorTheme', colorThemeSchema);

export type { IColorTheme };