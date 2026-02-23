
# خطة تنفيذ محكمة لـ Gemini Flash 🔒

## أولاً: البرومبت الرئيسي (انسخه كامل)

---

<div dir="rtl">

</div>

```markdown
# 🔒 مهمة تحديث NanoMD - خطة إلزامية صارمة

## ⛔ قواعد حديدية (اقرأها قبل أي شيء)

1. **لا تعدل أي ملف قبل إنشاء النسخة الاحتياطية** (المرحلة 0)
2. **نفذ مرحلة واحدة فقط في كل مرة** - لا تدمج مراحل أبداً
3. **لا تحذف أي كود قديم** - علّق عليه بـ `/* OLD: */` واكتب الجديد تحته
4. **لا تغير أسماء الملفات أو المجلدات الموجودة**
5. **لا تضف مكتبات جديدة** إلا إذا مذكورة صراحة في الخطة
6. **لا تعدل App.tsx أو main.tsx أو أي ملف غير مذكور** في المرحلة الحالية
7. **بعد كل مرحلة** اكتب "✅ المرحلة X اكتملت" وانتظر تأكيدي
8. **إذا واجهت خطأ أو تعارض** توقف فوراً واشرح المشكلة - لا تحاول "الإصلاح الإبداعي"
9. **كل ملف تعدله** اكتبه كامل من أوله لآخره - لا تكتب "باقي الكود كما هو"
10. **لا تغير المنطق البرمجي (Logic)** - التعديلات على الأنماط (CSS) والشكل فقط

---

## المرحلة 0: النسخة الاحتياطية (نفذها أولاً ولا تتجاوزها أبداً)

### المطلوب:
أنشئ مجلد اسمه `_backup_before_manus_style` في جذر المشروع وانسخ فيه هذه الملفات بالضبط:

```

_backup_before_manus_style/
├── globals.css          ← نسخة من src/styles/globals.css
├── themes.css           ← نسخة من src/styles/themes.css
├── preview.css          ← نسخة من src/styles/preview.css
├── CodeBlock.tsx        ← نسخة من src/components/preview/CodeBlock.tsx
├── PreviewPane.tsx      ← نسخة من src/components/preview/PreviewPane.tsx
├── tailwind.config.js   ← نسخة من tailwind.config.js
├── index.html           ← نسخة من index.html
└── BACKUP_INFO.md       ← ملف معلومات

```

### محتوى ملف BACKUP_INFO.md:
```markdown
# نسخة احتياطية
- التاريخ: [التاريخ الحالي]
- السبب: تحديث الأنماط لتتوافق مع Manus UI Style
- للاستعادة: انسخ الملفات من هذا المجلد إلى مواقعها الأصلية
```

### ⚠️ تأكيد

بعد إنشاء النسخة الاحتياطية، اكتب:
"✅ المرحلة 0 اكتملت - تم إنشاء نسخة احتياطية في _backup_before_manus_style/"
ثم اذكر قائمة الملفات التي تم نسخها.

---

## المرحلة 1: تحديث الخطوط (Typography)

### الملفات المسموح تعديلها في هذه المرحلة فقط

- `index.html` (إضافة روابط الخطوط)
- `src/styles/globals.css` (تغيير تعريف الخطوط)
- `tailwind.config.js` (تحديث fontFamily)

### التعديل 1.1 - ملف index.html

أضف روابط الخطوط الجديدة في `<head>` **قبل** أي روابط CSS أخرى:

```html
<!-- Manus-Style Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**⚠️ لا تحذف** أي روابط خطوط موجودة (مثل Cairo) - فقط أضف الجديدة.

### التعديل 1.2 - ملف src/styles/globals.css

ابحث عن أي تعريف لـ `font-family` في body أو :root وعدله.

**أضف هذه المتغيرات** في `:root` (أضف لا تستبدل):

```css
:root {
  /* === Manus-Style Fonts === */
  --font-arabic: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif;
  --font-latin: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  
  /* === أحجام الخطوط === */
  --text-base: 16px;
  --text-sm: 14px;
  --text-xs: 12px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  
  /* === ارتفاع السطر === */
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;
  --leading-tight: 1.3;
}
```

**عدل body** ليصبح:

```css
body {
  font-family: var(--font-arabic);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'kern' 1;
}
```

### التعديل 1.3 - ملف tailwind.config.js

في قسم `theme.extend` أضف:

```js
fontFamily: {
  arabic: ['IBM Plex Sans Arabic', 'Segoe UI', 'Tahoma', 'sans-serif'],
  latin: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
},
```

### ⚠️ لا تفعل

- لا تعدل أي ملف React (.tsx)
- لا تحذف خط Cairo من أي مكان
- لا تعدل themes.css في هذه المرحلة

### تأكيد

"✅ المرحلة 1 اكتملت - تم تحديث الخطوط"
ثم اذكر الملفات الثلاثة التي تم تعديلها فقط.

---

## المرحلة 2: تحديث نظام الألوان والثيمات

### الملفات المسموح تعديلها في هذه المرحلة فقط

- `src/styles/themes.css`

### التعديل 2.1 - ملف src/styles/themes.css

**⚠️ مهم جداً:** لا تحذف المتغيرات الموجودة التي تستخدمها المكونات.
أضف المتغيرات الجديدة بجانب القديمة.

ابحث عن تعريف الثيم الداكن (dark) وعدّل/أضف هذه المتغيرات:

```css
/* === الثيم الداكن - Manus Style === */
:root[data-theme="dark"],
[data-theme="dark"] {
  /* الخلفيات */
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #111111;
  --bg-elevated: #1a1a1a;
  
  /* النصوص */
  --text-primary: #ffffff;
  --text-secondary: #a0a09f;
  --text-tertiary: #666666;
  --text-muted: #444444;
  
  /* الحدود */
  --border-default: #222222;
  --border-subtle: #1a1a1a;
  --border-color: #333333;
  
  /* الأكسنت */
  --accent-primary: #3b82f6;
  --accent-hover: #60a5fa;
  
  /* الأكواد */
  --code-bg: #111111;
  --code-border: #222222;
  
  /* الروابط */
  --link-color: #60a5fa;
  --link-hover: #93c5fd;
  
  /* Hover */
  --hover-bg: rgba(255, 255, 255, 0.03);
}
```

ابحث عن تعريف الثيم الفاتح (light) وعدّل/أضف:

```css
/* === الثيم الفاتح - Manus Style === */
:root[data-theme="light"],
:root,
[data-theme="light"] {
  /* الخلفيات */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --bg-elevated: #ffffff;
  
  /* النصوص */
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-muted: #cccccc;
  
  /* الحدود */
  --border-default: #e5e5e5;
  --border-subtle: #f0f0f0;
  --border-color: #e5e5e5;
  
  /* الأكسنت */
  --accent-primary: #2563eb;
  --accent-hover: #3b82f6;
  
  /* الأكواد */
  --code-bg: #f6f6f6;
  --code-border: #e5e5e5;
  
  /* الروابط */
  --link-color: #2563eb;
  --link-hover: #1d4ed8;
  
  /* Hover */
  --hover-bg: rgba(0, 0, 0, 0.02);
}
```

ابحث عن تعريف الثيم الدافئ (warm) وعدّل/أضف:

```css
/* === الثيم الدافئ - Manus Style === */
:root[data-theme="warm"],
[data-theme="warm"] {
  --bg-primary: #faf8f5;
  --bg-secondary: #f5f0ea;
  --bg-tertiary: #efe8df;
  --bg-elevated: #faf8f5;
  
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --text-tertiary: #888888;
  --text-muted: #bbbbbb;
  
  --border-default: #e0d5c5;
  --border-subtle: #f0e8dc;
  --border-color: #e0d5c5;
  
  --accent-primary: #b45309;
  --accent-hover: #d97706;
  
  --code-bg: #f0e8dc;
  --code-border: #e0d5c5;
  
  --link-color: #b45309;
  --link-hover: #92400e;
  
  --hover-bg: rgba(0, 0, 0, 0.02);
}
```

### ⚠️ لا تفعل

- لا تحذف أي متغير CSS موجود إلا إذا كنت تستبدله بنفس الاسم
- لا تعدل أي ملف آخر
- لا تعدل ThemeContext.tsx أو ThemeToggle.tsx

### تأكيد

"✅ المرحلة 2 اكتملت - تم تحديث الثيمات"

---

## المرحلة 3: تنسيق المعاينة (Preview Styling)

### الملفات المسموح تعديلها في هذه المرحلة فقط

- `src/styles/preview.css`

### التعديل 3.1 - ملف src/styles/preview.css

**استبدل محتوى الملف بالكامل** بالكود التالي (الملف القديم موجود في النسخة الاحتياطية):

```css
/* ============================================
   NanoMD Preview Styles - Manus UI Style
   ============================================ */

/* === الحاوية الرئيسية === */
.preview-content {
  direction: rtl;
  text-align: right;
  unicode-bidi: plaintext;
  color: var(--text-primary);
  font-family: var(--font-arabic);
  line-height: var(--leading-normal);
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* === العناوين === */
.preview-content h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 1.8em 0 0.8em 0;
  line-height: var(--leading-tight);
  border-bottom: none;
  padding-bottom: 0;
}

.preview-content h1:first-child {
  margin-top: 0;
}

.preview-content h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.6em 0 0.6em 0;
  line-height: var(--leading-tight);
  border-bottom: none;
  padding-bottom: 0;
}

.preview-content h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.4em 0 0.5em 0;
  line-height: var(--leading-tight);
}

.preview-content h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.2em 0 0.4em 0;
}

.preview-content h5,
.preview-content h6 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
  margin: 1em 0 0.3em 0;
}

/* === الفقرات === */
.preview-content p {
  margin: 0.8em 0;
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
  unicode-bidi: plaintext;
  text-align: start;
}

/* === النص العريض والمائل === */
.preview-content strong {
  font-weight: 600;
  color: var(--text-primary);
}

.preview-content em {
  font-style: italic;
}

/* === الروابط === */
.preview-content a {
  color: var(--link-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.preview-content a:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

/* === القوائم === */
.preview-content ul,
.preview-content ol {
  padding-right: 1.5em;
  padding-left: 0;
  margin: 0.8em 0;
}

.preview-content li {
  margin: 0.4em 0;
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
  unicode-bidi: plaintext;
  text-align: start;
}

.preview-content li::marker {
  color: var(--text-tertiary);
}

.preview-content li > ul,
.preview-content li > ol {
  margin: 0.3em 0;
}

/* Checkbox lists */
.preview-content input[type="checkbox"] {
  margin-left: 0.5em;
  margin-right: 0;
}

/* === الاقتباسات === */
.preview-content blockquote {
  border-right: 3px solid var(--accent-primary);
  border-left: none;
  padding: 0.5em 1em 0.5em 0;
  margin: 1em 0;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: 0 6px 6px 0;
}

.preview-content blockquote p {
  margin: 0.3em 0;
}

/* === الخطوط الفاصلة === */
.preview-content hr {
  border: none;
  border-top: 1px solid var(--border-default);
  margin: 2em 0;
}

/* === الجداول - Manus Style === */
.preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: var(--text-sm);
  direction: rtl;
  text-align: right;
  overflow-x: auto;
  display: block;
}

.preview-content thead {
  border-bottom: 2px solid var(--border-color);
}

.preview-content th {
  padding: 10px 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  background: transparent;
  white-space: nowrap;
  border: none;
}

.preview-content td {
  padding: 10px 16px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
  border-left: none;
  border-right: none;
  text-align: right;
  unicode-bidi: plaintext;
}

.preview-content tbody tr:hover {
  background: var(--hover-bg);
}

.preview-content tbody tr:last-child td {
  border-bottom: none;
}

/* === الكود المضمن (Inline Code) === */
.preview-content :not(pre) > code {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--accent-primary);
  direction: ltr;
  unicode-bidi: isolate;
}

/* === بلوكات الأكواد === */
.preview-content pre {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 0;
  margin: 1.5em 0;
  overflow: hidden;
  direction: ltr;
  text-align: left;
}

.preview-content pre code {
  display: block;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  background: transparent;
  border: none;
  border-radius: 0;
  color: inherit;
}

/* شريط الكود العلوي */
.code-block-wrapper {
  position: relative;
  margin: 1.5em 0;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--code-border);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  direction: ltr;
}

.code-block-header .code-lang {
  font-weight: 500;
  text-transform: lowercase;
}

.code-block-header .copy-btn {
  cursor: pointer;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
  background: none;
  border: none;
  font-size: var(--text-xs);
  font-family: var(--font-arabic);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
}

.code-block-header .copy-btn:hover {
  color: var(--text-primary);
  background: var(--hover-bg);
}

/* === الصور === */
.preview-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
}

/* === Scrollbar Styling === */
.preview-content pre code::-webkit-scrollbar {
  height: 6px;
}

.preview-content pre code::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content pre code::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 3px;
}

.preview-content pre code::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* === Selection Color === */
.preview-content ::selection {
  background: rgba(37, 99, 235, 0.2);
  color: inherit;
}
```

### ⚠️ لا تفعل

- لا تعدل أي ملف TSX/JSX في هذه المرحلة
- لا تعدل globals.css أو themes.css (تم تعديلهم سابقاً)

### تأكيد

"✅ المرحلة 3 اكتملت - تم تحديث أنماط المعاينة"

---

## المرحلة 4: تحديث مكون CodeBlock

### الملفات المسموح تعديلها في هذه المرحلة فقط

- `src/components/preview/CodeBlock.tsx`

### التعديل 4.1 - ملف CodeBlock.tsx

**استبدل محتوى الملف بالكامل** بالكود التالي:

```tsx
import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // استخلاص اسم اللغة من className
  const language = className?.replace(/^language-/, '') || '';
  
  // استخلاص النص من children
  const codeString = typeof children === 'string' 
    ? children 
    : String(children || '');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeString.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [codeString]);

  // إذا لم يكن هناك لغة محددة، اعرض كـ inline code
  if (!className) {
    return <code>{children}</code>;
  }

  const displayLang = language || 'text';

  return (
    <div className="code-block-wrapper">
      {/* شريط علوي - Manus Style */}
      <div className="code-block-header">
        <span className="code-lang">{displayLang}</span>
        <button 
          onClick={handleCopy} 
          className="copy-btn"
          type="button"
          aria-label={copied ? 'تم النسخ' : 'نسخ الكود'}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>تم النسخ</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>
      {/* بلوك الكود */}
      <pre>
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default CodeBlock;
```

### ⚠️ مهم جداً

- تأكد أن الـ imports الموجودة في الملف القديم لا تتعارض
- إذا كان CodeBlock.tsx يصدّر بشكل مختلف (named vs default export)، حافظ على **نفس طريقة التصدير القديمة**
- إذا كان يستقبل props مختلفة، **أخبرني أولاً قبل التعديل**

### تأكيد

"✅ المرحلة 4 اكتملت - تم تحديث CodeBlock"
اذكر: هل تغير شكل الـ props أو الـ exports؟

---

## المرحلة 5: ربط CodeBlock بـ PreviewPane

### الملفات المسموح تعديلها في هذه المرحلة فقط

- `src/components/preview/PreviewPane.tsx`

### التعديل 5.1

في ملف PreviewPane.tsx، تأكد أن react-markdown يستخدم CodeBlock كـ custom component.

**ابحث عن** استخدام `<ReactMarkdown>` أو `<Markdown>` في الملف.

**عدل قسم components** ليصبح هكذا (أو أضفه إذا غير موجود):

```tsx
import { CodeBlock } from './CodeBlock';

// ... باقي الكود كما هو ...

// داخل JSX حيث يتم استخدام ReactMarkdown:
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  className="preview-content"
  components={{
    code({ className, children, ...props }) {
      // التفريق بين inline code و code block
      const isInline = !className;
      
      if (isInline) {
        return <code {...props}>{children}</code>;
      }
      
      return (
        <CodeBlock className={className}>
          {children}
        </CodeBlock>
      );
    },
    // تأكد أن pre لا يتداخل مع CodeBlock
    pre({ children }) {
      return <>{children}</>;
    }
  }}
>
  {markdownContent}
</ReactMarkdown>
```

### ⚠️ مهم

- **لا تغير** أي شيء آخر في PreviewPane.tsx
- **لا تغير** الـ imports الأخرى الموجودة
- **لا تغير** أي state أو logic
- فقط عدل قسم components في ReactMarkdown

### ⚠️ إذا كان الملف يستخدم ReactMarkdown بشكل مختلف

توقف واشرح لي كيف يستخدمه حالياً.

### تأكيد

"✅ المرحلة 5 اكتملت - تم ربط CodeBlock بـ PreviewPane"

---

## المرحلة 6: التحقق النهائي

### المطلوب

1. راجع جميع الملفات المعدلة واكتب قائمة بها
2. تأكد أن كل ملف يحتوي على كود كامل بدون أجزاء ناقصة
3. تأكد أن لا يوجد import مفقود
4. تأكد أن النسخة الاحتياطية موجودة وسليمة

### اكتب التقرير النهائي بهذا الشكل

```
📋 تقرير التعديلات النهائي:

الملفات المعدلة:
1. index.html - ✅ إضافة روابط خطوط
2. src/styles/globals.css - ✅ متغيرات الخطوط
3. tailwind.config.js - ✅ fontFamily
4. src/styles/themes.css - ✅ ألوان الثيمات الثلاثة
5. src/styles/preview.css - ✅ أنماط المعاينة كاملة
6. src/components/preview/CodeBlock.tsx - ✅ مكون جديد
7. src/components/preview/PreviewPane.tsx - ✅ ربط CodeBlock

الملفات التي لم تتعدل:
- App.tsx ❌
- main.tsx ❌
- أي ملف context ❌
- أي ملف hook ❌

النسخة الاحتياطية: ✅ موجودة في _backup_before_manus_style/
```

---

## 🚨 حالات الطوارئ

### إذا حصل خطأ في أي مرحلة

1. **توقف فوراً**
2. اكتب: "⚠️ خطأ في المرحلة X"
3. اشرح الخطأ بالتفصيل
4. **لا تحاول إصلاحه** بدون تأكيدي

### إذا وجدت أن الكود الحالي مختلف عما هو متوقع

1. اكتب: "⚠️ اختلاف في الملف: [اسم الملف]"
2. اعرض الكود الحالي
3. اسأل عن التعديل المناسب
4. **لا تفترض** أي شيء

### للتراجع عن كل التعديلات

```bash
# انسخ الملفات من النسخة الاحتياطية
cp _backup_before_manus_style/globals.css src/styles/globals.css
cp _backup_before_manus_style/themes.css src/styles/themes.css
cp _backup_before_manus_style/preview.css src/styles/preview.css
cp _backup_before_manus_style/CodeBlock.tsx src/components/preview/CodeBlock.tsx
cp _backup_before_manus_style/PreviewPane.tsx src/components/preview/PreviewPane.tsx
cp _backup_before_manus_style/tailwind.config.js tailwind.config.js
cp _backup_before_manus_style/index.html index.html
```

```

---

## ثانياً: كيف تستخدم البرومبت ده 📌

```

الطريقة المثلى للاستخدام:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ابعت البرومبت كامل لـ Gemini
2. انتظر يخلص المرحلة 0 (النسخة الاحتياطية)
3. تأكد إن الملفات اتنسخت فعلاً
4. قوله "أكمل المرحلة 1"
5. راجع التعديل → لو تمام قوله "أكمل المرحلة 2"
6. كرر لكل مرحلة
7. في النهاية شغّل المشروع وشوف النتيجة

⚠️ لو Gemini حاول يدمج مراحل:
   قوله "توقف. مرحلة واحدة فقط"

⚠️ لو كتب "باقي الكود كما هو":
   قوله "اكتب الملف كامل من أوله لآخره"

```

---

**عاوز أضيف أو أعدل أي حاجة في الخطة قبل ما تبعتها لـ Gemini؟** 🎯
