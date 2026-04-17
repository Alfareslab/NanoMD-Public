# 🗺️ NanoMD v1.1.0 — Improvements Implementation Plan

> **الإصدار:** 1.0.0
> **التاريخ:** 2026-04-08
> **المنهجية:** Multi-Model Development
> **المرجع:** [nanomd-improvements.md](file:///d:/MyProjects/Nano-IDE/NanoMD/improvements/nanomd-improvements.md)

---

## ⚖️ القواعد الحاكمة

- **الدستور:**
`master-constitution.md`
- **التقنيات:** React + TypeScript + Vite + Tailwind CSS + Lucide-React
- **أسلوب الكود:** PascalCase للكلاسات، camelCase للمتغيرات، kebab-case للملفات
- **لا ديون تقنية:** ممنوع الكود المؤقت
- **التوثيق:** كل تغيير ينعكس في `project-context.md` + `project-key.md` + `changelog.md`

---

## 🎯 الهدف العام

تنفيذ 5 تحسينات على NanoMD لتطوير تجربة الاستخدام في وضع المراجعة (Review Mode) وإضافة طرق إدخال جديدة:

| # | التحسين | الأولوية |
|---|---------|----------|
| 1 | URL Hash Loading | 🔴 عالية |
| 2 | Split Columns (Item + Recommendation) | 🔴 عالية |
| 3 | Section Separator Row | 🟠 متوسطة |
| 4 | Section Background Colors | 🟠 متوسطة |
| 5 | File Upload Button | 🟢 منخفضة |

---

## 📁 خريطة الملفات المتأثرة

| الملف | التحسينات | نوع التعديل |
|-------|-----------|-------------|
| [App.tsx](file:///d:/MyProjects/Nano-IDE/NanoMD/src/App.tsx) | 1 | تعديل |
| [PreviewPane.tsx](file:///d:/MyProjects/Nano-IDE/NanoMD/src/components/preview/PreviewPane.tsx) | 2 | تعديل |
| [ReviewTable.tsx](file:///d:/MyProjects/Nano-IDE/NanoMD/src/components/preview/ReviewTable.tsx) | 2, 3, 4 | تعديل |
| [preview.css](file:///d:/MyProjects/Nano-IDE/NanoMD/src/styles/preview.css) | 3, 4 | تعديل |
| [Header.tsx](file:///d:/MyProjects/Nano-IDE/NanoMD/src/components/layout/Header.tsx) | 5 | تعديل |
| [EmptyState.tsx](file:///d:/MyProjects/Nano-IDE/NanoMD/src/components/ui/EmptyState.tsx) | 5 | تعديل |

**المجموع: 6 ملفات — لا ملفات جديدة أو محذوفة**

---

## 📅 المراحل التنفيذية

---

### **المرحلة 1: URL Hash Loading 🔗**
> **النموذج المسؤول:** `Claude Opus 4.6 (Thinking)` 🔴
> **الهدف:** تحميل محتوى Markdown تلقائياً من URL Hash عند فتح الصفحة
> **يعتمد على:** لا شيء (مرحلة مستقلة)
> **الموارد:** `App.tsx`, `AppContext.tsx`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | إضافة `useEffect` في `App.tsx` يقرأ `window.location.hash` عند التحميل |
| `[ ]` | `[ ]` | فك تشفير Base64 باستخدام `atob(decodeURIComponent(hash))` |
| `[ ]` | `[ ]` | تحميل المحتوى في `appState.content` وتحويل الـ viewMode إلى `preview` |
| `[ ]` | `[ ]` | إضافة `try/catch` مع `console.warn` للمحتوى غير الصالح |
| `[ ]` | `[ ]` | التأكد أن Hash Loading يأخذ أسبقية على localStorage draft |

#### التفاصيل التقنية:

```typescript
// In App.tsx — BEFORE the localStorage draft loading useEffect
useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        try {
            const decoded = atob(decodeURIComponent(hash));
            if (decoded.trim().length > 0) {
                setAppState(prev => ({ ...prev, content: decoded, viewMode: 'preview' }));
                // Clear hash from URL to prevent re-loading on refresh
                window.history.replaceState(null, '', window.location.pathname);
            }
        } catch (e) {
            console.warn('[NanoMD] Invalid URL hash content:', e);
        }
    }
}, [setAppState]);
```

> [!IMPORTANT]
> الـ Hash Loading لازم يكون **قبل** localStorage loading في ترتيب الـ useEffect عشان لو فيه Hash، ياخد أسبقية.
> كمان لازم ننضف الـ Hash من الـ URL بعد التحميل عشان لو عمل refresh ميحملش نفس المحتوى تاني.

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة 1 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: إضافة URL Hash Loading في `src/App.tsx`.
1. أضف useEffect جديد يقرأ window.location.hash عند التحميل
2. فك تشفير المحتوى من Base64 وحمله في appState.content
3. الـ Hash Loading يأخذ أسبقية على localStorage draft
4. نظف الـ Hash من URL بعد التحميل
5. أضف error handling مناسب
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 2: Split Columns — PreviewPane Detection 🔍**
> **النموذج المسؤول:** `Claude Opus 4.6 (Thinking)` 🔴
> **الهدف:** تحديث كشف جدول المراجعة ليدعم العمود المنفصل `Recommendation`
> **يعتمد على:** لا شيء (مرحلة مستقلة)
> **الموارد:** `PreviewPane.tsx`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | تحديث `isReviewTable()` لكشف الهيدر الجديد مع عمود `Recommendation` منفصل |
| `[ ]` | `[ ]` | إضافة `recommendation` إلى قائمة الأعمدة المعروفة |
| `[ ]` | `[ ]` | التأكد من التوافق العكسي مع الصيغة القديمة `Item ← Recommendation` |

#### التفاصيل التقنية:

**الصيغة القديمة (لازم تفضل شغالة):**
```markdown
| # | Item ← Recommendation | Details | Decision |
```

**الصيغة الجديدة (لازم تتعرف عليها):**
```markdown
| # | Item | Recommendation | Details | Decision |
```

```typescript
// In PreviewPane.tsx — update isReviewTable()
function isReviewTable(headers: string[]): boolean {
    if (headers.length < 3) return false;
    const lastHeader = headers[headers.length - 1].trim().toLowerCase();
    return REVIEW_COLUMNS.includes(lastHeader);
}
// Note: No change needed in isReviewTable itself — it already checks the last column.
// The key change is in ReviewTable.tsx to detect and handle the extra Recommendation column.
```

> [!NOTE]
> دالة `isReviewTable()` مش محتاجة تعديل كبير لإنها بتشيك آخر عمود فقط (Decision).
> التعديل الأساسي هيكون في `ReviewTable.tsx` (المرحلة 3) عشان يكتشف ويتعامل مع العمود الإضافي.

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة 2 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: تحديث `PreviewPane.tsx` لدعم الصيغة الجديدة للجداول.
1. تأكد أن isReviewTable() تكشف الجداول بعمود Recommendation منفصل
2. حافظ على التوافق العكسي مع الصيغة القديمة
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 3: Split Columns + Section Separator + Section Colors — ReviewTable 🎯**
> **النموذج المسؤول:** `Claude Opus 4.6 (Thinking)` 🔴
> **الهدف:** تعديل ReviewTable لدعم 3 تحسينات: أعمدة منفصلة، صفوف فاصلة، ألوان الأقسام
> **يعتمد على:** المرحلة 2 ✅
> **الموارد:** `ReviewTable.tsx`, `preview.css`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | **Split Columns:** كشف عمود `Recommendation` المنفصل في الهيدر |
| `[ ]` | `[ ]` | **Split Columns:** عرض العمود بصرياً منفصل في الجدول |
| `[ ]` | `[ ]` | **Split Columns:** دمج Item + Recommendation بـ `←` في `buildCopyText()` |
| `[ ]` | `[ ]` | **Separator:** كشف صف الفاصل (# فاضي + Item يبدأ بـ `**📌`) |
| `[ ]` | `[ ]` | **Separator:** عرض صف الفاصل كـ `<tr>` كامل العرض بدون أزرار |
| `[ ]` | `[ ]` | **Separator:** استثناء صفوف الفاصل من النسخ ومن عداد المراجعة |
| `[ ]` | `[ ]` | **Colors:** تتبع Section الحالي وتعيين className مختلف لكل مجموعة |
| `[ ]` | `[ ]` | **Colors:** إضافة CSS classes لألوان الأقسام المتبادلة |

#### التفاصيل التقنية:

**1. كشف عمود Recommendation:**
```typescript
// Detect if the table has a separate Recommendation column
const hasRecommendationCol = useMemo(() => {
    return headers.some(h => {
        const lower = h.trim().toLowerCase();
        return lower === 'recommendation' || lower === 'التوصية';
    });
}, [headers]);

const recommendationColIndex = useMemo(() => {
    if (!hasRecommendationCol) return -1;
    return headers.findIndex(h => {
        const lower = h.trim().toLowerCase();
        return lower === 'recommendation' || lower === 'التوصية';
    });
}, [headers, hasRecommendationCol]);
```

**2. كشف صف الفاصل:**
```typescript
function isSeparatorRow(row: string[]): boolean {
    const id = row[0]?.trim();
    const item = row[1]?.trim() || '';
    // Separator: empty # + item contains 📌 with bold markers
    return !id && item.includes('📌');
}
```

**3. ألوان الأقسام:**
```typescript
// Track section index for each row
const sectionIndices = useMemo(() => {
    let currentSection = 0;
    return rows.map((row) => {
        if (isSeparatorRow(row)) currentSection++;
        return currentSection;
    });
}, [rows]);
```

**4. تحديث `buildCopyText()` للدمج:**
```typescript
// Merge Item + Recommendation with ← when copying
const itemText = rows[i][itemColIndex]?.trim() || '';
const recText = hasRecommendationCol ? rows[i][recommendationColIndex]?.trim() || '' : '';
const mergedItem = recText ? `${itemText} ← ${recText}` : itemText;
lines.push(`${itemNum}. ${mergedItem} → ${decision}`);
```

> [!WARNING]
> هذه المرحلة تؤثر على أكثر من 50 سطر في `ReviewTable.tsx`. يجب التنفيذ بعناية والتأكد من:
> - التوافق العكسي مع الجداول بالصيغة القديمة
> - صفوف الفاصل ما تتحسبش في عداد المراجعة
> - صفوف الفاصل ما تتنسخش

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة 3 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: تعديل `ReviewTable.tsx` و `preview.css` لدعم 3 تحسينات:
1. Split Columns: كشف وعرض عمود Recommendation منفصل + دمجهم بـ ← عند النسخ
2. Section Separator: كشف صفوف الفاصل (# فاضي + 📌) وعرضهم بدون أزرار واستثنائهم من النسخ
3. Section Colors: تتبع Section index وتعيين ألوان خلفية متبادلة
حافظ على التوافق العكسي مع الجداول القديمة.
أضف ستايلات CSS مناسبة في preview.css.
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 4: مراجعة المراحل 1-3 📋**
> **النموذج المسؤول:** `Claude Opus 4.6 (Thinking)` 🔴
> **الهدف:** مراجعة جودة الكود والتأكد من الالتزام بالمعايير
> **يعتمد على:** المراحل 1, 2, 3 ✅
> **الموارد:** الملفات المُعدلة في المراحل السابقة

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | تشغيل المشروع محلياً والتأكد من Build بدون أخطاء |
| `[ ]` | `[ ]` | اختبار URL Hash Loading مع محتوى Base64 صالح وغير صالح |
| `[ ]` | `[ ]` | اختبار جدول Review بالصيغة القديمة (التوافق العكسي) |
| `[ ]` | `[ ]` | اختبار جدول Review بالصيغة الجديدة (Split Columns) |
| `[ ]` | `[ ]` | اختبار صفوف الفاصل (عرض + نسخ + عداد) |
| `[ ]` | `[ ]` | اختبار ألوان الأقسام (تبادل الألوان بصرياً) |
| `[ ]` | `[ ]` | التأكد من فصل الطبقات وعدم وجود ديون تقنية |
| `[ ]` | `[ ]` | كتابة تقرير المراجعة |

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في مرحلة المراجعة 4 من خطة `plans/01-nanomd-improvements.md`.
راجع الملفات المُعدلة في المراحل 1-3 وتأكد من:
1. Build بدون أخطاء (cmd /c npm run build)
2. اختبار Hash Loading في المتصفح
3. اختبار الجداول بالصيغتين (قديمة + جديدة)
4. اختبار الفواصل والألوان
5. جودة الكود (تسمية، تنظيم، لا ديون تقنية)
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 5: File Upload Button 📂**
> **النموذج المسؤول:** `Gemini Pro` 🟠
> **الهدف:** إضافة زر رفع ملف Markdown من الجهاز
> **يعتمد على:** المرحلة 4 ✅
> **الموارد:** `Header.tsx`, `EmptyState.tsx`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | إضافة `<input type="file" accept=".md,.txt">` مخفي في `Header.tsx` |
| `[ ]` | `[ ]` | إضافة زر `Upload` بأيقونة `Upload` من `lucide-react` بجانب زر اللصق |
| `[ ]` | `[ ]` | قراءة الملف باستخدام `FileReader API` وتحميله في `appState.content` |
| `[ ]` | `[ ]` | إضافة نفس الزر في `EmptyState.tsx` كخيار إضافي |
| `[ ]` | `[ ]` | دعم UTF-8 للملفات العربية |

#### التفاصيل التقنية:

```typescript
// In Header.tsx
import { Upload } from 'lucide-react';

// Hidden file input ref
const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
            setAppState(prev => ({ ...prev, content: text, viewMode: 'preview' }));
        }
    };
    reader.readAsText(file, 'UTF-8');
    // Reset input so re-uploading same file triggers onChange
    e.target.value = '';
};

// In JSX — hidden input + button
<input
    ref={fileInputRef}
    type="file"
    accept=".md,.txt,.markdown"
    onChange={handleFileUpload}
    className="hidden"
/>
<NavButton
    onClick={() => fileInputRef.current?.click()}
    icon={<Upload className="w-4 h-4" />}
    label="رفع ملف"
/>
```

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة 5 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: إضافة زر رفع ملف في `Header.tsx` و `EmptyState.tsx`.
1. أضف input file مخفي يقبل .md و .txt و .markdown
2. أضف زر Upload بأيقونة Upload من lucide-react بجانب زر اللصق
3. استخدم FileReader API لقراءة الملف وتحميله
4. أضف نفس الزر في EmptyState كخيار إضافي
5. تأكد من دعم UTF-8
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 6: التوثيق وتحديث الإصدار 📝**
> **النموذج المسؤول:** `Gemini Pro` 🟠
> **الهدف:** توثيق التغييرات وتحديث رقم الإصدار
> **يعتمد على:** المرحلة 5 ✅
> **الموارد:** `project-context.md`, `project-key.md`, `changelog.md`, `package.json`, `App.tsx`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | تحديث `package.json` — الإصدار من `1.0.0` إلى `1.1.0` |
| `[ ]` | `[ ]` | تحديث رقم الإصدار في `App.tsx` footer من `v1.0.0` إلى `v1.1.0` |
| `[ ]` | `[ ]` | تحديث `changelog.md` بقائمة التغييرات الخمسة |
| `[ ]` | `[ ]` | تحديث `project-context.md` بالميزات الجديدة والحالة الحالية |
| `[ ]` | `[ ]` | تحديث `project-key.md` لو فيه ملفات جديدة |

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة 6 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: توثيق جميع التغييرات وتحديث الإصدار.
1. حدث الإصدار في package.json و App.tsx footer إلى v1.1.0
2. حدث changelog.md بالتحسينات الخمسة
3. حدث project-context.md بالميزات الجديدة
4. حدث project-key.md لو فيه ملفات جديدة
عند الانتهاء، علّم المربعات واكتب برومبت المرحلة التالية.
```

---

### **المرحلة 7: المراجعة النهائية والتسليم ✅**
> **النموذج المسؤول:** `Claude Opus 4.6 (Thinking)` 🔴
> **الهدف:** المراجعة النهائية والتأكد من جاهزية المشروع للنشر
> **يعتمد على:** المرحلة 6 ✅
> **الموارد:** كل الملفات المُعدلة

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | تشغيل `npm run build` والتأكد من نجاحه بدون أخطاء |
| `[ ]` | `[ ]` | اختبار شامل لكل التحسينات الخمسة في المتصفح |
| `[ ]` | `[ ]` | التأكد من عدم وجود TODO بدون خطة |
| `[ ]` | `[ ]` | التأكد أن التوثيق كامل (الملفات الثلاثة) |
| `[ ]` | `[ ]` | كتابة ملخص التسليم النهائي |

**🔄 برومبت بدء هذه المرحلة:**
```
أنت في المرحلة النهائية 7 من خطة `plans/01-nanomd-improvements.md`.
المطلوب: المراجعة النهائية والتسليم.
1. شغل npm run build وتأكد من نجاحه
2. اختبر كل التحسينات الخمسة في المتصفح
3. تأكد من عدم وجود TODO بدون خطة
4. تأكد أن التوثيق كامل
5. اكتب ملخص التسليم النهائي
```

---

## 📊 ملخص النماذج والمراحل

| المرحلة | النموذج | تنفيذ | مراجعة |
| :--- | :--- | :---: | :---: |
| **1. URL Hash Loading** | `Claude Opus 4.6 (Thinking)` 🔴 | `[ ]` | `[ ]` |
| **2. Split Columns — Detection** | `Claude Opus 4.6 (Thinking)` 🔴 | `[ ]` | `[ ]` |
| **3. Split Columns + Separator + Colors** | `Claude Opus 4.6 (Thinking)` 🔴 | `[ ]` | `[ ]` |
| **4. مراجعة المراحل 1-3** | `Claude Opus 4.6 (Thinking)` 🔴 | `[ ]` | `[ ]` |
| **5. File Upload Button** | `Gemini Pro` 🟠 | `[ ]` | `[ ]` |
| **6. التوثيق وتحديث الإصدار** | `Gemini Pro` 🟠 | `[ ]` | `[ ]` |
| **7. المراجعة النهائية والتسليم** | `Claude Opus 4.6 (Thinking)` 🔴 | `[ ]` | `[ ]` |

---

> **🎯 الحالة الحالية:** في انتظار موافقة المطور
> **📝 ملاحظة:** المراحل 1 و 2 مستقلة ويمكن تنفيذهما بالتوازي. المرحلة 3 تعتمد على المرحلة 2.

---

## ❓ أسئلة مفتوحة

> [!IMPORTANT]
> **1. ترتيب الأعمدة في الصيغة الجديدة:**
> هل الترتيب المعتمد هو:
> `| # | Item | Recommendation | Details | Decision |`
> أم فيه ترتيب مختلف تفضله؟

> [!IMPORTANT]
> **2. ألوان الأقسام:**
> هل تفضل ألوان محددة للأقسام؟ أو نستخدم ألوان خفيفة متبادلة تتناسب مع الثيمات الثلاثة (Noir, Slate, Cream)؟

> [!NOTE]
> **3. الترجمة العربية:**
> هل نضيف مسميات عربية لعمود Recommendation (مثلاً `التوصية`) في قائمة الكشف؟

---

## ✅ خطة التحقق

### اختبارات آلية:
```powershell
# Build test
cmd /c "cd d:\MyProjects\Nano-IDE\NanoMD && npm run build"
```

### اختبارات يدوية في المتصفح:
1. فتح رابط مع Hash يحتوي Base64 → يحمل المحتوى تلقائياً
2. لصق جدول بالصيغة القديمة → يعمل بشكل طبيعي
3. لصق جدول بالصيغة الجديدة → يعرض Recommendation منفصل + يدمجهم عند النسخ
4. جدول فيه صفوف فاصلة → تظهر بشكل مميز بدون أزرار
5. الأقسام بين الفواصل → ألوان خلفية مختلفة
6. رفع ملف .md → يتحمل المحتوى بنجاح
