import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the subscription document
export interface ISubscription extends Document {
    email: string;
    isActive: boolean;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    source: 'footer' | 'popup' | 'landing' | 'admin' | 'other';
    ipAddress?: string;
    userAgent?: string;
}

// Define an interface for the model statics (to expose custom static methods)
export interface ISubscriptionModel extends Model<ISubscription> {
    findActiveSubscriptions(): Promise<ISubscription[]>;
    getSubscriptionStats(): Promise<Array<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        inactiveSubscriptions: number;
    }>>;
    getRecentSubscriptions(limit?: number): Promise<Array<Pick<ISubscription, 'email' | 'subscribedAt' | 'source'>>>;
}

// Create the schema
const SubscriptionSchema: Schema<ISubscription> = new Schema<ISubscription>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address'
        ],
        index: true, // Add index for faster queries
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true, // Add index for filtering active subscriptions
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    unsubscribedAt: {
        type: Date,
        required: false,
    },
    source: {
        type: String,
        enum: ['footer', 'popup', 'landing', 'admin', 'other'],
        default: 'footer',
        required: true,
    },
    ipAddress: {
        type: String,
        required: false,
        trim: true,
    },
    userAgent: {
        type: String,
        required: false,
        trim: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Add compound index for email and isActive for efficient queries
SubscriptionSchema.index({ email: 1, isActive: 1 });

// Add index for subscribedAt for sorting and date-based queries
SubscriptionSchema.index({ subscribedAt: -1 });

// Instance methods
SubscriptionSchema.methods.unsubscribe = function () {
    this.isActive = false;
    this.unsubscribedAt = new Date();
    return this.save();
};

SubscriptionSchema.methods.resubscribe = function () {
    this.isActive = true;
    this.unsubscribedAt = undefined;
    return this.save();
};

// Static methods
SubscriptionSchema.statics.findActiveSubscriptions = function () {
    return this.find({ isActive: true }).sort({ subscribedAt: -1 });
};

SubscriptionSchema.statics.getSubscriptionStats = function () {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalSubscriptions: { $sum: 1 },
                activeSubscriptions: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                inactiveSubscriptions: {
                    $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
                },
            }
        }
    ]);
};

SubscriptionSchema.statics.getRecentSubscriptions = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ subscribedAt: -1 })
        .limit(limit)
        .select('email subscribedAt source');
};

// Pre-save middleware to ensure unsubscribedAt is set when isActive is false
SubscriptionSchema.pre('save', function (next) {
    if (!this.isActive && !this.unsubscribedAt) {
        this.unsubscribedAt = new Date();
    }
    if (this.isActive && this.unsubscribedAt) {
        this.unsubscribedAt = undefined;
    }
    next();
});

// Prevent model overwrite error in development
const SubscriptionModel: ISubscriptionModel = (mongoose.models.Subscription as ISubscriptionModel) ||
    mongoose.model<ISubscription, ISubscriptionModel>('Subscription', SubscriptionSchema);

export default SubscriptionModel;