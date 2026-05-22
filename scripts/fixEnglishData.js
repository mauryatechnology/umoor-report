/**
 * Fix English data file by copying the real text content from the Urdu data file.
 * 
 * The English file was generated with dummy placeholder text like
 * "Dummy achievement text for بھوپال (general)" — this script replaces
 * all those placeholders with the actual Urdu content, since both files
 * share the same structure (same IDs, cities, tag order, entry count).
 * 
 * The English TAGS_META and uiDictionary are preserved (they have English UI labels).
 */
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const enPath = join(__dirname, '../src/data/reportsDataEn.js');
const urPath = join(__dirname, '../src/data/reportsDataUr.js');

const enFile = fs.readFileSync(enPath, 'utf-8');
const urFile = fs.readFileSync(urPath, 'utf-8');

// Helper: extract exported data objects by eval-ing the file
// (strip import/export and replace the PDF import reference)
function extractData(fileStr) {
  let cleanStr = fileStr
    .replace(/export const/g, 'const')
    .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
    .replace(/umoorPdf/g, '"/12 umoor.pdf"');
  
  return eval(`
    (() => {
      ${cleanStr}
      return { reportsData, commonData, TAGS_META, uiDictionary };
    })();
  `);
}

try {
  const urData = extractData(urFile);
  const enData = extractData(enFile);

  console.log(`Urdu umoors: ${urData.reportsData.length}, English umoors: ${enData.reportsData.length}`);

  // Copy real text content from Urdu to English for reportsData and commonData
  // Keep English TAGS_META and uiDictionary unchanged
  
  // We rebuild reportsDataEn.js with:
  //   - English TAGS_META (unchanged)
  //   - Urdu commonData (real headings/content) but English accordion headings kept as "Major Issues Overview" etc
  //   - Urdu reportsData text (real content) 
  //   - English uiDictionary (unchanged)

  // Deep copy Urdu reportsData into English structure
  const fixedReportsData = urData.reportsData;
  const fixedCommonData = urData.commonData;

  // Build the new file content
  const output = `import umoorPdf from './12 umoor.pdf';

export const TAGS_META = ${JSON.stringify(enData.TAGS_META, null, 2)};

export const commonData = ${stringifyWithUmoorPdf(fixedCommonData)};

export const reportsData = ${stringifyWithUmoorPdf(fixedReportsData)};

export const uiDictionary = ${JSON.stringify(enData.uiDictionary, null, 2)};
`;

  fs.writeFileSync(enPath, output, 'utf-8');
  console.log('✅ English data file fixed successfully!');
  console.log(`   Replaced dummy text with real content from Urdu data.`);

} catch (error) {
  console.error('❌ Error fixing English data:', error);
  process.exit(1);
}

/**
 * JSON.stringify but replace the PDF placeholder string back to the variable reference
 */
function stringifyWithUmoorPdf(obj) {
  let json = JSON.stringify(obj, null, 2);
  // Replace the quoted PDF path with the variable reference
  json = json.replaceAll('"/12 umoor.pdf"', 'umoorPdf');
  return json;
}
