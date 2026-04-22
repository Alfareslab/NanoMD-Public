# 📝 سجل التغييرات (Changelog) - NanoMD

## [v1.2.0] - 2026-04-22

### أُضيف (Added)
- **ميزة الطباعة (Print Feature):** إضافة زر طباعة يوفر نسخة نقية من محتوى المعاينة فقط، مع إخفاء أشرطة التنقل والمحرر باستخدام `@media print`.
- **مشاركة المحتوى (Share via Cloudflare KV):** نظام مشاركة جديد ينشئ روابط قصيرة تعتمد على Cloudflare KV لحفظ المحتوى بشكل آمن ومؤقت (لمدة 30 يوماً).
- **وضع القراءة فقط (Shared View Mode):** عند فتح رابط مشاركة، يتم تفعيل وضع "القراءة فقط" مع إخفاء أدوات التعديل وإظهار شريط تنبيهي للمستخدم.
- **سجل المشاركات (Share History Modal):** واجهة جديدة (`ShareHistory`) تحفظ الروابط المنشأة محلياً، مع إمكانية إعادة النسخ، فتح الرابط، وعرض حالة الانتهاء، بالإضافة إلى خيار الحذف.
- **worker.ts:** واجهات برمجية (`POST /api/share` و `GET /api/share/:id`) مدمجة مع Cloudflare Workers لإدارة تخزين واسترجاع البيانات بحد أقصى 500KB.

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
