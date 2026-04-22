# 🔑 مفتاح وفهرس مشروع NanoMD

هذا الملف يحتوي على خريطة المشروع وهيكلة الملفات الأساسية.

## هيكل المجلدات الرئيسي

- `src/`
  - `components/`
    - `ui/` : المكونات القابلة لإعادة الاستخدام (أزرار، لوجو، `ShareHistory.tsx`، `ScrollNav.tsx`، الخ).
    - `editor/` : مكونات المحرر وعرض المحتوى.
    - `layout/` : مكونات التخطيط (Header, MobileNav, SplitView, FocusMode).
    - `preview/` : مكونات العرض (PreviewPane, ReviewTable, CodeBlock).
  - `hooks/` : الـ Custom Hooks لإدارة الوظائف.
  - `contexts/` : الـ React Contexts لإدارة الحالة (State).
  - `styles/` : ملفات الـ CSS الرئيسية.
  - `utils/` : دوال مساعدة.
  - `types/` : تعريفات TypeScript.
  - `worker.ts` : سكريبت Cloudflare Worker للتعامل مع KV API للمشاركة (الواجهة الخلفية).
- `scripts/` : سكريبتات مساعدة لأتمتة المهام (مثل `deploy.bat` و `03-run-dev.cmd`).
- `plans/` : خطط التنفيذ.
- `reviews/` : ملفات المراجعة والقرارات.
- `docs/` : ملفات التوثيق والعروض التقديمية (مثل `presentation-ar.md`).
- `improvements/` : وثائق التحسينات المقترحة.

## الملفات المفصلية

- `src/App.tsx` : نقطة الدخول الرئيسية للتطبيق والمتحكم في وضعيات العرض + URL Hash Loading.
- `src/components/preview/ReviewTable.tsx` : جدول المراجعة التفاعلي مع دعم Split Columns + Separators + Section Colors.
- `src/components/preview/PreviewPane.tsx` : عرض محتوى Markdown مع كشف تلقائي لجداول المراجعة.
- `src/components/layout/Header.tsx` : شريط التنقل العلوي مع أزرار اللصق والرفع والنسخ.
- `src/components/ui/EmptyState.tsx` : صفحة البداية مع خيارات اللصق والسحب والرفع.
- `src/styles/globals.css` : الألوان الرئيسية (Themes) وأنماط التطبيق العامة.
- `src/styles/preview.css` : أنماط عرض نصوص Markdown ووضع المراجعة (Review Mode) + Section styles.
