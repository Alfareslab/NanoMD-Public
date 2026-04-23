# 🗺️ NanoMD v1.4.0 — Smart Translation (Llama AI)
> **الإصدار:** 1.4.0
> **التاريخ:** 2026-04-22
> **المنهجية:** Multi-Model Development
> **المرجع:** `reviews/04-review-translation-feature.md`

---

## 🎯 الهدف العام

إضافة ميزة **ترجمة ذكية احترافية** إلى NanoMD باستخدام نموذج **Llama 3.1 8B Instruct** عبر **Cloudflare Workers AI**.
الميزة تدعم الترجمة بين العربية والإنجليزية مع الحفاظ الكامل على تنسيق Markdown، الأكواد، والروابط.

### القرارات المعتمدة (من المراجعة):

| البند | القرار |
|-------|--------|
| المحرك | Llama 3.1 8B Instruct فقط (بدون m2m100) |
| النطاق | ترجمة المحدد + ترجمة الكل |
| المكان | أزرار فوق أزرار التنقل الجانبية (ScrollNav) |
| النص المختلط | ترجمة كل شي للغة الهدف |
| حد الحروف | 5000 حرف/طلب |
| Rate Limit | 50 طلب/دقيقة |
| Undo | متاح — زر تراجع يرجع النص الأصلي |

---

## 🚪 بوابات ما قبل التنفيذ

### 🚪 بوابة البساطة:
- [x] الحل يستخدم **أقل عدد ممكن** من الملفات (3 ملفات: worker.ts + ScrollNav.tsx + globals.css)
- [x] لا يوجد "تحسين مستقبلي" أو "ممكن نحتاجه"
- [x] كل قرار تقني له **سبب واضح** (مراجعة 04)

### 🚪 بوابة عدم التجريد:
- [x] نستخدم Cloudflare Workers AI **مباشرة** — بدون طبقات وسيطة
- [x] لا طبقات تجريد إضافية غير ضرورية

### 🚪 بوابة الوضوح:
- [x] المتطلبات **واضحة 100%** — كل البنود الحرجة لها قرار صريح
- [x] لا يوجد `[محتاج توضيح]` معلق

---

## 📅 المراحل التنفيذية

---

### **المرحلة 1: Backend — Translation API Endpoint 🔧**
> **النموذج:** `Claude Opus` 🔴
> **الهدف:** إضافة Workers AI binding + إنشاء endpoint `/api/translate`
> **يعتمد على:** لا شيء (مرحلة أولى)

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | إضافة `[ai] binding = "AI"` في `wrangler.toml` |
| `[x]` | `[ ]` | إنشاء route `POST /api/translate` في `src/worker.ts` |
| `[x]` | `[ ]` | تصميم System Prompt لـ Llama يحافظ على Markdown ولا يترجم الأكواد والروابط |
| `[x]` | `[ ]` | التحقق من حجم النص (≤5000 حرف) + Rate Limiting (50 طلب/دقيقة) |
| `[x]` | `[ ]` | معالجة الأخطاء: حصة منتهية، نموذج غير متاح، timeout |

#### تفاصيل تقنية:

**`wrangler.toml` — إضافة AI Binding:**
```toml
[ai]
binding = "AI"
```

**`src/worker.ts` — Translation Route:**
```typescript
// POST /api/translate
// Body: { text: string, targetLang: "ar" | "en" }
// Response: { translated: string } | { error: string }

// System Prompt (Llama 3.1 8B Instruct):
// "You are a professional translator. Translate the following Markdown text
//  to {targetLang}. Rules:
//  1. Preserve ALL Markdown formatting (headers, bold, italic, lists, links, etc.)
//  2. Do NOT translate code blocks (``` or inline `code`)
//  3. Do NOT translate URLs or file paths
//  4. Do NOT add explanations — output ONLY the translated text
//  5. Maintain the original paragraph structure"
```

**🔄 برومبت بدء هذه المرحلة:**
```
افتح ملف wrangler.toml وأضف [ai] binding = "AI" بعد قسم kv_namespaces.
ثم افتح src/worker.ts وأضف route جديد POST /api/translate قبل قسم getAssetFromKV.
الـ route يستقبل { text, targetLang } ويستخدم env.AI.run('@cf/meta/llama-3.1-8b-instruct', ...) للترجمة.
أضف System Prompt يحافظ على Markdown ويمنع ترجمة الأكواد.
أضف validation: حد أقصى 5000 حرف، rate limiting 50 طلب/دقيقة.
أضف error handling: رسائل خطأ واضحة بالعربي.
```

---

### **المرحلة 2: Frontend — Translation UI & Integration 🎨**
> **النموذج:** `Claude Opus` 🔴
> **الهدف:** إضافة أزرار الترجمة فوق أزرار ScrollNav + ربطها بالـ API
> **يعتمد على:** المرحلة 1 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | إضافة أزرار الترجمة (🌐 AR / 🌐 EN) في `ScrollNav.tsx` فوق أزرار التنقل |
| `[x]` | `[ ]` | إضافة منطق كشف النص المحدد (selected text) — لو فيه تظليل يترجم المحدد، لو مفيش يترجم الكل |
| `[x]` | `[ ]` | إضافة حالة التحميل (Spinner) أثناء الترجمة مع نص "جاري الترجمة..." |
| `[x]` | `[ ]` | إضافة زر "تراجع" (Undo) يظهر بعد الترجمة لاسترجاع النص الأصلي |
| `[x]` | `[ ]` | إضافة رسائل الخطأ: تجاوز الحد، فشل الاتصال، حصة منتهية |
| `[x]` | `[ ]` | تنسيق الأزرار بنفس أسلوب Glassmorphism المستخدم في ScrollNav |

#### تفاصيل التصميم:

**موقع الأزرار في ScrollNav:**
```
┌─────────────┐
│  🌐 AR      │ ← ترجم للعربية
│  🌐 EN      │ ← ترجم للإنجليزية
│─────────────│
│  ⬆ أعلى     │ ← أزرار التنقل الحالية
│  🔼 صفحة    │
│  🔽 صفحة    │
│  ⬇ أسفل     │
│  ▌ شريط     │ ← شريط التقدم الرأسي
└─────────────┘
```

**منطق الترجمة:**
```
1. المستخدم يضغط "🌐 AR":
   a. لو فيه نص مظلل → fetch('/api/translate', { text: selectedText, targetLang: 'ar' })
   b. لو مفيش تظليل → fetch('/api/translate', { text: fullContent, targetLang: 'ar' })
2. أثناء الانتظار → الزر يتحول لـ Spinner
3. بعد النجاح → يستبدل النص + يظهر زر "↩ تراجع"
4. زر "↩ تراجع" → يرجع النص الأصلي (محفوظ في state مؤقت)
5. بعد الفشل → يظهر رسالة خطأ لـ 3 ثواني ثم تختفي
```

**🔄 برومبت بدء هذه المرحلة:**
```
افتح src/components/ui/ScrollNav.tsx.
أضف زرين جديدين فوق أزرار التنقل الحالية: "🌐 AR" (ترجم للعربية) و "🌐 EN" (ترجم للإنجليزية).
الأزرار تستخدم نفس أسلوب Glassmorphism الحالي.
عند الضغط:
- لو فيه نص مظلل (window.getSelection) → ترجم المحدد فقط واستبدله في content.
- لو مفيش تظليل → ترجم المحتوى كاملاً.
أضف Spinner أثناء الترجمة.
أضف زر "↩ تراجع" يظهر بعد الترجمة.
أضف رسائل خطأ واضحة.
اختبر على docs/rtl-test-cases.md.
```

---

### **المرحلة 3: CSS & Polish 💎**
> **النموذج:** `Gemini Pro` 🟠
> **الهدف:** تنسيق الأزرار الجديدة + تحسين المظهر البصري
> **يعتمد على:** المرحلة 2 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | إضافة تنسيقات للأزرار في `globals.css` (Hover effect, Active state). |
| `[x]` | `[ ]` | فاصل بصري بين أزرار الترجمة وأزرار التنقل. |
| `[x]` | `[ ]` | تصميم تأثير الـ Spinner أثناء التحميل. |
| `[x]` | `[ ]` | تأثير fadeIn / fadeOut لزر التراجع. |
| `[x]` | `[ ]` | تحسين شكل رسائل الخطأ (Toast Notification). |
| `[x]` | `[ ]` | التوافق مع الثيمات (Light / Dark / Sepia). |

**🔄 برومبت بدء هذه المرحلة:**
```
افتح src/styles/globals.css.
أضف تنسيقات لأزرار الترجمة الجديدة في ScrollNav:
- أزرار الترجمة فوق أزرار التنقل مع فاصل بصري بينهم.
- Hover effect + active state.
- Spinner animation أثناء التحميل.
- زر التراجع مع fadeIn/fadeOut animation.
- Toast notification للأخطاء.
- تأكد من التوافق مع الثيمات الثلاثة.
```

---

### **المرحلة 4: Testing & Deploy 🧪**
> **النموذج:** `Gemini Pro` 🟠
> **الهدف:** اختبار شامل + نشر + تحديث التوثيق
> **يعتمد على:** المرحلة 3 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | اختبار الترجمة EN→AR مع نص Markdown كامل (headers, code, links) |
| `[x]` | `[ ]` | اختبار الترجمة EN→AR مع نص Markdown كامل (headers, code, links) |
| `[x]` | `[ ]` | اختبار الترجمة AR→EN مع نص عربي (أقواس، bold، أكواد) |
| `[x]` | `[ ]` | اختبار ترجمة النص المحدد (selected text) فقط |
| `[x]` | `[ ]` | اختبار حد الـ 5000 حرف + رسالة الخطأ |
| `[x]` | `[ ]` | اختبار زر التراجع (Undo) بعد الترجمة |
| `[x]` | `[ ]` | اختبار مع الثيمات الثلاثة |
| `[x]` | `[ ]` | تحديث `package.json` → v1.4.0 |
| `[x]` | `[ ]` | تجربة الميزة محلياً عبر `npm run dev` والتأكد من نجاح الترجمة. |
| `[x]` | `[ ]` | تحديث `project-context.md` (إضافة تفاصيل الإصدار الجديد والميزات). |
| `[x]` | `[ ]` | تحديث `project-key.md` إذا استدعى الأمر. |
| `[x]` | `[ ]` | تحديث `changelog.md` بملخص التحديثات لـ v1.4.0. |
| `[x]` | `[ ]` | إضافة التعديلات للـ Git (`git add`, `git commit`). |
| `[x]` | `[ ]` | نشر على GitHub + Cloudflare |

**🔄 برومبت بدء هذه المرحلة:**
```
شغل المشروع بـ npm run dev واختبر ميزة الترجمة:
1. اكتب نص إنجليزي فيه headers وcode وlinks واضغط "🌐 AR" — تأكد إن الأكواد والروابط ما اتترجمت.
2. اكتب نص عربي واضغط "🌐 EN".
3. ظلل جزء من النص واضغط ترجمة — تأكد إنه ترجم المحدد فقط.
4. اختبر نص أطول من 5000 حرف — تأكد من رسالة الخطأ.
5. اختبر زر التراجع.
6. غير الثيم وتأكد من التنسيق.
ثم حدّث الإصدار إلى v1.4.0 في package.json و App.tsx footer.
حدّث project-context.md و project-key.md و changelog.md و presentation-ar.md.
انشر على GitHub.
```

---

## 📊 ملخص النماذج والمراحل

| المرحلة | الوصف | النموذج | التعقيد | الملفات |
|---------|-------|---------|---------|---------|
| 1 | Backend Translation API | `Claude Opus` 🔴 | حرج — Worker + AI Binding | `wrangler.toml`, `src/worker.ts` |
| 2 | Frontend UI & Integration | `Claude Opus` 🔴 | حرج — منطق + واجهة | `src/components/ui/ScrollNav.tsx` |
| 3 | CSS & Polish | `Gemini Pro` 🟠 | عادي — تنسيقات | `src/styles/globals.css` |
| 4 | Testing & Deploy | `Gemini Pro` 🟠 | عادي — اختبارات + توثيق | ملفات التوثيق + deploy |

---

## 📁 الملفات المتأثرة

| الملف | نوع التعديل | المرحلة |
|-------|-------------|---------|
| `wrangler.toml` | MODIFY — إضافة AI binding | 1 |
| `src/worker.ts` | MODIFY — إضافة translation route | 1 |
| `src/components/ui/ScrollNav.tsx` | MODIFY — إضافة أزرار الترجمة + منطق | 2 |
| `src/styles/globals.css` | MODIFY — تنسيقات الأزرار الجديدة | 3 |
| `package.json` | MODIFY — version bump | 4 |
| `src/App.tsx` | MODIFY — footer version | 4 |
| `project-context.md` | MODIFY — توثيق | 4 |
| `project-key.md` | MODIFY — توثيق | 4 |
| `changelog.md` | MODIFY — توثيق | 4 |
| `docs/presentation-ar.md` | MODIFY — توثيق | 4 |
