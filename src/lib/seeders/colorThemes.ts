import { dbConnect } from '@/lib/mongodb';
import { ColorTheme } from '@/lib/models/colorTheme';

// Default color themes to seed into database
const defaultThemes = [
  {
    name: 'Default (Solar Blue)',
    primaryColor: '#7EC4CF',
    secondaryColor: '#FFB347',
    accentColor: '#4A90E2',
    isDefault: true,
    createdBy: 'System',
  },
  {
    name: 'Ocean',
    primaryColor: '#0077BE',
    secondaryColor: '#00A8CC',
    accentColor: '#FFD700',
    isDefault: true,
    createdBy: 'System',
  },
  {
    name: 'Forest',
    primaryColor: '#228B22',
    secondaryColor: '#32CD32',
    accentColor: '#FF6347',
    isDefault: true,
    createdBy: 'System',
  },
  {
    name: 'Sunset',
    primaryColor: '#FF6B35',
    secondaryColor: '#F7931E',
    accentColor: '#FFD23F',
    isDefault: true,
    createdBy: 'System',
  },
  {
    name: 'Professional',
    primaryColor: '#2C3E50',
    secondaryColor: '#3498DB',
    accentColor: '#E74C3C',
    isDefault: true,
    createdBy: 'System',
  },
];

export async function seedColorThemes() {
  try {
    await dbConnect();
    
    console.log('🎨 Starting color themes seeding...');
    
    // Check if themes already exist
    const existingThemes = await ColorTheme.find({ isDefault: true });
    
    if (existingThemes.length > 0) {
      console.log('✅ Default color themes already exist in database');
      return {
        success: true,
        message: 'Default themes already seeded',
        existingCount: existingThemes.length
      };
    }
    
    // Insert default themes
    const insertedThemes = await ColorTheme.insertMany(defaultThemes);
    
    console.log(`✅ Successfully seeded ${insertedThemes.length} default color themes`);
    
    return {
      success: true,
      message: `Successfully seeded ${insertedThemes.length} default color themes`,
      themes: insertedThemes
    };
    
  } catch (error) {
    console.error('❌ Error seeding color themes:', error);
    return {
      success: false,
      message: 'Failed to seed color themes',
      error: error
    };
  }
}

// Function to reset and re-seed themes (useful for development)
export async function resetAndSeedColorThemes() {
  try {
    await dbConnect();
    
    console.log('🔄 Resetting color themes...');
    
    // Remove all existing default themes
    await ColorTheme.deleteMany({ isDefault: true });
    
    // Insert fresh default themes
    const insertedThemes = await ColorTheme.insertMany(defaultThemes);
    
    console.log(`✅ Successfully reset and seeded ${insertedThemes.length} default color themes`);
    
    return {
      success: true,
      message: `Successfully reset and seeded ${insertedThemes.length} default color themes`,
      themes: insertedThemes
    };
    
  } catch (error) {
    console.error('❌ Error resetting color themes:', error);
    return {
      success: false,
      message: 'Failed to reset color themes',
      error: error
    };
  }
}