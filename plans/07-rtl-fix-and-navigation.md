# 🗺️ NanoMD v1.3.0 — RTL Fix + Smart Navigation + UX Enhancements
> **الإصدار:** 1.3.0
> **التاريخ:** 2026-04-22
> **المنهجية:** Multi-Model Development

---

## 🎯 الهدف العام

ترقية NanoMD من v1.2.0 إلى v1.3.0 مع:
1. إصلاح بَق RTL الجذري (Bold + أقواس + شرطات)
2. إضافة نسخ Inline Code بالنقر
3. إضافة Auto-link للروابط العادية
4. إضافة أزرار تنقل ذكية (Smart Scroll Buttons)
5. إضافة Scroll Progress Indicator

---

## 🚪 بوابات ما قبل التنفيذ

### بوابة البساطة:
- [x] الحل يستخدم أقل عدد ممكن من الملفات
- [x] لا يوجد "تحسين مستقبلي" أو "ممكن نحتاجه"
- [x] كل قرار تقني له سبب واضح

### بوابة عدم التجريد:
- [x] نستخدم الـ framework مباشرة
- [x] لا طبقات تجريد إضافية غير ضرورية

### بوابة الوضوح:
- [x] المتطلبات واضحة 100%
- [x] لا يوجد `[محتاج توضيح]` معلق

---

## 📅 المراحل التنفيذية

---

### **المرحلة 1: إصلاح RTL BiDi 🐛**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** إصلاح مشكلة اتجاه النص عندما تبدأ الفقرة بعنصر Bold إنجليزي
> **يعتمد على:** لا شيء

#### التحليل الجذري:

الـ CSS الحالي يستخدم `unicode-bidi: plaintext` على `<p>`. هذه الخاصية تجعل البراوزر يحدد اتجاه الفقرة من أول حرف قوي (Strong Character).

**المشكلة:** عندما تبدأ الفقرة بـ `**NanoMD**` ← عنصر `<strong>` يحتوي على حروف إنجليزية كأول حرف قوي ← البراوزر يحكم أن الفقرة LTR ← كل الأقواس والشرطات تتلخبط.

**الحل:** إضافة `unicode-bidi: isolate` على عناصر `<strong>` و `<em>` وباقي inline elements. هذا يعزلها عن خوارزمية BiDi فيبحث البراوزر عن أول حرف عربي بعدها ← يحكم الفقرة RTL ✅

#### الملف المتأثر:

`src/styles/preview.css`

#### التعديل:

إضافة CSS rule جديد بعد قسم RTL Enforcement (بعد سطر 36):

```css
/* ========== BiDi Isolation for Inline Elements ========== */
.preview-content strong,
.preview-content em,
.preview-content b,
.preview-content i,
.preview-content a {
    unicode-bidi: isolate;
}
```

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إضافة `unicode-bidi: isolate` للـ inline elements في `preview.css` |
| `[x]` | `[x]` | اختبار اختبار 25 (Bold + أقواس + شرطة) |
| `[x]` | `[x]` | اختبار اختبار 26 (Bold في بداية فقرة مع خلط كثيف) |
| `[x]` | `[x]` | التأكد من عدم تأثر اختبارات 1-24 |

**🔄 برومبت بدء هذه المرحلة:**
```
افتح ملف src/styles/preview.css وأضف بعد سطر 36 (بعد قسم RTL Enforcement for Nested Blocks) القاعدة التالية:
.preview-content strong, .preview-content em, .preview-content b, .preview-content i, .preview-content a { unicode-bidi: isolate; }
ثم اختبر ملف docs/rtl-test-cases.md — تأكد أن اختبارات 25 و 26 أصبحت تعمل بشكل صحيح وأن باقي الاختبارات لم تتأثر.
```

---

### **المرحلة 2: نسخ Inline Code بالنقر ✨**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** إضافة إمكانية نسخ الكود المضمّن (Inline Code) عند النقر عليه مع tooltip تأكيد
> **يعتمد على:** المرحلة 1 ✅

#### التصميم:

- عند النقر على أي `<code>` inline (مثل `npm run dev`) ← ينسخ المحتوى للـ clipboard
- يظهر tooltip صغير "تم النسخ ✓" فوق العنصر لمدة 1.5 ثانية
- الـ cursor يتحول لـ pointer عند التمرير على الكود
- أنيميشن fade in/out للـ tooltip

#### الملفات المتأثرة:

1. `src/components/preview/PreviewPane.tsx` — تعديل markdownComponents.code
2. `src/styles/preview.css` — إضافة styles للـ tooltip والـ hover effect

#### التفاصيل التقنية:

في `PreviewPane.tsx`، الـ `markdownComponents.code` الحالي (سطر 97-108) يعرض inline code كـ `<code>` عادي. نلف العنصر بمكوّن `InlineCode` جديد يحتوي على:
- `onClick` handler ينسخ النص
- state لـ `copied` tooltip
- Wrapper `<span>` مع position relative للـ tooltip

المكوّن `InlineCode` يُعرّف في نفس الملف (private component) لأنه بسيط:

```tsx
function InlineCode({ children }: { children?: React.ReactNode }) {
    const [copied, setCopied] = useState(false);
    const text = String(children || '');
    
    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(text.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy inline code:', err);
        }
    };

    return (
        <span className="inline-code-wrapper" onClick={handleClick}>
            <code>{children}</code>
            {copied && <span className="inline-code-tooltip">تم النسخ ✓</span>}
        </span>
    );
}
```

CSS المطلوب في `preview.css`:

```css
/* ========== Inline Code Copy ========== */
.inline-code-wrapper {
    position: relative;
    cursor: pointer;
    display: inline;
}

.inline-code-wrapper:hover code {
    background: var(--code-bg-hover, var(--border-default));
    border-color: var(--accent-primary);
}

.inline-code-tooltip {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--text-primary);
    color: var(--bg-primary);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    animation: tooltip-fade 1.5s ease forwards;
    z-index: 10;
}

@keyframes tooltip-fade {
    0%, 70% { opacity: 1; }
    100% { opacity: 0; }
}
```

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إنشاء مكوّن `InlineCode` في `PreviewPane.tsx` |
| `[x]` | `[x]` | تعديل `markdownComponents.code` لاستخدام `InlineCode` |
| `[x]` | `[x]` | إضافة CSS في `preview.css` للـ tooltip والـ hover |
| `[x]` | `[x]` | اختبار النسخ على اختبار 7 (Inline Code) |

**🔄 برومبت بدء هذه المرحلة:**
```
أضف ميزة نسخ Inline Code بالنقر في NanoMD. أنشئ مكوّن InlineCode في PreviewPane.tsx واستخدمه في markdownComponents.code للحالة inline. أضف CSS للـ tooltip في preview.css. اختبر على ملف docs/rtl-test-cases.md اختبار 7.
```

---

### **المرحلة 3: Auto-link للروابط العادية 🔗**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** تحويل الروابط العادية (URLs) في النص تلقائياً لروابط قابلة للنقر
> **يعتمد على:** المرحلة 2 ✅

#### التحليل:

`remark-gfm` (مثبّت بالفعل v4.0.0) يدعم autolink literals بشكل افتراضي. لكن `rehype-sanitize` (مثبّت v6.0.0) قد يكون يحجب الروابط المُنشأة تلقائياً لأن الـ default schema لا يسمح بكل أنواع الروابط.

#### الحل:

تعديل إعدادات `rehype-sanitize` في `PreviewPane.tsx` للسماح بـ autolink:

```tsx
import { defaultSchema } from 'rehype-sanitize';

const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        a: [...(defaultSchema.attributes?.a || []), 'href', 'target', 'rel'],
    },
    protocols: {
        ...defaultSchema.protocols,
        href: ['http', 'https', 'mailto'],
    },
};

// ثم في rehypePlugins:
const rehypePlugins = [[rehypeSanitize, sanitizeSchema], rehypeHighlight];
```

أيضاً نتأكد أن الروابط تفتح في تاب جديد عبر إضافة custom component للـ `a`:

```tsx
// في markdownComponents
a({ href, children, ...props }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
},
```

#### الملف المتأثر:

`src/components/preview/PreviewPane.tsx`

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | تعديل `rehype-sanitize` schema للسماح بـ autolink |
| `[x]` | `[x]` | إضافة custom `a` component لفتح الروابط في تاب جديد |
| `[x]` | `[x]` | اختبار اختبار 27 (Auto-link) |
| `[x]` | `[x]` | التأكد أن اختبار 13 (روابط عادية) لا يزال يعمل |

**🔄 برومبت بدء هذه المرحلة:**
```
فعّل Auto-link في NanoMD. عدّل إعدادات rehype-sanitize في PreviewPane.tsx للسماح بتحويل URLs العادية لروابط. أضف custom component للـ <a> يفتح الروابط في تاب جديد. اختبر على اختبار 27 في docs/rtl-test-cases.md.
```

---

### **المرحلة 4: أزرار التنقل الذكية 🧭**
> **النموذج:** `Gemini Pro` 🟠
> **الهدف:** إضافة أزرار تنقل ثابتة على الجانب الأيمن مع ظهور/إخفاء ذكي
> **يعتمد على:** المرحلة 3 ✅

#### التصميم:

4 أزرار دائرية على الجانب الأيمن، ثابتة مع الشاشة (position: fixed):

| الزر | الأيقونة (Lucide) | الـ Tooltip | الوظيفة |
|------|------------------|------------|---------|
| أعلى الملف | `ChevronsUp` | "أعلى الملف" | `scrollTo(top)` |
| صفحة لأعلى | `ChevronUp` | "صفحة لأعلى" | `scrollBy(-viewport)` |
| صفحة لأسفل | `ChevronDown` | "صفحة لأسفل" | `scrollBy(+viewport)` |
| أسفل الملف | `ChevronsDown` | "أسفل الملف" | `scrollTo(bottom)` |

#### قواعد الظهور الذكي:

| الموقع | ⇈ أعلى | ↑ صفحة أعلى | ↓ صفحة أسفل | ⇊ أسفل |
|--------|:---:|:---:|:---:|:---:|
| أول الصفحة | مخفي | مخفي | ظاهر | ظاهر |
| بعد صفحة واحدة | مخفي | ظاهر | ظاهر | ظاهر |
| بعد 3 صفحات | ظاهر | ظاهر | ظاهر | ظاهر |
| قبل الآخر بصفحة | ظاهر | ظاهر | ظاهر | مخفي |
| آخر الصفحة | ظاهر | ظاهر | مخفي | مخفي |

#### شروط إخفاء كامل:
- في وضع الـ Editor فقط (لا يوجد preview)
- عندما لا يوجد محتوى
- في وضع Focus Mode
- عندما المحتوى قصير ولا يحتاج scroll

#### الملفات:

1. **[NEW]** `src/components/ui/ScrollNav.tsx` — المكوّن الجديد
2. `src/styles/globals.css` — إضافة styles الأزرار
3. `src/App.tsx` — إضافة المكوّن للتطبيق

#### التفاصيل التقنية:

المكوّن يستخدم:
- `useEffect` + `scroll` event listener على `#print-area` (الـ preview container)
- `useState` لتتبع حالة الظهور لكل زر
- `useCallback` لدوال الـ scroll
- `scrollTop` و `scrollHeight` و `clientHeight` لحساب الموقع
- الأزرار تظهر/تختفي بأنيميشن CSS `opacity` + `transform`

التصميم المرئي:
- أزرار دائرية 36px
- خلفية شبه شفافة (glassmorphism): `backdrop-filter: blur(8px)`
- ظل خفيف
- Hover effect: تكبير خفيف + تغيير لون
- Tooltip يظهر على اليسار عند الـ hover
- المسافة بين الأزرار: 8px
- الموقع: وسط الشاشة عمودياً على الجانب الأيمن

```css
.scroll-nav {
    position: fixed;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 40;
}

.scroll-nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border-default);
    background: color-mix(in srgb, var(--bg-primary) 80%, transparent);
    backdrop-filter: blur(8px);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
}

.scroll-nav-btn.visible {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}

.scroll-nav-btn:hover {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
    transform: scale(1.1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
```

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إنشاء مكوّن `ScrollNav.tsx` مع الأزرار الأربعة |
| `[x]` | `[x]` | تطبيق قواعد الظهور الذكي بناءً على scroll position |
| `[x]` | `[x]` | إضافة Tooltips للأزرار |
| `[x]` | `[x]` | إضافة CSS (glassmorphism + animations) في `globals.css` |
| `[x]` | `[x]` | ربط المكوّن بـ `App.tsx` مع شروط الإخفاء |
| `[x]` | `[x]` | اختبار في أوضاع العرض المختلفة (preview, split, editor, focus) |
| `[x]` | `[x]` | اختبار على موبايل (responsive) |

**🔄 برومبت بدء هذه المرحلة:**
```
أنشئ مكوّن ScrollNav.tsx في src/components/ui/ يحتوي على 4 أزرار تنقل ذكية (أعلى الملف، صفحة أعلى، صفحة أسفل، أسفل الملف). استخدم أيقونات Lucide (ChevronsUp, ChevronUp, ChevronDown, ChevronsDown). طبّق قواعد الظهور الذكي حسب الخطة 07. أضف CSS في globals.css بتصميم glassmorphism. أضف المكوّن في App.tsx — يظهر فقط في وضع preview و split عندما يكون هناك محتوى وليس في focus mode. اختبر مع ملف docs/rtl-test-cases.md (محتوى طويل).
```

---

### **المرحلة 5: Scroll Progress Indicator 📊**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** إضافة شريط تقدم رفيع يعرض نسبة التمرير في المستند
> **يعتمد على:** المرحلة 4 ✅

#### التصميم:

- شريط رفيع (3px) أفقي في أعلى منطقة الـ preview (تحت الـ Header مباشرة)
- لون: `var(--accent-primary)` مع تدرج خفيف
- يتحرك من اليمين لليسار (RTL) حسب نسبة الـ scroll
- يختفي عندما المحتوى لا يحتاج scroll
- أنيميشن ناعمة عند التحرك

#### الخيار البديل:

بدل شريط أفقي، ممكن يكون شريط عمودي رفيع بجانب أزرار التنقل على اليمين. لكن الأفقي أنظف وأبسط.

#### الملفات:

يُضاف مباشرة في `ScrollNav.tsx` كجزء من نفس المكوّن (يستخدم نفس الـ scroll listener).

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إضافة شريط التقدم في `ScrollNav.tsx` |
| `[x]` | `[x]` | إضافة CSS للشريط في `globals.css` |
| `[x]` | `[x]` | اختبار مع محتوى طويل وقصير |

**🔄 برومبت بدء هذه المرحلة:**
```
أضف Scroll Progress Indicator في مكوّن ScrollNav.tsx — شريط أفقي رفيع (3px) تحت الـ Header يعرض نسبة التمرير. استخدم نفس الـ scroll listener الموجود. أضف CSS في globals.css.
```

---

### **المرحلة 6: تحديث الإصدار والتوثيق 📝**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** تحديث رقم الإصدار والتوثيق
> **يعتمد على:** المرحلة 5 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | تحديث `package.json` → version: "1.3.0" |
| `[x]` | `[x]` | تحديث `App.tsx` → footer version: v1.3.0 |
| `[x]` | `[x]` | تحديث `project-context.md` |
| `[x]` | `[x]` | تحديث `project-key.md` (إضافة `ScrollNav.tsx`) |
| `[x]` | `[x]` | تحديث `changelog.md` |
| `[x]` | `[x]` | اختبار نهائي شامل لكل الاختبارات 1-28 |

**🔄 برومبت بدء هذه المرحلة:**
```
حدّث إصدار NanoMD إلى v1.3.0. عدّل package.json و App.tsx footer. حدّث project-context.md و project-key.md (أضف ScrollNav.tsx). حدّث changelog.md بملخص تعديلات v1.3.0. اختبر كل الاختبارات 1-28 في docs/rtl-test-cases.md.
```

---

## 📊 ملخص النماذج والمراحل

| المرحلة | الوصف | النموذج | الملفات | المخاطر |
|---------|-------|---------|---------|---------|
| 1 | RTL BiDi Fix | 🟢 Flash | 1 | صفر |
| 2 | Inline Code Copy | 🟢 Flash | 2 | منخفضة |
| 3 | Auto-link | 🟢 Flash | 1 | منخفضة |
| 4 | Smart Scroll Buttons | 🟠 Pro | 3 | متوسطة |
| 5 | Scroll Progress | 🟢 Flash | 1 (+تعديل) | منخفضة |
| 6 | Version + Docs | 🟢 Flash | 5 | صفر |

**إجمالي الملفات المتأثرة:**

| الملف | النوع | المراحل |
|-------|-------|---------|
| `src/styles/preview.css` | تعديل | 1, 2 |
| `src/components/preview/PreviewPane.tsx` | تعديل | 2, 3 |
| `src/components/ui/ScrollNav.tsx` | **جديد** | 4, 5 |
| `src/styles/globals.css` | تعديل | 4, 5 |
| `src/App.tsx` | تعديل | 4, 6 |
| `package.json` | تعديل | 6 |
