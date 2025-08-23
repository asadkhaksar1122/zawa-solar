import { dbConnect } from '@/lib/mongodb';
import SubscriptionModel from '@/lib/models/subscription';

const sampleSubscriptions = [
  {
    email: 'john.doe@example.com',
    source: 'footer',
    subscribedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    email: 'jane.smith@example.com',
    source: 'popup',
    subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    email: 'bob.wilson@example.com',
    source: 'landing',
    subscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    email: 'alice.johnson@example.com',
    source: 'footer',
    subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    email: 'charlie.brown@example.com',
    source: 'footer',
    subscribedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isActive: false, // This one is unsubscribed
    unsubscribedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
];

async function seedSubscriptions() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    console.log('Clearing existing subscriptions...');
    await SubscriptionModel.deleteMany({});
    
    console.log('Seeding sample subscriptions...');
    for (const subscription of sampleSubscriptions) {
      const newSubscription = new SubscriptionModel(subscription);
      await newSubscription.save();
      console.log(`✓ Added subscription: ${subscription.email}`);
    }
    
    console.log('\n✅ Seeding completed successfully!');
    console.log(`📊 Total subscriptions: ${sampleSubscriptions.length}`);
    console.log(`📈 Active subscriptions: ${sampleSubscriptions.filter(s => s.isActive !== false).length}`);
    console.log(`📉 Inactive subscriptions: ${sampleSubscriptions.filter(s => s.isActive === false).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subscriptions:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedSubscriptions();