import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    // English report data — mirrors the static reportsDataEn.js structure
    reportsDataEn: {
      reportsData: { type: Array, default: [] },
      commonData: {
        type: Object,
        default: {
          sliderImages: [],
          accordion: [
            {
              images: [],
              docUrl: '',
              heading: 'Major Issues Overview',
              content: 'Add your report details here.',
            },
          ],
        },
      },
      TAGS_META: { type: Object, default: {} },
      uiDictionary: {
        type: Object,
        default: {
          hero: {
            title: 'Umoor Overview Dashboard',
            subtitle: 'A unified view of achievements, improvements, and gallery highlights across all active Umoors and cities.',
            breadcrumb: 'Dashboard',
          },
          filters: {
            allUmoors: 'All Umoors',
            allCities: 'All Cities',
            showFilters: 'Show Filters',
            hideFilters: 'Hide Filters',
          },
          dataCard: {
            achievementsTitle: 'Achievements',
            improvementsTitle: 'Need to Improve',
            items: 'items',
            allTags: 'All Tags',
            emptyState: 'No {title} found for this selection.',
            summary: 'Summary',
            totalItems: 'Total Items:',
            citiesRepresented: 'Cities Represented:',
            activeTags: 'Active Tags:',
          },
          gallery: {
            title: 'Gallery Reel',
            emptyState: 'No images found.',
            summary: 'Gallery Summary',
            totalImages: 'Total Images:',
            displayMode: 'Display Mode:',
            autoSliding: 'Auto-Sliding Reel',
          },
          accordion: {
            downloadReport: 'Download Detailed Report',
          },
        },
      },
    },
    // Urdu report data — mirrors the static reportsDataUr.js structure
    reportsDataUr: {
      reportsData: { type: Array, default: [] },
      commonData: {
        type: Object,
        default: {
          sliderImages: [],
          accordion: [
            {
              images: [],
              docUrl: '',
              heading: 'قضايا رئيسية',
              content: 'یہاں اپنی رپورٹ کی تفصیلات شامل کریں۔',
            },
          ],
        },
      },
      TAGS_META: { type: Object, default: {} },
      uiDictionary: {
        type: Object,
        default: {
          hero: {
            title: 'امور جائزہ ڈیش بورڈ',
            subtitle: 'تمام سرگرم امور اور شہروں میں کامیابیوں، بہتریوں اور گیلری کی جھلکیوں کا ایک مشترکہ منظر۔',
            breadcrumb: 'ڈیش بورڈ',
          },
          filters: {
            allUmoors: 'تمام امور',
            allCities: 'تمام شہر',
            showFilters: 'فلٹرز دکھائیں',
            hideFilters: 'فلٹرز چھپائیں',
          },
          dataCard: {
            achievementsTitle: 'کامیابیاں',
            improvementsTitle: 'بہتری کی ضرورت',
            items: 'اشیاء',
            allTags: 'تمام ٹیگز',
            emptyState: 'اس انتخاب کے لیے کوئی {title} نہیں ملا۔',
            summary: 'خلاصہ',
            totalItems: 'کل اشیاء:',
            citiesRepresented: 'نمائندہ شہر:',
            activeTags: 'فعال ٹیگز:',
          },
          gallery: {
            title: 'گیلری ریل',
            emptyState: 'کوئی تصاویر نہیں ملیں۔',
            summary: 'گیلری کا خلاصہ',
            totalImages: 'کل تصاویر:',
            displayMode: 'ڈسپلے موڈ:',
            autoSliding: 'خودکار سلائیڈنگ ریل',
          },
          accordion: {
            downloadReport: 'تفصیلی رپورٹ ڈاؤن لوڈ کریں',
          },
        },
      },
    },
  },
  {
    timestamps: true,
    // Allow flexible nested structures without strict schema validation
    strict: false,
  }
);

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
