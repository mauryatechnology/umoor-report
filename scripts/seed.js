import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Setup basic models for script
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  contact: String,
  location: { type: String, unique: true },
  profileImage: String
});

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, unique: true },
  reportsDataEn: { type: Object, default: {} },
  reportsDataUr: { type: Object, default: {} }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Read static files
    console.log('Reading static data files...');
    let reportsDataEn = {};
    let reportsDataUr = {};

    try {
      // Very basic static analysis to extract the exported data objects
      // (in a real scenario we'd transpile or export properly, but this works for simple objects)
      const enFile = fs.readFileSync(join(__dirname, '../src/data/reportsDataEn.js'), 'utf-8');
      const urFile = fs.readFileSync(join(__dirname, '../src/data/reportsDataUr.js'), 'utf-8');

      const extractData = (fileStr) => {
        let cleanStr = fileStr
          .replace(/export const/g, 'const')
          .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
          .replace(/umoorPdf/g, '"/12 umoor.pdf"');
        // A naive evaluation wrapper to pull out the constants
        return eval(`
          (() => {
            ${cleanStr}
            return { reportsData, commonData, TAGS_META, uiDictionary };
          })();
        `);
      };

      reportsDataEn = extractData(enFile);
      reportsDataUr = extractData(urFile);
      console.log('Static data parsed successfully.');
    } catch (e) {
      console.log('Could not parse static data files automatically. Falling back to empty report structure.');
      reportsDataEn = { reportsData: [], commonData: { sliderImages: [], accordion: [{ heading: '', content: '' }] }, TAGS_META: {}, uiDictionary: {} };
      reportsDataUr = { reportsData: [], commonData: { sliderImages: [], accordion: [{ heading: '', content: '' }] }, TAGS_META: {}, uiDictionary: {} };
    }

    // Default admin details
    const adminEmail = 'kuldeepmaurya4296@gmail.com'; // Added @gmail.com for email validation
    const location = 'bhopal-maurya';

    console.log(`Checking for existing admin user (${adminEmail})...`);
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Kuldeep@123', salt);

      admin = await User.create({
        name: 'kuldeep maurya',
        email: adminEmail,
        password: hashedPassword,
        contact: '6263638053',
        location: location.toLowerCase(),
      });
      console.log('Admin user created (Password: Kuldeep@123)');
    } else {
      console.log('Admin user already exists.');
    }

    // Seed report data
    console.log('Upserting report data...');
    await Report.findOneAndUpdate(
      { location },
      {
        userId: admin._id,
        location,
        reportsDataEn,
        reportsDataUr,
      },
      { upsert: true, new: true }
    );
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
