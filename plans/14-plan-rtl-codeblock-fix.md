# خطة إصلاح RTL في الـ Code Blocks
> الإصدار: 1.0.0
> التاريخ: 2026-05-12
> الحالة: مسودة

## الهدف

إصلاح عرض النصوص العربية داخل الـ code blocks بحيث تُعرَض بالاتجاه الصحيح (RTL أو LTR) بناءً على محتوى كل block منفرداً، مع الحفاظ على عرض الكود البرمجي الإنجليزي بالاتجاه الصحيح LTR.

## الخلفية

### المشكلة الأصلية

كان الكود يفرض `direction: ltr` على جميع الـ `pre` elements في `preview.css`:

```css
.preview-content pre {
    direction: ltr;
    text-align: left;
}
```

هذا جعل أي نص عربي داخل code block يُعرض بشكل LTR مقلوب بصرياً، حتى لو كان المحتوى نصاً عربياً كاملاً (مثل: ملف Markdown ملصوق كـ code block).

### الإصلاح المؤقت ومشكلته

تم استبدال `direction: ltr` بـ `unicode-bidi: plaintext` على مستوى CSS:

```css
.preview-content pre {
    unicode-bidi: plaintext;
}
.preview-content pre code {
    unicode-bidi: plaintext;
    text-align: start;
}
```

هذا الإصلاح يعمل على **مستوى الـ block كاملاً**: يبحث عن أول حرف قوي (strong character) في كامل محتوى الـ block ويحدد الاتجاه بناءً عليه.

### السيناريو الذي يكسره الإصلاح المؤقت

```javascript
// تعليق عربي في أول السطر  ← أول حرف قوي = عربي
const name = "Ahmed";         ← يظهر مقلوباً RTL بسبب قرار المستوى الأول
function doWork() { ... }     ← نفس المشكلة
```

لأن أول حرف قوي في الـ block هو عربي، يصبح الـ block كله RTL وينكسر عرض الكود البرمجي الذي يليه.

### الحل الصحيح

الكشف عن أول حرف قوي برمجياً داخل `CodeBlock.tsx` وتمرير `dir` attribute مباشرة على عنصر `<pre>`، مع تنظيف CSS ليعتمد على هذه القيمة.

## القرارات المعتمدة

- الكشف عن الاتجاه يتم في `CodeBlock.tsx` بـ JavaScript، لأن CSS لا تستطيع التمييز per-line داخل `pre`.
- يُحدَّد الاتجاه بناءً على **أول حرف قوي** في محتوى الـ code block (Arabic ranges → RTL، Latin → LTR).
- الـ header (`code-block-header`) يبقى `dir="ltr"` دائماً لأن أسماء اللغات إنجليزية.
- إذا لم يُوجَد حرف قوي (أرقام أو رموز فقط) → الافتراضي LTR.
- لا يوجد تغيير في وظائف النسخ أو اكتشاف اللغة.

## المتطلبات

- [ ] إضافة دالة كشف الاتجاه في `CodeBlock.tsx` باستخدام Unicode ranges العربية.
- [ ] تمرير `dir` attribute على عنصر `<pre>` بناءً على نتيجة الكشف.
- [ ] إزالة `unicode-bidi: plaintext` من `.preview-content pre` في `preview.css`.
- [ ] إزالة `unicode-bidi: plaintext` من `.preview-content pre code` في `preview.css`.
- [ ] إبقاء `text-align: start` على `.preview-content pre code` لاحترام الاتجاه الموروث.
- [ ] التحقق من أن `code-block-header` لا يتأثر بتغيير `dir` على `pre`.
- [ ] اختبار الـ 4 سيناريوهات الأساسية.
- [ ] تحديث التوثيق بعد التنفيذ.
- [ ] تحديث رقم الإصدار طبقاً لقواعد المشروع.

## مراجعة الكود الحالي

| الملف | الوضع الحالي | الملاحظة |
|------|--------------|----------|
| `src/components/preview/CodeBlock.tsx` | لا يحدد `dir` على `<pre>` | يحتاج إضافة كشف الاتجاه |
| `src/styles/preview.css` | `.preview-content pre` → `unicode-bidi: plaintext` | يجب إزالته والاعتماد على JS |
| `src/styles/preview.css` | `.preview-content pre code` → `unicode-bidi: plaintext; text-align: start` | يجب إزالة `unicode-bidi` فقط، إبقاء `text-align: start` |
| `src/styles/preview.css` | `.code-block-header` → `direction: ltr` | صحيح، لا يحتاج تغيير |

## مراحل التنفيذ

### المرحلة 1: الإصلاح التقني

المدخلات:

- موافقة المطور على هذه الخطة.
- عدم وجود تعديل متزامن على `CodeBlock.tsx` أو `preview.css`.

الخطوات:

- [ ] [🤖] إضافة دالة `detectCodeDir` في `CodeBlock.tsx` تبحث عن أول حرف قوي باستخدام regex يشمل Unicode ranges العربية الكاملة.
- [ ] [🤖] تمرير `dir={detectCodeDir(codeString)}` على عنصر `<pre>` في `CodeBlock.tsx`.
- [ ] [🤖] إزالة `unicode-bidi: plaintext` من `.preview-content pre` في `preview.css` مع الحفاظ على باقي الخصائص.
- [ ] [🤖] إزالة `unicode-bidi: plaintext` من `.preview-content pre code` في `preview.css`، إبقاء `text-align: start`.
- [ ] [🤖] التحقق من أن `code-block-header` (`dir="ltr"` في JSX) لا يتأثر بقيمة `dir` على `pre` الأب.

المخرجات:

- `CodeBlock.tsx` يحدد `dir` على `<pre>` بناءً على محتوى الكود.
- `preview.css` لا يتعارض مع قيمة `dir` المحددة في JS.

معيار القبول:

- كود JavaScript/Python يبدأ بتعليق عربي يُعرض بـ LTR (لأن الكود نفسه إنجليزي يأتي بعد التعليق) أو RTL إذا كان المحتوى عربياً بالكامل.
- نص markdown ملصوق كـ code block يبدأ بعنوان عربي → RTL ✓.
- `git commit -m "رسالة"` → LTR لأن أول حرف قوي هو `g` ✓.
- code block فارغ أو أرقام فقط → LTR (الافتراضي) ✓.

### المرحلة 2: الاختبار والتحقق

المدخلات:

- اكتمال المرحلة 1.

الخطوات:

- [ ] [🤖] تشغيل `npm run build` والتحقق من عدم وجود أخطاء TypeScript.
- [ ] [👤] اختبار code block يحتوي على كود JavaScript خالص.
- [ ] [👤] اختبار code block يحتوي على نص عربي خالص (سيناريو الـ markdown المُلصق).
- [ ] [👤] اختبار code block يبدأ بتعليق عربي ثم كود إنجليزي.
- [ ] [👤] اختبار code block يبدأ بكود إنجليزي ثم تعليق عربي.
- [ ] [👤] التحقق من أن الـ header (اسم اللغة + Copy) يبقى LTR في جميع الحالات.
- [ ] [👤] التحقق من أن باقي عناصر الواجهة (جداول، قوائم، فقرات) لم تتأثر.

المخرجات:

- نتائج الـ 4 سيناريوهات موثقة.
- Build ناجح بدون أخطاء.

معيار القبول:

- الـ 4 سيناريوهات تعمل بالاتجاه الصحيح.
- لا يوجد تراجع في الميزات الأخرى.
- البناء ينجح بدون أخطاء TypeScript.

### المرحلة 3: التوثيق والإصدار

المدخلات:

- اكتمال المرحلتين 1 و 2.
- تحديد رقم الإصدار الجديد قبل التحديث.

الخطوات:

- [ ] [🤖] تحديث رقم الإصدار في `package.json`.
- [ ] [🤖] تحديث رقم الإصدار الظاهر في Footer داخل `src/App.tsx`.
- [ ] [🤖] تحديث نافذة "ما الجديد" داخل `src/components/ui/WhatsNewModal.tsx`.
- [ ] [🤖] إضافة سجل الإصدار الجديد داخل `changelog.md`.
- [ ] [🤖] تحديث `project-context.md`.
- [ ] [👤] مراجعة نصوص "ما الجديد" قبل اعتمادها.

المخرجات:

- رقم إصدار محدث في الملفات والموقع.
- Changelog و WhatsNew يعكسان إصلاح RTL.

معيار القبول:

- لا يظهر رقم الإصدار القديم في واجهة التطبيق.
- `changelog.md` يحتوي على سجل واضح للإصلاح.

## الملفات المتأثرة

| الملف | نوع التغيير |
|-------|-------------|
| `src/components/preview/CodeBlock.tsx` | تعديل — إضافة كشف الاتجاه وتمرير `dir` |
| `src/styles/preview.css` | تعديل — إزالة `unicode-bidi` من `pre` و `pre code` |
| `src/components/ui/WhatsNewModal.tsx` | تعديل — لوجات الموقع |
| `src/App.tsx` | تعديل — رقم الإصدار في Footer |
| `package.json` | تعديل — رقم الإصدار |
| `changelog.md` | تعديل توثيقي |
| `project-context.md` | تعديل توثيقي |

## المخاطر والتنبيهات

- **Unicode ranges غير مكتملة**: إذا لم تشمل الـ regex جميع نطاقات Unicode العربية (Arabic Supplement، Arabic Extended-A، Presentation Forms) ستفوت بعض الحروف. يجب التحقق من شمول النطاقات الكاملة.
- **Code blocks بدون محتوى**: `codeString` فارغة يجب أن ترجع `ltr` وليس `undefined` لتجنب أخطاء TypeScript.
- **التأثير على highlight.js**: مكتبة `rehype-highlight` تُضيف `<span>` elements داخل `<code>`. يجب التأكد أن `dir` على `<pre>` يتعامل مع الـ children المُغلَّفة بـ span بشكل صحيح.
- **لا تلمس** `code-block-header` — هو `dir="ltr"` في JSX وصح كما هو.

## بوابات ما قبل التنفيذ

| # | البوابة | الحالة |
|---|---------|--------|
| 1 | الخطة معتمدة من المطور | معلق |
| 2 | الملفات المتأثرة محددة | مكتمل |
| 3 | قرار آلية الكشف (JS لا CSS) واضح | مكتمل |
| 4 | لا يوجد تعارض مع شغل جارٍ | يحتاج تحقق قبل التنفيذ |

## خطة الاختبار

- code block كود JavaScript خالص → LTR ✓
- code block نص عربي خالص → RTL ✓
- code block يبدأ بتعليق عربي ثم كود → RTL (لأن أول حرف قوي عربي)
- code block يبدأ بكود ثم تعليق عربي → LTR ✓
- code block فارغ أو أرقام فقط → LTR (الافتراضي) ✓
- الـ header يبقى LTR في جميع الحالات ✓
- اختبار أن باقي الـ preview (جداول، قوائم، فقرات) لم يتأثر
- تشغيل `npm run build`

## بروتوكول التسليم

بعد التنفيذ يجب تقديم:

- ملخص عربي شامل لما تم إنجازه.
- قائمة الملفات التي تم تعديلها.
- نتائج اختبار الـ 4 سيناريوهات.
- أي حالات حافة ظهرت أثناء التنفيذ.
- برومبت المرحلة التالية جاهز للنسخ.

## برومبتات المراحل التالية

### برومبت المرحلة 1

```text
نفّذ المرحلة 1 من خطة `plans/14-plan-rtl-codeblock-fix.md`:
- أضف دالة `detectCodeDir` في `src/components/preview/CodeBlock.tsx` تكشف أول حرف قوي (Arabic Unicode ranges كاملة أو Latin) وتُرجع 'rtl' أو 'ltr'. الافتراضي 'ltr'.
- مرّر `dir={detectCodeDir(codeString)}` على عنصر `<pre>` في نفس الملف.
- في `src/styles/preview.css`: احذف `unicode-bidi: plaintext` من `.preview-content pre`، واحذفه من `.preview-content pre code` مع الإبقاء على `text-align: start`.
- لا تعدّل `code-block-header` أو أي شيء آخر في الواجهة.
```

### برومبت المرحلة 2

```text
نفّذ المرحلة 2 من خطة `plans/14-plan-rtl-codeblock-fix.md`:
- شغّل `npm run build` وأكد النجاح.
- اختبر يدوياً الـ 4 سيناريوهات الواردة في خطة الاختبار ووثّق النتائج.
- إذا وُجد تراجع في ميزة أخرى، وثّقه قبل الانتقال للمرحلة 3.
```

### برومبت المرحلة 3

```text
نفّذ المرحلة 3 من خطة `plans/14-plan-rtl-codeblock-fix.md`:
- حدّث رقم الإصدار في `package.json` وFooter داخل `src/App.tsx`.
- حدّث نافذة "ما الجديد" في `src/components/ui/WhatsNewModal.tsx`.
- حدّث `changelog.md` و `project-context.md`.
```

## ملاحظات

- هذه الخطة لا تنفذ أي تعديل كودي بذاتها.
- السيناريو الثالث في خطة الاختبار (يبدأ بتعليق عربي ثم كود) سيظهر RTL — هذا سلوك متوقع وصحيح بناءً على قرار "أول حرف قوي يحدد الاتجاه".
- السيناريوهات الأخرى (أقواس مقلوبة، قوائم متداخلة، copy في ReviewTable، أرقام في أول السطر) موثقة كتحديات مستقبلية ولا تدخل في نطاق هذه الخطة.
