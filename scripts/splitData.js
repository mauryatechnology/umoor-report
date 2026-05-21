import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, '../src/data/reportsData2.js');
let rawCode = fs.readFileSync(dataFile, 'utf8');

// Strip the import temporarily for eval
const importRegex = /import umoorPdf from '\.\/12 umoor\.pdf';/;
rawCode = rawCode.replace(importRegex, 'const umoorPdf = "./12 umoor.pdf";');

// Remove export keywords so we can eval
rawCode = rawCode.replace(/export const /g, 'const ');

// Add a return at the end to get the objects
rawCode += '\n\nreturn { TAGS_META, commonData, reportsData2 };';

const getObjects = new Function(rawCode);
const { TAGS_META, commonData, reportsData2 } = getObjects();

// Function to deeply clone
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// 1. Process English Data
let tagsMetaEn = {};
for (let key in TAGS_META) {
    tagsMetaEn[key] = { name: TAGS_META[key].en || key };
}

let commonDataEn = clone(commonData);
commonDataEn.accordion[0].heading = commonDataEn.accordion[0].headingEn || 'Major Issues Overview';
commonDataEn.accordion[0].content = commonDataEn.accordion[0].contentEn || 'Detailed analysis and overview of the current status and primary considerations for this sector.';
delete commonDataEn.accordion[0].headingEn;
delete commonDataEn.accordion[0].headingUr;
delete commonDataEn.accordion[0].contentEn;
delete commonDataEn.accordion[0].contentUr;

let reportsEn = clone(reportsData2);
reportsEn.forEach(umoor => {
    umoor.name = umoor.nameEn || umoor.id; // Use id if nameEn is empty (usually English)
    delete umoor.nameEn;
    delete umoor.nameUr;
    
    if (umoor.accordion) {
        umoor.accordion.heading = umoor.accordion.headingEn || 'Major Issues';
        umoor.accordion.content = umoor.accordion.contentEn || 'Detailed content missing. Please refer to the downloaded report for complete insights into this matter.';
        delete umoor.accordion.headingEn;
        delete umoor.accordion.headingUr;
        delete umoor.accordion.contentEn;
        delete umoor.accordion.contentUr;
    }
    
    if (umoor.cities) {
        umoor.cities.forEach(city => {
            city.name = city.nameEn || city.id;
            delete city.nameEn;
            delete city.nameUr;
            
            ['achievements', 'improvements'].forEach(key => {
                if (city[key]) {
                    city[key].forEach(item => {
                        item.text = item.textEn || `Dummy ${key.slice(0, -1)} text for ${city.name} (${item.tags ? item.tags.join(', ') : 'general'})`;
                        delete item.textEn;
                        delete item.textUr;
                    });
                }
            });
            
            if (city.accordion) {
                city.accordion.heading = city.accordion.headingEn || 'Major Issues';
                city.accordion.content = city.accordion.contentEn || 'Detailed content missing. Please refer to the downloaded report for complete insights into this matter.';
                delete city.accordion.headingEn;
                delete city.accordion.headingUr;
                delete city.accordion.contentEn;
                delete city.accordion.contentUr;
            }
        });
    }
});

// 2. Process Urdu Data
let tagsMetaUr = {};
for (let key in TAGS_META) {
    tagsMetaUr[key] = { name: TAGS_META[key].ur || key };
}

let commonDataUr = clone(commonData);
commonDataUr.accordion[0].heading = commonDataUr.accordion[0].headingUr || 'قضايا رئيسية';
commonDataUr.accordion[0].content = commonDataUr.accordion[0].contentUr || 'مزید تفصیلات کے لیے برائے مہربانی رپورٹ ڈاؤن لوڈ کریں۔';
delete commonDataUr.accordion[0].headingEn;
delete commonDataUr.accordion[0].headingUr;
delete commonDataUr.accordion[0].contentEn;
delete commonDataUr.accordion[0].contentUr;

let reportsUr = clone(reportsData2);
reportsUr.forEach(umoor => {
    umoor.name = umoor.nameUr || umoor.id;
    delete umoor.nameEn;
    delete umoor.nameUr;
    
    if (umoor.accordion) {
        umoor.accordion.heading = umoor.accordion.headingUr || 'قضايا رئيسية';
        umoor.accordion.content = umoor.accordion.contentUr || 'مزید تفصیلات کے لیے برائے مہربانی رپورٹ ڈاؤن لوڈ کریں۔';
        delete umoor.accordion.headingEn;
        delete umoor.accordion.headingUr;
        delete umoor.accordion.contentEn;
        delete umoor.accordion.contentUr;
    }
    
    if (umoor.cities) {
        umoor.cities.forEach(city => {
            city.name = city.nameUr || city.id;
            delete city.nameEn;
            delete city.nameUr;
            
            ['achievements', 'improvements'].forEach(key => {
                if (city[key]) {
                    city[key].forEach(item => {
                        item.text = item.textUr || `مزید تفصیلات دستیاب نہیں ہیں۔`;
                        delete item.textEn;
                        delete item.textUr;
                    });
                }
            });
            
            if (city.accordion) {
                city.accordion.heading = city.accordion.headingUr || 'قضايا رئيسية';
                city.accordion.content = city.accordion.contentUr || 'مزید تفصیلات کے لیے برائے مہربانی رپورٹ ڈاؤن لوڈ کریں۔';
                delete city.accordion.headingEn;
                delete city.accordion.headingUr;
                delete city.accordion.contentEn;
                delete city.accordion.contentUr;
            }
        });
    }
});

// Also append UI dictionary to both
const uiDictionaryEn = {
    hero: {
        title: "Umoor Overview Dashboard",
        subtitle: "A unified view of achievements, improvements, and gallery highlights across all active Umoors and cities.",
        breadcrumb: "Dashboard",
    },
    filters: {
        allUmoors: "All Umoors",
        allCities: "All Cities",
        showFilters: "Show Filters",
        hideFilters: "Hide Filters",
    },
    dataCard: {
        achievementsTitle: "Achievements",
        improvementsTitle: "Need to Improve",
        items: "items",
        allTags: "All Tags",
        emptyState: "No {title} found for this selection.",
        summary: "Summary",
        totalItems: "Total Items:",
        citiesRepresented: "Cities Represented:",
        activeTags: "Active Tags:"
    },
    gallery: {
        title: "Gallery Reel",
        emptyState: "No images found.",
        summary: "Gallery Summary",
        totalImages: "Total Images:",
        displayMode: "Display Mode:",
        autoSliding: "Auto-Sliding Reel"
    },
    accordion: {
        downloadReport: "Download Detailed Report"
    }
};

const uiDictionaryUr = {
    hero: {
        title: "امور جائزہ ڈیش بورڈ",
        subtitle: "تمام سرگرم امور اور شہروں میں کامیابیوں، بہتریوں اور گیلری کی جھلکیوں کا ایک مشترکہ منظر۔",
        breadcrumb: "ڈیش بورڈ",
    },
    filters: {
        allUmoors: "تمام امور",
        allCities: "تمام شہر",
        showFilters: "فلٹرز دکھائیں",
        hideFilters: "فلٹرز چھپائیں",
    },
    dataCard: {
        achievementsTitle: "کامیابیاں",
        improvementsTitle: "بہتری کی ضرورت",
        items: "اشیاء",
        allTags: "تمام ٹیگز",
        emptyState: "اس انتخاب کے لیے کوئی {title} نہیں ملا۔",
        summary: "خلاصہ",
        totalItems: "کل اشیاء:",
        citiesRepresented: "نمائندہ شہر:",
        activeTags: "فعال ٹیگز:"
    },
    gallery: {
        title: "گیلری ریل",
        emptyState: "کوئی تصاویر نہیں ملیں۔",
        summary: "گیلری کا خلاصہ",
        totalImages: "کل تصاویر:",
        displayMode: "ڈسپلے موڈ:",
        autoSliding: "خودکار سلائیڈنگ ریل"
    },
    accordion: {
        downloadReport: "تفصیلی رپورٹ ڈاؤن لوڈ کریں"
    }
};

function writeDataFile(filename, tags, common, reports, uiDict) {
    let output = `import umoorPdf from './12 umoor.pdf';\n\n`;
    output += `export const TAGS_META = ${JSON.stringify(tags, null, 2)};\n\n`;
    
    // Convert string literal umoorPdf back to variable
    let commonStr = JSON.stringify(common, null, 2);
    commonStr = commonStr.replace(/"\.\/12 umoor\.pdf"/g, 'umoorPdf');
    output += `export const commonData = ${commonStr};\n\n`;
    
    let reportsStr = JSON.stringify(reports, null, 2);
    reportsStr = reportsStr.replace(/"\.\/12 umoor\.pdf"/g, 'umoorPdf');
    output += `export const reportsData = ${reportsStr};\n\n`;
    
    output += `export const uiDictionary = ${JSON.stringify(uiDict, null, 2)};\n`;
    
    fs.writeFileSync(path.join(__dirname, '../src/data', filename), output);
}

writeDataFile('reportsDataEn.js', tagsMetaEn, commonDataEn, reportsEn, uiDictionaryEn);
writeDataFile('reportsDataUr.js', tagsMetaUr, commonDataUr, reportsUr, uiDictionaryUr);

console.log("Data successfully split and formatted!");
