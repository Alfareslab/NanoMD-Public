# 📝 سجل التغييرات (Changelog) - NanoMD

## [v1.5.1] - 2026-04-23

### تم التعديل (Changed)
- **تحسينات واجهة الموبايل (Mobile UI Polish):**
  - منع التكبير التلقائي (Auto-zoom) وتخطي العرض عند التركيز على العناصر عبر ضبط `viewport`.
  - إخفاء أشرطة التمرير (Scrollbars) الافتراضية في شاشات الموبايل لتوفير مساحة العرض.
  - تصميم شعار مصغر (NMD) يظهر في الموبايل لتقليل المساحة المستهلكة في الهيدر، مع تصغير أيقونات الهيدر لتناسب سطر واحد.
  - دمج أزرار الترجمة (AR/EN) في زر "ترجمة" موحد وذكي في الشريط السفلي، يدعم الضغطة المطولة للتبديل بين اللغات، والضغطة القصيرة للترجمة.

## [v1.5.0] - 2026-04-23

### تم التعديل (Changed)
- **إعادة تصميم واجهة الموبايل (Mobile UX Redesign):** 
  - إخفاء أزرار التحكم المعقدة من الأعلى وتخصيص الهيدر للموبايل ليكون أيقونات فقط (لصق، رفع ملف، السجل، حفظ مسودة، مشاركة، نسخ، تغيير الثيم).
  - تطوير الشريط السفلي الموحد (Mobile Bottom Nav) ليحتوي على كافة أدوات العرض والتحرير والترجمة والتنقل بتصميم زجاجي عصري (Glassmorphism).
  - نقل خيارات النسخ والتصدير (CopyMenu) في الموبايل من زر عائم جانبي إلى قائمة تنزلق من الأسفل (Bottom Sheet) متصلة بزر "تصدير" في الشريط السفلي.
  - تحسين المسافات والفواصل بين عناصر الواجهة (Fluid Icons Scaling) لمنع التداخل بين المحتوى وشريط الأدوات.

## [v1.4.0] - 2026-04-23

### أُضيف (Added)
- **الترجمة الذكية (Smart Translation):** دمج نموذج Llama 3.1 عبر Cloudflare Workers AI لترجمة النصوص بين العربية والإنجليزية.
- **زر ترجمة المحدد (Translate Selected):** القدرة على ترجمة جزء محدد من النص فقط أو ترجمة كامل المحتوى عند عدم تحديد نص.
- **تراجع عن الترجمة (Undo Translation):** زر لاستعادة النص الأصلي بعد إجراء عملية الترجمة للحفاظ على الأمان والتجربة السلسة.
- **إشعارات الترجمة:** حالات تحميل بصرية أثناء الترجمة ورسائل منبثقة (Toast) عند فشل العملية.

## [v1.3.0] - 2026-04-22
- **أزرار التنقل الذكية (Smart Scroll Navigation):** إضافة مكوّن بأزرار تنقل ذكية للتحكم بالتمرير (أعلى، أسفل، صفحة لأعلى، صفحة لأسفل) مع ظهور وإخفاء ديناميكي بناءً على مكان التمرير.
- **مؤشر التمرير (Scroll Progress Indicator):** إضافة شريط تقدم رأسي بجوار أزرار التنقل يعرض نسبة تمرير المستخدم داخل المحتوى الطويل.
- **نسخ الكود المضمّن (Inline Code Copy):** دعم إمكانية النسخ السريع لأكواد السطر الواحد عند النقر عليها، مع عرض رسالة تأكيدية.
- **الروابط التلقائية (Auto-link):** تفعيل النقر المباشر على عناوين URL العادية وفتحها في نافذة جديدة بشكل أوتوماتيكي.

### تم التعديل (Changed)
- **دعم اتجاه النص (RTL Enhancements):** إصلاح جذري لمشكلة تداخل الأقواس والكلمات الإنجليزية داخل الفقرات العربية من خلال فرض `unicode-bidi: isolate` على العناصر المضمنة.

## [v1.2.0] - 2026-04-22

### أُضيف (Added)
- **حفظ مسودة محلية (Local Draft Saving):** إضافة زر `حفظ مسودة` يتيح حفظ لقطة من النص الحالي في متصفح المستخدم للرجوع إليها لاحقاً دون رفعها إلى الكلاود (للأمان والسرعة).
- **استرجاع المسودات (Draft Restoration):** زر `استرجاع النص` داخل نافذة السجل يقوم بتحميل المسودة المحفوظة مباشرة إلى المحرر لمواصلة العمل عليها.
- **ميزة الطباعة (Print Feature):** إضافة زر طباعة يوفر نسخة نقية من محتوى المعاينة فقط، مع إخفاء أشرطة التنقل والمحرر باستخدام `@media print`.
- **مشاركة المحتوى (Share via Cloudflare KV Worker):** نظام مشاركة ينشئ روابط قصيرة تعتمد على Cloudflare KV لحفظ المحتوى مؤقتاً (لمدة 30 يوماً).
- **وضع القراءة فقط (Shared View Mode):** عند فتح رابط مشاركة، يتم تفعيل وضع "القراءة فقط" مع إخفاء أدوات التعديل وإظهار شريط تنبيهي للمستخدم.

### تم التعديل (Changed)
- **نافذة السجل (Share History Modal):** تم ترقية السجل ليصبح "السجل الشامل" قادراً على التفريق بين (روابط المشاركة المنشورة) وبين (المسودات المحلية)، وعرض واجهة مخصصة لكل نوع. تم رفع حد السجل الأقصى إلى 20 عنصراً وتفعيل شريط التمرير (Scroll).
- **بيئة النشر (Deployment Architecture):** تم الانتقال بالكامل من بيئة Cloudflare Pages Functions إلى بنية Cloudflare Workers المستقلة وإعادة تفعيل `src/worker.ts` وإلغاء مجلد `functions` لضمان استقرار عملية النشر والأتمتة (CI/CD).

## [v1.1.1] - 2026-04-17

### تم التعديل (Changed) — Manus UI Style

- **Typography System:** Added `JetBrains Mono` font. Updated root variables: `--font-mono`, `--font-latin`, `--leading-normal`, `--leading-relaxed`, `--leading-tight`.
- **Theme Variables (3 themes):** Added Manus-specific CSS variables to Cream, Noir, and Slate themes: `--border-color`, `--accent-hover`, `--code-bg`, `--code-border`, `--link-color`, `--link-hover`, `--hover-bg`.
- **Preview Styles:** Rewrote `.preview-content` section in `preview.css` with Manus minimalist style — cleaner headings, borderless tables with subtle separators, improved inline/block code rendering.
- **CodeBlock Component:** Replaced old macOS-dots header with clean Manus-style header showing language name + Copy button using `--code-bg` / `--code-border` CSS variables.
- **PreviewPane:** Updated `markdownComponents` to properly distinguish inline code from code blocks, added `pre` handler to prevent double-wrapping.
- **Backup:** Created `_backup_before_manus_style/` folder with 8 files (original state before this update).

## [v1.1.0] - 2026-04-08

### أُضيف (Added)

- **URL Hash Loading:** Auto-load markdown content from Base64-encoded URL hash. Agent can generate clickable links that open NanoMD with pre-loaded content.
- **Split Columns:** Support for separate `Item` and `Recommendation` columns in review tables. Columns display separately but merge with `←` on copy.
- **Section Separator Rows:** Visual divider rows in review tables (detected by empty `#` + `📌`). Displayed as centered bold text without action buttons, excluded from copy and progress counter.
- **Section Background Colors:** Alternating subtle background colors for row groups between separators, using CSS variables for theme compatibility.
- **File Upload Button:** Upload `.md`, `.txt`, or `.markdown` files directly from disk via Header button and EmptyState page. Uses FileReader API with UTF-8 encoding.
- **Recommendation Column Detection:** Added `التوصية` / `recommendation` / `توصية` as recognized column names for the split-column format.

### تم التعديل (Changed)

- Updated version to `v1.1.0` in `package.json` and footer.
- Consolidated localStorage and URL hash loading into a single `useEffect` with hash taking priority.

## [v1.0.1] - 2026-02-25

### أُضيف (Added)

- وثائق المشروع الأساسية والإلزامية.
  - `master-constitution.md`
  - `project-key.md`
  - `project-context.md`
- تصميم شعار (Logo) احترافي بصيغة SVG مطابق تماماً لطلب المطور بتدرجات لونية (أزرق وأصفر).
- تذييل (Footer) للتطبيق يحتوي على رقم الإصدار (v1.0.0) وحقوق النشر.

### تم التعديل (Changed)

- تحسين ملحوظ في ظهور وحجم زر الحذف (Clear Button) أثناء استخدام وضع المراجعة (Review Mode).
- تحديثات على ألوان وشكل الشعار السابق ليتناسب مع الصورة المطلوبة للعلامة التجارية.
