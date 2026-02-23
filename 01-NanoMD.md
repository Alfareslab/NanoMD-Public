

# 🍌 NanoMD - المواصفة النهائية الكاملة للإصدار MVP 1.0

**الإصدار:** 1.0.0 MVP
**التاريخ:** 2025-02-22
**الحالة:** جاهز للتنفيذ الفوري

---

## 📌 ملخص تنفيذي (اقرأ ده الأول)

**NanoMD** هو موقع Static عربي بالكامل لعرض وقراءة نصوص Markdown المنسوخة من أدوات الذكاء الاصطناعي. فلسفته **"القراءة أولاً"** - المستخدم يلصق النص، يظهر منسق فوراً، التحرير ثانوي ومخفي.

```
المستخدم ينسخ نص من ChatGPT/Claude
         ↓
يفتح NanoMD
         ↓
يضغط Ctrl+V في أي مكان
         ↓
النص يظهر منسق وجميل فوراً ✨
         ↓
يقرأ، ينسخ المنسق، يطبع، أو يعدل لو محتاج
```

---

## 🎯 القواعد الذهبية (كل قرار تصميمي يرجعلها)

```
1. القراءة أولاً    → الوضع الافتراضي = المعاينة المنسقة
2. البساطة المطلقة   → أقل عدد أزرار ظاهرة ممكن
3. الذكاء الصامت    → الموقع يفهم المستخدم بدون ما يسأله
4. العربية أصل      → كل حاجة RTL من أول سطر كود
5. الموبايل أولاً   → نصمم للموبايل ونوسع للديسكتوب
6. صفر تعقيد        → مفيش حساب، مفيش تسجيل، مفيش سيرفر
7. روح نانو بنانا   → بسيط + مرح + ألوان دافئة + سلس
```

---

## 🛠️ التقنيات (ثابتة - لا تغيير)

```
Runtime & Build:
├── React 18.2+
├── TypeScript 5+
├── Vite 5+
└── pnpm (مدير الحزم)

Styling:
├── Tailwind CSS 3.4+
├── PostCSS + Autoprefixer
└── CSS Variables للثيمات

Markdown:
├── react-markdown 9+
├── remark-gfm 4+          (جداول + checkboxes + strikethrough)
├── rehype-highlight 7+    (تلوين الأكواد)
└── rehype-sanitize 6+     (حماية XSS)

UI:
├── Lucide React            (أيقونات)
└── Google Fonts: "Cairo"   (الخط العربي)

Hosting:
├── Cloudflare Pages (مجاني)
└── GitHub (كود المصدر)
```

### package.json الدقيق

```json
{
  "name": "nanomd",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-sanitize": "^6.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## 📁 هيكل الملفات الكامل

```
nanomd/
│
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.ts
├── postcss.config.js
│
├── public/
│   ├── favicon.svg            ← أيقونة الموز 🍌
│   └── og-image.png           ← 1200x630px صورة المشاركة
│
└── src/
    ├── main.tsx               ← نقطة الدخول (ReactDOM.createRoot)
    ├── App.tsx                ← المكون الرئيسي + Context Providers
    ├── vite-env.d.ts          ← TypeScript Vite types
    │
    ├── components/
    │   ├── Header.tsx         ← الشريط العلوي العائم
    │   ├── EditorPane.tsx     ← منطقة المحرر (textarea)
    │   ├── PreviewPane.tsx    ← لوحة العرض (react-markdown)
    │   ├── SplitView.tsx      ← العرض المقسوم (⅓ محرر + ⅔ عرض)
    │   ├── FocusMode.tsx      ← وضع التركيز (قراءة صافية)
    │   ├── EmptyState.tsx     ← شاشة الترحيب
    │   ├── BottomSheet.tsx    ← درج الأدوات من تحت (موبايل)
    │   ├── ToolDrawer.tsx     ← درج الأدوات الجانبي (ديسكتوب)
    │   ├── MobileNav.tsx      ← شريط التبويبات السفلي (موبايل)
    │   ├── CopyMenu.tsx       ← قائمة خيارات النسخ
    │   ├── ThemeToggle.tsx    ← زر تبديل الثيم
    │   ├── Toast.tsx          ← إشعارات مؤقتة
    │   └── SaveIndicator.tsx  ← مؤشر حالة الحفظ
    │
    ├── hooks/
    │   ├── useLocalStorage.ts
    │   ├── useTheme.ts
    │   ├── useAutoSave.ts
    │   ├── useSmartPaste.ts
    │   ├── useKeyboard.ts
    │   ├── useViewMode.ts
    │   └── useMediaQuery.ts
    │
    ├── utils/
    │   ├── clipboard.ts       ← دوال النسخ واللصق
    │   ├── debounce.ts        ← دالة التأخير
    │   ├── export.ts          ← دوال التصدير (print)
    │   ├── templates.ts       ← القوالب الجاهزة
    │   └── constants.ts       ← الثوابت والإعدادات
    │
    ├── styles/
    │   ├── globals.css        ← Tailwind directives + أنماط عامة
    │   ├── preview.css        ← تنسيق المعاينة (prose styles)
    │   └── themes.css         ← CSS Variables للثيمات الثلاثة
    │
    └── types/
        └── index.ts           ← كل الأنواع (TypeScript interfaces)
```

---

## 🎨 نظام الثيمات (3 ثيمات)

### الثيم الفاتح (Light) - الافتراضي

```css
:root[data-theme="light"] {
  /* الأساسيات */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;

  /* النصوص */
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-muted: #9CA3AF;

  /* الحدود */
  --border-default: #E5E7EB;
  --border-hover: #D1D5DB;

  /* الألوان الوظيفية */
  --accent-primary: #F59E0B;      /* أصفر موزي 🍌 */
  --accent-primary-hover: #D97706;
  --accent-secondary: #3B82F6;    /* أزرق */
  --accent-success: #10B981;      /* أخضر */
  --accent-danger: #EF4444;       /* أحمر */

  /* المعاينة */
  --preview-bg: #FFFFFF;
  --preview-code-bg: #FEF3C7;     /* بيج موزي فاتح */
  --preview-blockquote-bg: #FFFBEB;
  --preview-blockquote-border: #F59E0B;
  --preview-table-header-bg: #FEF3C7;
  --preview-table-row-alt: #FFFBEB;
  --preview-link: #2563EB;
  --preview-heading: #111827;

  /* الظلال */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* وضع التركيز */
  --focus-bg: #FEFCE8;            /* أصفر فاتح جداً */

  /* الدرج */
  --drawer-bg: #FFFFFF;

  /* Toast */
  --toast-bg: #111827;
  --toast-text: #FFFFFF;
}
```

### الثيم الداكن (Dark)

```css
:root[data-theme="dark"] {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;

  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  --border-default: #334155;
  --border-hover: #475569;

  --accent-primary: #FBBF24;
  --accent-primary-hover: #F59E0B;
  --accent-secondary: #60A5FA;
  --accent-success: #34D399;
  --accent-danger: #F87171;

  --preview-bg: #1E293B;
  --preview-code-bg: #2D3A4A;
  --preview-blockquote-bg: #1E293B;
  --preview-blockquote-border: #FBBF24;
  --preview-table-header-bg: #2D3A4A;
  --preview-table-row-alt: #253344;
  --preview-link: #60A5FA;
  --preview-heading: #F1F5F9;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.5);

  --focus-bg: #1A1A2E;

  --drawer-bg: #1E293B;

  --toast-bg: #F1F5F9;
  --toast-text: #0F172A;
}
```

### الثيم الدافئ (Warm)

```css
:root[data-theme="warm"] {
  --bg-primary: #FFFBF0;
  --bg-secondary: #FFF8E7;
  --bg-tertiary: #FEF3C7;

  --text-primary: #451A03;
  --text-secondary: #78350F;
  --text-muted: #A16207;

  --border-default: #FDE68A;
  --border-hover: #FCD34D;

  --accent-primary: #EA580C;
  --accent-primary-hover: #C2410C;
  --accent-secondary: #DC2626;
  --accent-success: #059669;
  --accent-danger: #DC2626;

  --preview-bg: #FFFBF0;
  --preview-code-bg: #FEF3C7;
  --preview-blockquote-bg: #FFF7ED;
  --preview-blockquote-border: #EA580C;
  --preview-table-header-bg: #FEF3C7;
  --preview-table-row-alt: #FFFBEB;
  --preview-link: #DC2626;
  --preview-heading: #451A03;

  --shadow-sm: 0 1px 2px rgba(120,53,15,0.08);
  --shadow-md: 0 4px 6px rgba(120,53,15,0.1);
  --shadow-lg: 0 10px 15px rgba(120,53,15,0.12);

  --focus-bg: #FFF8E7;

  --drawer-bg: #FFFBF0;

  --toast-bg: #451A03;
  --toast-text: #FFFBF0;
}
```

---

## 📐 الخط (Typography)

```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

/* الخطوط الأساسية */
:root {
  --font-main: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  /* الأحجام */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */

  /* ارتفاع السطر */
  --leading-tight: 1.4;
  --leading-normal: 1.8;     /* مريح للعربي */
  --leading-relaxed: 2.0;

  /* وضع التركيز - خط أكبر */
  --text-focus-base: 1.125rem;   /* 18px */
  --leading-focus: 2.0;
}

body {
  font-family: var(--font-main);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  direction: rtl;
  text-align: right;
}
```

---

## 📱 نقاط الكسر (Breakpoints)

```
Mobile:  0px    - 639px    → sm في Tailwind
Tablet:  640px  - 1023px   → md في Tailwind
Desktop: 1024px - 1279px   → lg في Tailwind
Wide:    1280px+           → xl في Tailwind
```

```typescript
// hooks/useMediaQuery.ts
// الثوابت
const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1280,
} as const;

// Hook
function useMediaQuery() {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;
  // ... مع ResizeObserver للتحديث التلقائي
}
```

---

## 🖥️ المكونات بالتفصيل الكامل

---

### 1. App.tsx (المكون الرئيسي)

```
المسؤوليات:
├── توفير Theme Context
├── توفير Content Context (النص المكتوب)
├── توفير ViewMode Context
├── الاستماع لـ Smart Paste على مستوى document
├── تحديد Layout حسب حجم الشاشة
└── إدارة حالة FocusMode
```

```typescript
// types/index.ts

type Theme = 'light' | 'dark' | 'warm';

type ViewMode = 'preview' | 'editor' | 'split';

interface AppState {
  content: string;              // النص الخام (Markdown)
  theme: Theme;                 // الثيم الحالي
  viewMode: ViewMode;           // وضع العرض الحالي
  isFocusMode: boolean;         // هل وضع التركيز مفعل
  isDrawerOpen: boolean;        // هل درج الأدوات مفتوح
  isBottomSheetOpen: boolean;   // هل Bottom Sheet مفتوح (موبايل)
  isCopyMenuOpen: boolean;      // هل قائمة النسخ مفتوحة
  lastSaved: number | null;     // timestamp آخر حفظ
  hasUnsavedChanges: boolean;   // هل فيه تغييرات مش محفوظة
  isEmpty: boolean;             // هل المحتوى فارغ (لعرض EmptyState)
}
```

**المنطق الأساسي:**

```
عند فتح الموقع:
├── 1. تحميل الثيم من localStorage (أو light كافتراضي)
├── 2. تحميل آخر محتوى محفوظ من localStorage
├── 3. إذا فيه محتوى محفوظ:
│   ├── عرضه في وضع Preview
│   └── إظهار بانر صغير "نص محفوظ سابقاً - [مسح] [استمرار]"
├── 4. إذا مفيش محتوى:
│   └── عرض EmptyState
├── 5. تفعيل Smart Paste listener على document
└── 6. تفعيل Keyboard shortcuts listener
```

---

### 2. Header.tsx (الشريط العلوي العائم)

#### الشكل النهائي - ديسكتوب (1024px+)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  🍌 NanoMD          [👁️ عرض] [✏️ تحرير] [⚡ مقسوم] [🎯 تركيز]     │
│                                                                  │
│                     [📋 لصق] [📄 نسخ ▾] [🗑️ مسح]  [☀️/🌙] [❓]   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

ملاحظات التصميم:
├── position: sticky; top: 0
├── خلفية شبه شفافة: backdrop-filter: blur(12px)
├── حدود سفلية خفيفة
├── z-index: 50
├── الشعار على اليمين (RTL)
├── الأزرار مقسمة لمجموعتين:
│   ├── الصف الأول: أوضاع العرض
│   └── الصف الثاني: الإجراءات
├── كل مجموعة أزرار في حاوية بحدود دائرية خفيفة
├── الزر النشط (active) له خلفية accent-primary وتأثير بروز
├── حجم الأزرار: h-9 px-3
├── المسافة بين الأزرار: gap-1
├── الأيقونات: 18px من Lucide
└── الأزرار فيها أيقونة + نص (على الديسكتوب)
```

#### الشكل النهائي - تابلت (640px - 1023px)

```
┌──────────────────────────────────────────────┐
│  🍌 NanoMD    [👁️][✏️][⚡][🎯]  [📋][📄▾][🌙] │
└──────────────────────────────────────────────┘

ملاحظات:
├── صف واحد فقط
├── أيقونات فقط بدون نص
├── حجم أصغر: h-8
└── الشعار أصغر
```

#### الشكل النهائي - موبايل (< 640px)

```
┌─────────────────────────────┐
│  🍌 NanoMD      [📄▾] [🌙]  │
└─────────────────────────────┘

ملاحظات:
├── أقل عدد أزرار ممكن في الأعلى
├── فقط: النسخ + الثيم
├── باقي الأزرار في MobileNav (الشريط السفلي)
└── الشعار حجم صغير
```

#### تفاصيل الأزرار

```typescript
// أزرار أوضاع العرض
const viewModeButtons = [
  {
    id: 'preview',
    label: 'عرض',
    icon: 'Eye',          // من Lucide
    shortcut: 'Ctrl+1',
    isDefault: true,       // ← الوضع الافتراضي
  },
  {
    id: 'editor',
    label: 'تحرير',
    icon: 'Pencil',
    shortcut: 'Ctrl+2',
  },
  {
    id: 'split',
    label: 'مقسوم',
    icon: 'Columns2',
    shortcut: 'Ctrl+3',
    hideOnMobile: true,    // ← مش ظاهر على الموبايل
  },
  {
    id: 'focus',
    label: 'تركيز',
    icon: 'Focus',
    shortcut: 'Ctrl+Shift+F',
  },
];

// أزرار الإجراءات
const actionButtons = [
  {
    id: 'paste',
    label: 'لصق',
    icon: 'ClipboardPaste',
    shortcut: 'Ctrl+V',
    action: 'handleSmartPaste',
  },
  {
    id: 'copy',
    label: 'نسخ',
    icon: 'Copy',
    hasDropdown: true,      // ← فيه قائمة منسدلة
    action: 'openCopyMenu',
  },
  {
    id: 'clear',
    label: 'مسح',
    icon: 'Trash2',
    action: 'handleClear',
    requiresConfirmation: true,  // ← يطلب تأكيد قبل المسح
    variant: 'danger',
  },
  {
    id: 'theme',
    label: 'الثيم',
    icon: 'Sun',  // أو 'Moon' أو 'Sunset' حسب الثيم الحالي
    action: 'cycleTheme',    // ← يتنقل بين الثيمات بالدور
  },
  {
    id: 'help',
    label: 'مساعدة',
    icon: 'HelpCircle',
    action: 'toggleHelp',
    hideOnMobile: true,
  },
];
```

---

### 3. EmptyState.tsx (شاشة الترحيب)

```
الشكل:
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│              🍌                          │
│                                         │
│        ألصق نص الـ AI هنا               │
│                                         │
│      Ctrl+V في أي مكان بالصفحة         │
│                                         │
│    ┌─────────────────────────────┐      │
│    │   أو اختر قالباً جاهزاً:    │      │
│    │                             │      │
│    │  [📄 فارغ]  [📝 مقالة]      │      │
│    │  [📋 تقرير] [✅ مهام]       │      │
│    │  [📊 مقارنة] [📚 توثيق]    │      │
│    │                             │      │
│    └─────────────────────────────┘      │
│                                         │
│         أو اسحب ملف .md هنا            │
│         ───────────────────             │
│                                         │
└─────────────────────────────────────────┘
```

```typescript
// utils/templates.ts

interface Template {
  id: string;
  name: string;
  icon: string;        // اسم أيقونة Lucide
  content: string;     // محتوى Markdown
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'فارغ',
    icon: 'File',
    content: '',
  },
  {
    id: 'article',
    name: 'مقالة',
    icon: 'FileText',
    content: `# عنوان المقالة

## المقدمة

اكتب مقدمة المقالة هنا...

## المحتوى الرئيسي

### النقطة الأولى

شرح النقطة الأولى...

### النقطة الثانية

شرح النقطة الثانية...

## الخلاصة

اكتب الخلاصة هنا...

---

*كُتبت بواسطة NanoMD 🍌*`,
  },
  {
    id: 'report',
    name: 'تقرير',
    icon: 'ClipboardList',
    content: `# تقرير: [عنوان التقرير]

**التاريخ:** [التاريخ]
**المعد:** [الاسم]

---

## الملخص التنفيذي

ملخص قصير للتقرير...

## النتائج

| النتيجة | القيمة | الملاحظات |
|---------|--------|----------|
| نتيجة 1 | 100    | ملاحظة   |
| نتيجة 2 | 200    | ملاحظة   |

## التوصيات

1. التوصية الأولى
2. التوصية الثانية
3. التوصية الثالثة

## الخطوات القادمة

- [ ] المهمة الأولى
- [ ] المهمة الثانية
- [ ] المهمة الثالثة`,
  },
  {
    id: 'todo',
    name: 'مهام',
    icon: 'CheckSquare',
    content: `# قائمة المهام

## عاجل ⚡

- [ ] مهمة عاجلة 1
- [ ] مهمة عاجلة 2

## مهم 📌

- [ ] مهمة مهمة 1
- [ ] مهمة مهمة 2

## لاحقاً 📅

- [ ] مهمة مؤجلة 1
- [ ] مهمة مؤجلة 2

---

> **ملاحظة:** رتب مهامك حسب الأولوية`,
  },
  {
    id: 'comparison',
    name: 'مقارنة',
    icon: 'GitCompare',
    content: `# مقارنة: [موضوع المقارنة]

## الخيارات

| المعيار | الخيار أ | الخيار ب | الخيار ج |
|---------|---------|---------|---------|
| السعر   | ⭐⭐⭐  | ⭐⭐    | ⭐       |
| الجودة  | ⭐⭐    | ⭐⭐⭐  | ⭐⭐⭐   |
| السرعة  | ⭐⭐⭐  | ⭐      | ⭐⭐     |

## التحليل

### الخيار أ
نقاط القوة والضعف...

### الخيار ب
نقاط القوة والضعف...

## التوصية النهائية

الخيار الأفضل هو **[الخيار]** للأسباب التالية...`,
  },
  {
    id: 'docs',
    name: 'توثيق',
    icon: 'BookOpen',
    content: `# اسم المشروع

## نظرة عامة

وصف مختصر للمشروع...

## التثبيت

\`\`\`bash
npm install my-package
\`\`\`

## الاستخدام

\`\`\`javascript
import { myFunction } from 'my-package';

const result = myFunction();
console.log(result);
\`\`\`

## API Reference

### \`myFunction(param)\`

| المعامل | النوع   | الوصف        |
|---------|--------|-------------|
| param   | string | وصف المعامل |

**القيمة المرجعة:** \`string\`

## المساهمة

1. Fork المستودع
2. أنشئ فرع: \`git checkout -b feature/amazing\`
3. Commit: \`git commit -m 'إضافة ميزة'\`
4. Push: \`git push origin feature/amazing\`
5. افتح Pull Request`,
  },
];
```

**المنطق:**

```
عند اختيار قالب:
├── 1. وضع محتوى القالب في state.content
├── 2. التحويل لوضع Split (لو ديسكتوب) أو Preview (لو موبايل)
├── 3. إخفاء EmptyState
└── 4. Focus على المحرر (لو Split)
```

**سحب الملفات (Drag & Drop):**

```
├── الملفات المقبولة: .md, .markdown, .txt
├── عند سحب ملف فوق المنطقة:
│   ├── تغيير خلفية المنطقة (border dashed + لون مميز)
│   └── نص: "أفلت الملف هنا"
├── عند الإفلات:
│   ├── قراءة الملف بـ FileReader
│   ├── وضع المحتوى في state.content
│   └── التحويل لوضع Preview
└── عند سحب ملف غير مدعوم:
    └── Toast خطأ: "الملف غير مدعوم. استخدم .md أو .txt"
```

---

### 4. PreviewPane.tsx (لوحة العرض - البطل الرئيسي ⭐)

**هذا أهم مكون في المشروع بالكامل.**

```
المسؤوليات:
├── عرض Markdown كـ HTML منسق
├── دعم RTL كامل
├── تنسيق الجداول بشكل جميل
├── تلوين الأكواد البرمجية
├── تنسيق الاقتباسات
├── تنسيق القوائم
├── تنسيق الروابط
├── تنسيق الصور (responsive)
├── تنسيق العناوين مع هوامش مناسبة
└── Scroll مستقل عن المحرر
```

#### تفاصيل تنسيق كل عنصر

```css
/* preview.css */

/* ========== الحاوية الرئيسية ========== */
.preview-content {
  max-width: 100%;
  padding: 1.5rem;               /* 24px */
  font-family: var(--font-main);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  direction: rtl;
  text-align: right;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* ========== العناوين ========== */
.preview-content h1 {
  font-size: var(--text-3xl);     /* 30px */
  font-weight: 800;
  color: var(--preview-heading);
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid var(--accent-primary);  /* خط موزي تحت H1 */
  line-height: var(--leading-tight);
}

.preview-content h2 {
  font-size: var(--text-2xl);     /* 24px */
  font-weight: 700;
  color: var(--preview-heading);
  margin-top: 1.8rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid var(--border-default);
}

.preview-content h3 {
  font-size: var(--text-xl);      /* 20px */
  font-weight: 700;
  color: var(--preview-heading);
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
}

.preview-content h4, h5, h6 {
  font-size: var(--text-lg);      /* 18px */
  font-weight: 600;
  color: var(--preview-heading);
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
}

/* ========== الفقرات ========== */
.preview-content p {
  margin-bottom: 1rem;
  line-height: var(--leading-normal);  /* 1.8 */
}

/* ========== الروابط ========== */
.preview-content a {
  color: var(--preview-link);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
  transition: color 0.2s, text-decoration-color 0.2s;
}
.preview-content a:hover {
  text-decoration-style: solid;
  opacity: 0.8;
}

/* ========== الكود المضمن (Inline Code) ========== */
.preview-content code:not(pre code) {
  background: var(--preview-code-bg);
  color: var(--accent-primary);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.875em;             /* أصغر شوية من النص العادي */
  direction: ltr;                 /* الكود دايماً LTR */
  display: inline-block;
}

/* ========== كتل الكود (Code Blocks) ========== */
.preview-content pre {
  background: var(--preview-code-bg);
  border: 1px solid var(--border-default);
  border-radius: 12px;            /* حواف دائرية كبيرة - روح نانو بنانا */
  padding: 1.25rem;
  margin: 1.25rem 0;
  overflow-x: auto;
  direction: ltr;                 /* الكود دايماً LTR */
  text-align: left;
  position: relative;
}

.preview-content pre code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  background: none;
  padding: 0;
}

/* زر نسخ الكود (يظهر عند hover) */
.preview-content pre:hover .code-copy-btn {
  opacity: 1;
}
.code-copy-btn {
  position: absolute;
  top: 8px;
  left: 8px;                     /* LTR للكود */
  opacity: 0;
  transition: opacity 0.2s;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

/* ========== الاقتباسات (Blockquotes) ========== */
.preview-content blockquote {
  background: var(--preview-blockquote-bg);
  border-right: 4px solid var(--preview-blockquote-border);  /* RTL: يمين */
  border-left: none;
  margin: 1.25rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0 12px 12px 0;  /* RTL: حواف يسار دائرية */
  color: var(--text-secondary);
  font-style: italic;
}

.preview-content blockquote p:last-child {
  margin-bottom: 0;
}

/* ========== الجداول (Tables) - تصميم "بطاقات" ========== */
.preview-content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.25rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-default);
  font-size: 0.9rem;
}

.preview-content thead {
  background: var(--preview-table-header-bg);
}

.preview-content th {
  font-weight: 700;
  padding: 0.75rem 1rem;
  text-align: right;              /* RTL */
  border-bottom: 2px solid var(--border-default);
  color: var(--text-primary);
}

.preview-content td {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--border-default);
  color: var(--text-secondary);
}

.preview-content tbody tr:nth-child(even) {
  background: var(--preview-table-row-alt);
}

.preview-content tbody tr:last-child td {
  border-bottom: none;
}

.preview-content tbody tr:hover {
  background: var(--preview-code-bg);
  transition: background 0.2s;
}

/* ========== القوائم ========== */
.preview-content ul {
  list-style: none;
  padding-right: 1.5rem;          /* RTL */
  padding-left: 0;
  margin: 0.75rem 0;
}

.preview-content ul li {
  position: relative;
  margin-bottom: 0.4rem;
  padding-right: 1rem;
}

.preview-content ul li::before {
  content: '●';
  color: var(--accent-primary);   /* نقطة بلون الموز */
  position: absolute;
  right: 0;
  font-size: 0.6em;
  top: 0.5em;
}

.preview-content ol {
  padding-right: 1.5rem;
  padding-left: 0;
  margin: 0.75rem 0;
  counter-reset: item;
  list-style: none;
}

.preview-content ol li {
  counter-increment: item;
  margin-bottom: 0.4rem;
  padding-right: 1.5rem;
  position: relative;
}

.preview-content ol li::before {
  content: counter(item);
  color: var(--accent-primary);
  font-weight: 700;
  position: absolute;
  right: 0;
  background: var(--preview-code-bg);
  width: 1.4em;
  height: 1.4em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  top: 0.2em;
}

/* ========== Checkbox Lists ========== */
.preview-content input[type="checkbox"] {
  appearance: none;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid var(--border-hover);
  border-radius: 4px;
  margin-left: 0.5rem;
  vertical-align: middle;
  cursor: pointer;
  position: relative;
}

.preview-content input[type="checkbox"]:checked {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.preview-content input[type="checkbox"]:checked::after {
  content: '✓';
  color: white;
  font-size: 0.8em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ========== الخط الأفقي ========== */
.preview-content hr {
  border: none;
  height: 3px;
  background: linear-gradient(
    to left,
    transparent,
    var(--accent-primary),
    transparent
  );
  margin: 2rem 0;
  border-radius: 2px;
}

/* ========== الصور ========== */
.preview-content img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 1rem 0;
  box-shadow: var(--shadow-md);
}

/* ========== النص الغامق والمائل ========== */
.preview-content strong {
  font-weight: 700;
  color: var(--text-primary);
}

.preview-content em {
  font-style: italic;
  color: var(--text-secondary);
}

.preview-content del {
  text-decoration: line-through;
  color: var(--text-muted);
}
```

**على الموبايل:**

```css
@media (max-width: 639px) {
  .preview-content {
    padding: 1rem;
    font-size: 0.9375rem;         /* 15px - أصغر شوية */
  }

  .preview-content h1 {
    font-size: 1.5rem;            /* 24px */
  }

  .preview-content h2 {
    font-size: 1.25rem;           /* 20px */
  }

  .preview-content pre {
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.8rem;
  }

  .preview-content table {
    font-size: 0.8rem;
    display: block;
    overflow-x: auto;             /* Scroll أفقي للجداول الكبيرة */
    -webkit-overflow-scrolling: touch;
  }
}
```

---

### 5. EditorPane.tsx (المحرر)

```
المسؤوليات:
├── textarea بسيط مع RTL
├── أرقام الأسطر (Line Numbers)
├── Placeholder نص
├── Auto-resize (يكبر مع المحتوى)
├── Tab key support (إدراج مسافات)
├── حفظ تلقائي (debounce 3 ثواني)
└── عرض عدد الكلمات في الأسفل
```

```
الشكل:
┌─────────────────────────────────────┐
│  1 │ # عنوان المقالة                │
│  2 │                                │
│  3 │ ## المقدمة                     │
│  4 │                                │
│  5 │ هذا نص **غامق** وهذا *مائل*   │
│  6 │                                │
│  7 │ - عنصر 1                       │
│  8 │ - عنصر 2                       │
│  9 │                                │
│ 10 │ > اقتباس مهم                   │
│    │                                │
│    │                                │
├─────────────────────────────────────┤
│  ⏐ الكلمات: 45 | الأحرف: 230      │
└─────────────────────────────────────┘
```

```typescript
// EditorPane.tsx - المنطق

interface EditorPaneProps {
  content: string;
  onChange: (value: string) => void;
  isActive: boolean;               // هل المحرر هو الـ Focus
}

// المميزات:
// 1. Line Numbers
//    - div جانبي يحتوي أرقام الأسطر
//    - يتزامن مع scroll الـ textarea
//    - لون خافت: var(--text-muted)
//    - عرض ثابت: 3rem

// 2. Tab Support
//    - عند ضغط Tab: إدراج '  ' (مسافتين)
//    - عند ضغط Shift+Tab: إزالة مسافتين من أول السطر
//    - e.preventDefault() لمنع الانتقال للعنصر التالي

// 3. Auto Resize
//    - لا نحتاج. الtextarea يكون height: 100% من الحاوية
//    - مع overflow-y: auto

// 4. Placeholder
//    - "ابدأ الكتابة بصيغة Markdown..."

// 5. التنسيق
//    - خط: var(--font-mono) لأنه كود
//    - لون خلفية: var(--bg-secondary)
//    - بدون حدود ظاهرة (borderless)
//    - padding: 1rem
//    - direction: rtl (لكن الكود يكتب LTR تلقائياً)
```

**إحصائيات النص:**

```typescript
function getStats(content: string) {
  const text = content.trim();
  if (!text) return { words: 0, chars: 0, lines: 0, readTime: 0 };

  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;
  const readTime = Math.ceil(words / 200);  // 200 كلمة/دقيقة

  return { words, chars, lines, readTime };
}

// يظهر في footer المحرر:
// "الكلمات: 45 | الأحرف: 230 | الأسطر: 10 | وقت القراءة: ≈ 1 دقيقة"
```

---

### 6. SplitView.tsx (العرض المقسوم)

```
ديسكتوب (⅓ محرر + ⅔ عرض):
┌────────────────────────────────────────────────────┐
│                      Header                        │
├──────────────┬─────────────────────────────────────┤
│              │                                     │
│   المحرر    ┃     لوحة العرض                      │
│    (33%)    ┃      (67%)                           │
│              ┃                                     │
│              ┃                                     │
│              ┃                                     │
└──────────────┴─────────────────────────────────────┘

ملاحظة: ┃ = فاصل قابل للسحب (Resizable Divider)
├── المستخدم يقدر يسحبه يمين/شمال
├── الحد الأدنى: 20% لكل جانب
├── الحد الأقصى: 80% لكل جانب
├── عند السحب: cursor: col-resize
└── يحفظ النسبة في localStorage
```

```
تابلت (⅓ محرر + ⅔ عرض):
├── نفس الديسكتوب لكن
├── الفاصل غير قابل للسحب (ثابت)
└── النسبة ثابتة ⅓/⅔
```

```
موبايل:
├── مفيش Split
├── بدله: Tabs في الشريط السفلي
│   [👁️ عرض] [✏️ تحرير]
├── التبديل بـ animation fade (200ms)
└── يحفظ آخر وضع تم اختياره
```

---

### 7. FocusMode.tsx (وضع التركيز)

```
الشكل:
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    [✕ إغلاق]                        │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │                             │             │
│         │  # عنوان المقالة            │             │
│         │                             │             │
│         │  المحتوى يظهر هنا           │             │
│         │  بخط أكبر                    │             │
│         │  وهوامش واسعة              │             │
│         │  مع خلفية هادئة             │             │
│         │                             │             │
│         │  الجداول والأكواد            │             │
│         │  تظهر بنفس التنسيق          │             │
│         │  لكن بحجم أكبر             │             │
│         │                             │             │
│         └─────────────────────────────┘             │
│                                                     │
│              خلفية: var(--focus-bg)                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

```typescript
// FocusMode.tsx

interface FocusModeProps {
  content: string;
  isActive: boolean;
  onClose: () => void;
}

// المواصفات:
// - Full screen (position: fixed, inset: 0, z-index: 100)
// - خلفية: var(--focus-bg)
// - المحتوى: max-width: 720px, margin: 0 auto
// - padding: 3rem (ديسكتوب) / 1.5rem (موبايل)
// - font-size: var(--text-focus-base) = 18px
// - line-height: var(--leading-focus) = 2.0
// - زر الإغلاق: position: fixed, top: 1rem, left: 1rem
// - يفتح بـ: Ctrl+Shift+F أو زر 🎯
// - يقفل بـ: Escape أو زر ✕
// - Animation: fade in 300ms ease
// - Scroll: overflow-y: auto (الصفحة كلها تسكرول)
// - على الموبايل: يستخدم Fullscreen API لو متاح
```

---

### 8. ToolDrawer.tsx (درج الأدوات - ديسكتوب)

```
الشكل (مغلق):
┌──────────────────┐
│                  │
│   المحرر         │
│                  │[🔧] ← زر صغير على حافة المحرر
│                  │
└──────────────────┘

الشكل (مفتوح):
┌──────────────────┬──┐
│                  │B │
│   المحرر         │I │
│                  │H │
│                  │🔗│
│                  │📝│
│                  │☰ │
│                  │<>│
│                  │"" │
│                  │📊│
│                  │──│
└──────────────────┴──┘
```

```typescript
// أزرار الدرج بالترتيب
const drawerTools = [
  {
    id: 'bold',
    icon: 'Bold',
    label: 'غامق',
    shortcut: 'Ctrl+B',
    action: (text: string, selStart: number, selEnd: number) => {
      // يلف النص المحدد بـ **
      return wrapSelection(text, selStart, selEnd, '**', '**');
    },
  },
  {
    id: 'italic',
    icon: 'Italic',
    label: 'مائل',
    shortcut: 'Ctrl+I',
    action: (text, selStart, selEnd) => {
      return wrapSelection(text, selStart, selEnd, '*', '*');
    },
  },
  {
    id: 'heading',
    icon: 'Heading',
    label: 'عنوان',
    shortcut: 'Ctrl+H',
    action: (text, selStart, selEnd) => {
      // يضيف # في أول السطر الحالي
      // لو فيه # يضيف واحد كمان (حتى 6)
      return toggleHeading(text, selStart);
    },
  },
  {
    id: 'link',
    icon: 'Link',
    label: 'رابط',
    shortcut: 'Ctrl+K',
    action: (text, selStart, selEnd) => {
      const selectedText = text.slice(selStart, selEnd) || 'النص';
      return insertAt(text, selStart, selEnd, `[${selectedText}](الرابط)`);
    },
  },
  {
    id: 'list-unordered',
    icon: 'List',
    label: 'قائمة',
    action: (text, selStart, selEnd) => {
      return prependLine(text, selStart, '- ');
    },
  },
  {
    id: 'list-ordered',
    icon: 'ListOrdered',
    label: 'قائمة مرقمة',
    action: (text, selStart, selEnd) => {
      return prependLine(text, selStart, '1. ');
    },
  },
  {
    id: 'code-inline',
    icon: 'Code',
    label: 'كود',
    action: (text, selStart, selEnd) => {
      return wrapSelection(text, selStart, selEnd, '`', '`');
    },
  },
  {
    id: 'code-block',
    icon: 'FileCode',
    label: 'كتلة كود',
    action: (text, selStart, selEnd) => {
      return wrapSelection(text, selStart, selEnd, '\n```\n', '\n```\n');
    },
  },
  {
    id: 'blockquote',
    icon: 'Quote',
    label: 'اقتباس',
    action: (text, selStart, selEnd) => {
      return prependLine(text, selStart, '> ');
    },
  },
  {
    id: 'table',
    icon: 'Table',
    label: 'جدول',
    action: (text, selStart, selEnd) => {
      const table = `\n| العمود 1 | العمود 2 | العمود 3 |\n|---------|---------|----------|\n| خلية 1  | خلية 2  | خلية 3   |\n| خلية 4  | خلية 5  | خلية 6   |\n`;
      return insertAt(text, selStart, selStart, table);
    },
  },
  {
    id: 'hr',
    icon: 'Minus',
    label: 'خط أفقي',
    action: (text, selStart, selEnd) => {
      return insertAt(text, selStart, selStart, '\n---\n');
    },
  },
  {
    id: 'checkbox',
    icon: 'CheckSquare',
    label: 'مهمة',
    action: (text, selStart, selEnd) => {
      return prependLine(text, selStart, '- [ ] ');
    },
  },
];

// دوال المساعدة
function wrapSelection(
  text: string,
  start: number,
  end: number,
  before: string,
  after: string
): { newText: string; newCursorPos: number } {
  const selected = text.slice(start, end);
  const newText = text.slice(0, start) + before + selected + after + text.slice(end);
  return {
    newText,
    newCursorPos: start + before.length + selected.length + after.length,
  };
}

function prependLine(
  text: string,
  cursorPos: number,
  prefix: string
): { newText: string; newCursorPos: number } {
  // يلاقي أول السطر الحالي ويضيف الـ prefix
  const lineStart = text.lastIndexOf('\n', cursorPos - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  return {
    newText,
    newCursorPos: cursorPos + prefix.length,
  };
}

function insertAt(
  text: string,
  start: number,
  end: number,
  insertion: string
): { newText: string; newCursorPos: number } {
  const newText = text.slice(0, start) + insertion + text.slice(end);
  return {
    newText,
    newCursorPos: start + insertion.length,
  };
}
```

**التصميم:**

```
├── عرض الدرج: 48px (مفتوح) / 0px (مغلق)
├── خلفية: var(--drawer-bg)
├── حدود: border-left: 1px solid var(--border-default)
├── Animation: width 200ms ease-out
├── كل زر: 40x40px مع tooltip عند hover
├── الأيقونات: 18px
├── لون الأيقونات: var(--text-secondary)
├── لون hover: var(--accent-primary)
├── الدرج يظهر فقط في وضع editor أو split
├── يختفي في وضع preview و focus
├── أول مرة يفتح الموقع: الدرج مفتوح (لو فيه محتوى)
└── يحفظ حالته (مفتوح/مغلق) في localStorage
```

---

### 9. BottomSheet.tsx (درج الأدوات - موبايل)

```
الشكل (مغلق):
┌─────────────────────┐
│                     │
│      المحرر         │
│                     │
│                     │
├─────────────────────┤
│ [👁️ عرض] [✏️ تحرير]│
└─────────────────────┘
          [🔧] ← FAB (Floating Action Button)

الشكل (مفتوح):
┌─────────────────────┐
│      المحرر         │
│                     │
├─────────────────────┤
│ ═══════════         │ ← Handle (سحب)
│                     │
│ [B] [I] [H] [🔗]   │
│ [📋][☰] [<>][📊]   │
│ [✅] [──] [""] [📁] │
│                     │
│ [💾 حفظ ملف]  [🗑️] │
│                     │
├─────────────────────┤
│ [👁️ عرض] [✏️ تحرير]│
└─────────────────────┘

المواصفات:
├── position: fixed, bottom: 60px (فوق MobileNav)
├── width: 100%
├── max-height: 50vh
├── background: var(--drawer-bg)
├── border-radius: 20px 20px 0 0 (أعلى فقط)
├── box-shadow: var(--shadow-lg)
├── z-index: 40
├── Handle: عرض 40px, ارتفاع 4px, مركز, لون رمادي
├── يُسحب لأعلى/لأسفل (touch gesture)
├── Overlay خلفه: rgba(0,0,0,0.3) - يقفل لما تضغط عليه
├── Animation: transform translateY 300ms ease
├── FAB: 48x48px, دائري, لون accent-primary
│   ├── position: fixed
│   ├── bottom: 80px
│   ├── left: 16px (RTL: left لأنه بعيد عن الإبهام اليمين)
│   ├── z-index: 35
│   └── box-shadow: var(--shadow-lg)
└── يظهر الFAB فقط في وضع التحرير على الموبايل
```

---

### 10. MobileNav.tsx (شريط التبويبات السفلي - موبايل فقط)

```
الشكل:
┌───────────────────────────┐
│      👁️        ✏️         │
│     عرض      تحرير       │
└───────────────────────────┘

المواصفات:
├── يظهر فقط على الموبايل (< 640px)
├── position: fixed, bottom: 0
├── width: 100%
├── height: 56px
├── background: var(--bg-primary)
├── border-top: 1px solid var(--border-default)
├── z-index: 50
├── تبويبتين فقط: عرض + تحرير
├── التبويب النشط: لون accent-primary + خط تحته
├── التبويب غير النشط: لون text-muted
├── الأيقونات: 22px
├── النص: 11px
├── safe-area-inset-bottom للآيفون (الشريط السفلي)
├── Animation: التبديل بـ fade 200ms
└── لما يكون في وضع التركيز: يختفي
```

---

### 11. CopyMenu.tsx (قائمة النسخ)

```
الشكل (عند الضغط على زر نسخ):
          ┌────────────────────────┐
          │  📋 نسخ كنص منسق      │ ← Rich Text (للإيميل/Word)
          │  📝 نسخ كـ Markdown   │ ← النص الخام
          │  💻 نسخ كـ HTML       │ ← كود HTML
          │  🖨️ طباعة / PDF      │ ← window.print()
          │  💾 حفظ كملف .md     │ ← تحميل ملف
          └────────────────────────┘
```

```typescript
// utils/clipboard.ts

// 1. نسخ كنص منسق (Rich Text) ← الأهم!
async function copyRichText(
  markdownContent: string,
  previewElement: HTMLElement
): Promise<void> {
  try {
    const htmlContent = previewElement.innerHTML;
    const plainText = previewElement.innerText;

    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([plainText], { type: 'text/plain' });

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      }),
    ]);
  } catch (err) {
    // Fallback للمتصفحات القديمة
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(previewElement);
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.execCommand('copy');
    selection?.removeAllRanges();
  }
}

// 2. نسخ كـ Markdown (النص الخام)
async function copyMarkdown(content: string): Promise<void> {
  await navigator.clipboard.writeText(content);
}

// 3. نسخ كـ HTML
async function copyHTML(previewElement: HTMLElement): Promise<void> {
  const html = previewElement.innerHTML;
  await navigator.clipboard.writeText(html);
}

// 4. طباعة / PDF
function printContent(): void {
  window.print();
  // CSS @media print يتحكم في الشكل
}

// 5. حفظ كملف .md
function saveAsFile(content: string, filename: string = 'document.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

```
المواصفات:
├── position: absolute (تحت زر النسخ)
├── background: var(--bg-primary)
├── border: 1px solid var(--border-default)
├── border-radius: 12px
├── box-shadow: var(--shadow-lg)
├── padding: 8px
├── z-index: 60
├── كل عنصر: padding: 10px 16px
├── كل عنصر hover: background: var(--bg-secondary)
├── border-radius لكل عنصر: 8px
├── يقفل لما تضغط برا القائمة
├── يقفل لما تختار عنصر
├── Animation: scale(0.95) → scale(1) + opacity 150ms
└── على الموبايل: يظهر كـ Bottom Sheet بدل Dropdown
```

---

### 12. Toast.tsx (الإشعارات)

```
الشكل:
         ┌────────────────────────────┐
         │  ✅  تم النسخ بنجاح! 🍌   │
         └────────────────────────────┘

أنواع الإشعارات:
├── success: "✅ تم النسخ بنجاح! 🍌"
├── success: "💾 تم الحفظ تلقائياً"
├── success: "📄 تم حفظ الملف"
├── warning: "⚠️ هل تريد مسح المحتوى؟"
├── error: "❌ فشل النسخ. حاول مرة أخرى"
├── info: "📋 تم لصق النص"
└── info: "🍌 مرحباً بك في NanoMD!"

المواصفات:
├── position: fixed
├── الموبايل: bottom: 72px (فوق MobileNav), مركز أفقياً
├── الديسكتوب: top: 80px (تحت Header), مركز أفقياً
├── max-width: 400px
├── width: fit-content
├── padding: 12px 20px
├── background: var(--toast-bg)
├── color: var(--toast-text)
├── border-radius: 12px
├── box-shadow: var(--shadow-lg)
├── z-index: 200
├── font-size: 14px
├── font-weight: 500
├── مدة العرض: 3 ثواني
├── Animation دخول: translateY(20px) + opacity(0) → normal (300ms)
├── Animation خروج: normal → translateY(-20px) + opacity(0) (300ms)
└── لو فيه أكثر من toast: يتكدسوا فوق بعض مع gap: 8px
```

---

### 13. ThemeToggle.tsx

```
السلوك:
├── ضغطة واحدة: light → dark → warm → light (دورة)
├── الأيقونة تتغير:
│   ├── light: ☀️ (Sun)
│   ├── dark: 🌙 (Moon)
│   └── warm: 🌅 (Sunset)
├── Animation: rotate(180deg) أثناء التبديل (300ms)
├── يحفظ الاختيار في localStorage
├── يطبق data-theme على <html>
└── Tooltip: "تبديل المظهر (فاتح/داكن/دافئ)"
```

---

### 14. SaveIndicator.tsx

```
الحالات:
├── "تم الحفظ ✓"     → لون أخضر (var(--accent-success))
├── "جاري الحفظ..."  → لون رمادي + دوران أيقونة
├── "تغييرات غير محفوظة" → لون برتقالي (var(--accent-primary))
└── (فارغ)            → لا يظهر شيء

المكان:
├── ديسكتوب: في يسار الشريط العلوي (آخر عنصر)
├── موبايل: لا يظهر (توفير مساحة)
└── حجم صغير: text-xs, لون text-muted
```

---

## ⌨️ اختصارات لوحة المفاتيح

```typescript
// hooks/useKeyboard.ts

const shortcuts: Shortcut[] = [
  // أوضاع العرض
  { keys: 'Ctrl+1',       action: 'setViewMode("preview")' },
  { keys: 'Ctrl+2',       action: 'setViewMode("editor")' },
  { keys: 'Ctrl+3',       action: 'setViewMode("split")' },
  { keys: 'Ctrl+Shift+F', action: 'toggleFocusMode()' },

  // التنسيق (تعمل فقط لما المحرر active)
  { keys: 'Ctrl+B',       action: 'formatBold()',       editorOnly: true },
  { keys: 'Ctrl+I',       action: 'formatItalic()',     editorOnly: true },
  { keys: 'Ctrl+K',       action: 'formatLink()',       editorOnly: true },
  { keys: 'Ctrl+Shift+K', action: 'formatCode()',       editorOnly: true },

  // الإجراءات
  { keys: 'Ctrl+S',       action: 'saveFile()' },         // Override browser save
  { keys: 'Ctrl+Shift+C', action: 'copyRichText()' },
  { keys: 'Escape',       action: 'closeFocusMode() || closeMenu()' },

  // التحرير
  { keys: 'Tab',          action: 'insertTab()',         editorOnly: true },
  { keys: 'Shift+Tab',    action: 'removeTab()',         editorOnly: true },
];

// ملاحظات:
// - Ctrl+S لازم e.preventDefault() لمنع حفظ الصفحة
// - Tab لازم e.preventDefault() لمنع الانتقال
// - كل shortcut يعرض Toast صغير عند التنفيذ
```

---

## 🧠 Smart Paste (اللصق الذكي)

```typescript
// hooks/useSmartPaste.ts

function useSmartPaste(
  setContent: (content: string) => void,
  setViewMode: (mode: ViewMode) => void,
  content: string,
  viewMode: ViewMode
) {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // 1. لو الـ focus على input أو textarea (المحرر) → لا تتدخل
      const activeEl = document.activeElement;
      const isInEditor = activeEl?.tagName === 'TEXTAREA' &&
                         activeEl?.classList.contains('editor-textarea');

      if (isInEditor) {
        // اللصق العادي في المحرر - لا تتدخل
        return;
      }

      // 2. لو الـ focus على أي input/textarea تاني → لا تتدخل
      if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') {
        return;
      }

      // 3. Smart Paste!
      e.preventDefault();

      const pastedText = e.clipboardData?.getData('text/plain') || '';

      if (!pastedText.trim()) return;

      // 4. لو المحتوى فاضي → حط النص مباشرة
      if (!content.trim()) {
        setContent(pastedText);
        setViewMode('preview');
        showToast('success', '📋 تم لصق النص');
        return;
      }

      // 5. لو فيه محتوى → اسأل المستخدم
      if (confirm('يوجد محتوى حالي. هل تريد استبداله بالنص الجديد؟')) {
        setContent(pastedText);
        setViewMode('preview');
        showToast('success', '📋 تم استبدال النص');
      }
      // لو ضغط "لا" → لا تعمل حاجة
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [content, viewMode]);
}
```

---

## 💾 نظام التخزين

```typescript
// hooks/useLocalStorage.ts و hooks/useAutoSave.ts

// المفاتيح في localStorage:
const STORAGE_KEYS = {
  CONTENT: 'nanomd_content',           // النص الحالي
  THEME: 'nanomd_theme',              // الثيم المختار
  VIEW_MODE: 'nanomd_viewMode',       // وضع العرض
  DRAWER_STATE: 'nanomd_drawerOpen',  // حالة الدرج
  SPLIT_RATIO: 'nanomd_splitRatio',   // نسبة التقسيم
  LAST_SAVED: 'nanomd_lastSaved',     // وقت آخر حفظ
  VERSION_HISTORY: 'nanomd_history',  // سجل النسخ
} as const;

// الحفظ التلقائي (Auto Save):
// - debounce: 3 ثواني بعد آخر تعديل
// - يحفظ content في localStorage
// - يحدث lastSaved timestamp
// - يحفظ نسخة في VERSION_HISTORY (آخر 5 نسخ فقط)

// Version History:
interface VersionEntry {
  content: string;
  timestamp: number;
  wordCount: number;
}

// الحد الأقصى: 5 نسخ
// كل نسخة يتم حفظها كل 5 دقائق (مش كل 3 ثواني)
// لما المساحة تقرب تخلص (> 4MB) → حذف أقدم نسخة

// دالة debounce بسيطة (بدون lodash):
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
```

---

## 🖨️ أنماط الطباعة

```css
/* globals.css */

@media print {
  /* إخفاء كل شيء عدا المعاينة */
  .header,
  .mobile-nav,
  .editor-pane,
  .tool-drawer,
  .bottom-sheet,
  .fab-button,
  .toast,
  .save-indicator,
  .copy-menu {
    display: none !important;
  }

  /* المعاينة تاخد كل المساحة */
  .preview-pane {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* ألوان مناسبة للطباعة */
  body {
    color: #000 !important;
    background: #fff !important;
    font-size: 12pt !important;
    line-height: 1.6 !important;
  }

  /* الروابط تعرض الURL */
  .preview-content a[href]::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
    color: #666;
  }

  /* الجداول */
  .preview-content table {
    border: 1px solid #000 !important;
  }

  .preview-content th,
  .preview-content td {
    border: 1px solid #333 !important;
  }

  /* page breaks */
  .preview-content h1,
  .preview-content h2 {
    page-break-after: avoid;
  }

  .preview-content pre,
  .preview-content table {
    page-break-inside: avoid;
  }
}
```

---

## 🏗️ Configuration Files

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown': ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
});
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'Segoe UI', 'Tahoma', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        banana: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      maxWidth: {
        'focus': '720px',
      },
      zIndex: {
        'drawer': '30',
        'fab': '35',
        'bottom-sheet': '40',
        'header': '50',
        'copy-menu': '60',
        'focus-mode': '100',
        'toast': '200',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="description" content="NanoMD - عارض ماركداون ذكي للنصوص العربية. ألصق نص AI واقرأه بأجمل شكل." />
  <meta name="theme-color" content="#F59E0B" />

  <!-- Open Graph -->
  <meta property="og:title" content="NanoMD 🍌 - عارض ماركداون ذكي" />
  <meta property="og:description" content="ألصق نص AI واقرأه بأجمل شكل" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:type" content="website" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <title>NanoMD 🍌</title>
</head>
<body class="font-cairo">
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 📊 ملخص الأحجام المتوقعة

```
المكون                    الحجم (gzipped)
────────────────────────  ───────────────
React + ReactDOM          ~  44 KB
react-markdown            ~  12 KB
remark-gfm                ~   5 KB
rehype-highlight          ~  30 KB (6 لغات)
rehype-sanitize           ~   3 KB
Lucide (15 أيقونة)        ~   4 KB
Tailwind CSS (purged)     ~  10 KB
Google Font (Cairo)       ~  15 KB
كود التطبيق              ~  12 KB
────────────────────────  ───────────────
المجموع                   ~ 135 KB ✅

اللغات المدعومة في rehype-highlight (6 فقط لتقليل الحجم):
├── javascript / typescript
├── python
├── html / css
├── json
├── bash
└── sql
```

---

## ✅ قائمة المهام للمبرمج (Checklist)

```
المرحلة 1: الإعداد (يوم 1)
├── [ ] إنشاء مشروع Vite + React + TypeScript
├── [ ] تثبيت كل الحزم من package.json
├── [ ] إعداد Tailwind CSS
├── [ ] إعداد ملفات الإعداد (vite.config, tsconfig, tailwind.config)
├── [ ] إنشاء هيكل المجلدات
├── [ ] إعداد CSS Variables للثيمات الثلاثة
├── [ ] إعداد الخط (Cairo من Google Fonts)
└── [ ] إعداد index.html مع RTL

المرحلة 2: المكونات الأساسية (يوم 2-3)
├── [ ] App.tsx مع Context Providers
├── [ ] types/index.ts
├── [ ] EmptyState.tsx مع القوالب
├── [ ] PreviewPane.tsx مع كل أنماط CSS
├── [ ] EditorPane.tsx مع Line Numbers
├── [ ] Header.tsx (ديسكتوب + تابلت + موبايل)
└── [ ] MobileNav.tsx

المرحلة 3: الأوضاع والعرض (يوم 4)
├── [ ] SplitView.tsx مع Resizable Divider
├── [ ] FocusMode.tsx
├── [ ] useViewMode.ts
├── [ ] useMediaQuery.ts
└── [ ] Responsive logic في App.tsx

المرحلة 4: الأدوات والتحرير (يوم 5-6)
├── [ ] ToolDrawer.tsx (ديسكتوب)
├── [ ] BottomSheet.tsx (موبايل)
├── [ ] كل دوال التنسيق (wrapSelection, prependLine, insertAt)
├── [ ] useKeyboard.ts (كل الاختصارات)
└── [ ] Tab/Shift+Tab في المحرر

المرحلة 5: النسخ واللصق (يوم 7)
├── [ ] useSmartPaste.ts
├── [ ] CopyMenu.tsx
├── [ ] clipboard.ts (copyRichText, copyMarkdown, copyHTML)
├── [ ] export.ts (saveAsFile, printContent)
└── [ ] Toast.tsx

المرحلة 6: التخزين والحفظ (يوم 8)
├── [ ] useLocalStorage.ts
├── [ ] useAutoSave.ts (debounce 3 ثواني)
├── [ ] SaveIndicator.tsx
├── [ ] ThemeToggle.tsx (دورة بين 3 ثيمات)
└── [ ] حفظ/استعادة: content, theme, viewMode, drawerState

المرحلة 7: التحسين والاختبار (يوم 9-10)
├── [ ] اختبار RTL كامل (عربي خالص)
├── [ ] اختبار على Chrome, Firefox, Safari
├── [ ] اختبار على iPhone, Android
├── [ ] اختبار على تابلت
├── [ ] اختبار Smart Paste
├── [ ] اختبار Copy Rich Text في Word/Gmail
├── [ ] اختبار الطباعة (Ctrl+P)
├── [ ] اختبار الجداول الكبيرة
├── [ ] اختبار الأكواد الطويلة
├── [ ] اختبار نص طويل (5000+ كلمة)
├── [ ] أنماط الطباعة (@media print)
├── [ ] Performance check (Lighthouse > 90)
├── [ ] تحسين حجم Bundle
└── [ ] Drag & Drop ملفات .md

المرحلة 8: النشر (يوم 11)
├── [ ] إنشاء GitHub repo
├── [ ] رفع الكود
├── [ ] ربط Cloudflare Pages
├── [ ] إعداد Build settings (npm run build, dist)
├── [ ] اختبار الموقع المنشور
├── [ ] التأكد من HTTPS
└── [ ] README.md
```

---

## 🚫 ما لا نفعله في هذا الإصدار (MVP)

```
❌ مؤجل للإصدار 2:
├── قراءة النص بالصوت (TTS)
├── Gemini API integration
├── العرض التقديمي (Slides)
├── دعم اللغة الإنجليزية (i18n)
├── CodeMirror (محرر متقدم)
├── PWA / Service Worker / Offline
├── نظام التبويبات (Multi-doc)
├── Scroll متزامن
├── البحث والاستبدال
├── LaTeX / معادلات رياضية
├── Mermaid diagrams
├── استيراد من Word (.docx)
├── Cloudflare Workers (Backend)
├── تتبع الأخطاء (Error tracking)
├── تحليلات الاستخدام (Analytics)
└── نسخة Desktop/Mobile App
```

---

**هذه المواصفة كاملة وجاهزة للتنفيذ الفوري. أي مبرمج يقرأها يقدر يبني NanoMD بالظبط كما هو متصور.** 🍌🚀