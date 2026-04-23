# 🗺️ خطة: دليل وضع المراجعة التفاعلي (Review Mode Guide)

> **الإصدار:** 1.0.0
> **التاريخ:** 2026-04-23
> **النموذج:** Claude Opus 🔴

---

## 🎯 الهدف العام

إضافة تجربة تعريفية مبهرة (Onboarding Experience) في صفحة الـ EmptyState تشرح للمستخدم **وضع المراجعة (Review Mode)** — أقوى ميزة في NanoMD — وتعلمه إزاي يستخدمها مع أي نموذج AI.

الهدف مش مجرد "صفحة شرح" — الهدف إن المستخدم ينبهر ويفهم القيمة في **ثواني** من خلال:
1. **كارت زجاجي جذاب** في الـ EmptyState
2. **Modal تفاعلي** فيه شرح مع ديمو حي (Before → After)
3. **برومبت جاهز للنسخ** يديه للـ AI

> **ملاحظة معمارية:** الكارت ده واحد من مجموعة كروت ميزات (Feature Cards) هنضيفها لاحقاً — التصميم لازم يكون **قابل للتوسع** (Grid-ready) بحيث نقدر نضيف كروت تانية بدون إعادة تصميم.

---

## 📅 المراحل التنفيذية

---

### **المرحلة 1: Feature Cards Grid في الـ EmptyState 🏗️**

> **النموذج:** `Claude Opus` 🔴
> **الهدف:** تحضير البنية الأساسية لشبكة كروت الميزات في الـ EmptyState مع الكارت الأول (Review Mode)
> **يعتمد على:** لا شيء — نقطة البداية

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إنشاء مكون `FeatureCard.tsx` في `src/components/ui/` — كارت زجاجي (Glassmorphism) عام وقابل لإعادة الاستخدام |
| `[x]` | `[x]` | إنشاء مكون `FeatureCardsGrid.tsx` في `src/components/ui/` — شبكة مرنة تعرض الكروت بتنسيق responsive (1 عمود موبايل / 2-3 ديسكتوب) |
| `[x]` | `[x]` | تعديل `EmptyState.tsx` — إضافة `FeatureCardsGrid` تحت منطقة اللصق الحالية (Hero Section) |
| `[x]` | `[x]` | إضافة ستايلات الـ Glassmorphism Card في `globals.css` — backdrop-filter, gradient border, hover animations |

**تفاصيل تصميم الكارت الزجاجي:**

```
┌─────────────────────────────────┐
│  ✨ [أيقونة]                     │  ← أيقونة Lucide متحركة
│                                  │
│  [عنوان الميزة]                  │  ← خط Outfit، bold
│  [وصف مختصر سطر-سطرين]         │  ← خط عربي، muted
│                                  │
│  [اكتشف المزيد →]               │  ← رابط accent بأنيميشن
└─────────────────────────────────┘
```

**مواصفات الـ Glassmorphism:**
- `backdrop-filter: blur(16px)`
- `background: color-mix(in srgb, var(--bg-secondary) 60%, transparent)`
- `border: 1px solid color-mix(in srgb, var(--border-default) 50%, transparent)`
- `box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08)`
- Hover: `border-color → accent/40`, `scale(1.02)`, `shadow` أكبر
- أنيميشن دخول: `fade-in + slide-up` بـ stagger delay لكل كارت

**مواصفات الشبكة:**
- الشبكة تظهر **تحت** منطقة اللصق الحالية (Logo + "ألصق نص الـ AI هنا")
- Mobile: عمود واحد (كارت بعرض كامل)
- Tablet: عمودين
- Desktop: 3 أعمدة (أو 2 لو الكروت قليلة — مع `max-width` لمنع التمدد)
- `gap: 16px`
- `max-width: 640px` (عمود واحد) / `960px` (عمودين أو أكتر)

---

### **المرحلة 2: Review Mode Guide Modal 🎭**

> **النموذج:** `Claude Opus` 🔴
> **الهدف:** بناء الـ Modal التفاعلي اللي بيشرح الميزة بشكل مبهر
> **يعتمد على:** المرحلة 1 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | إنشاء مكون `ReviewModeGuide.tsx` في `src/components/ui/` — الـ Modal الرئيسي |
| `[x]` | `[x]` | تصميم **الجزء الأول: الشرح والخطوات** — 3 خطوات بأيقونات وأنيميشن تتابعية |
| `[x]` | `[x]` | تصميم **الجزء الثاني: Live Demo** — عرض Before (Markdown خام) → After (Review Table حقيقي) |
| `[x]` | `[x]` | إضافة **صندوق البرومبت** مع زر نسخ + Toast تأكيد |
| `[x]` | `[x]` | ربط الـ Modal بكارت Review Mode من المرحلة 1 (onClick → open modal) |
| `[x]` | `[x]` | إضافة ستايلات الـ Modal في `globals.css` — overlay, slide-in, responsive |

**هيكل الـ Modal:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ✕ إغلاق                                                       │
│                                                                  │
│  ┌───────────────────────┐  ┌────────────────────────────────┐  │
│  │  📋 الشرح والخطوات    │  │  🔮 معاينة حية                 │  │
│  │                        │  │                                │  │
│  │  الخطوة 1: انسخ التعلي │  │  [Before: Markdown خام]        │  │
│  │  ━━━━━━━━━━━━━━━━━━━━ │  │        ↕ أنيميشن               │  │
│  │  ┌──────────────────┐ │  │  [After: Review Table حقيقي]   │  │
│  │  │ البرومبت          │ │  │  مع أزرار ✅ ❌ ⏸️             │  │
│  │  │ [📋 انسخ التعليمات]│ │  │                                │  │
│  │  └──────────────────┘ │  │                                │  │
│  │                        │  │                                │  │
│  │  الخطوة 2: أعطيه للـ  │  │                                │  │
│  │  AI واطلب مراجعة      │  │                                │  │
│  │                        │  │                                │  │
│  │  الخطوة 3: الصق النتي │  │                                │  │
│  │  جة هنا وشوف السحر    │  │                                │  │
│  └───────────────────────┘  └────────────────────────────────┘  │
│                                                                  │
│  [🚀 جربها الآن — ألصق نص المراجعة]                             │
└─────────────────────────────────────────────────────────────────┘
```

**على الموبايل:** الـ Layout يتحول لعمود واحد (الشرح فوق، الـ Demo تحت) كـ scrollable sheet.

**تفاصيل الـ Live Demo:**
- بيبدأ بعرض **كود Markdown خام** لجدول مراجعة (نص حقيقي مش placeholder)
- بعد 2 ثانية (أو بضغطة زر "شاهد التحويل ✨") بينتقل بأنيميشن **morphing** للشكل النهائي
- الشكل النهائي هو **ReviewTable حقيقي مصغّر** بأزرار شغالة (مجرد عرض، مش محتاج يحفظ)
- التبديل Between Before/After ممكن يكون بـ Toggle button أو Auto-cycle

**البرومبت المقترح (إنجليزي — لأفضل توافق مع كل نماذج الـ AI):**

```
When proposing changes or reviewing decisions, present them in a Markdown table:
| # | Item | Recommendation | Details | Decision |
Use 🔴 Critical, 🟡 Important, 🟢 Optional in the Item column.
Leave the Decision column empty — I will respond using NanoMD.
```

---

### **المرحلة 3: التلميع والأنيميشن والتجاوب 💎**

> **النموذج:** `Claude Opus` 🔴
> **الهدف:** ضبط الأنيميشن والتجاوب وضمان تجربة WOW على كل الأجهزة
> **يعتمد على:** المرحلة 2 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[x]` | أنيميشن **Staggered Entry** لكروت الميزات (كل كارت يدخل بتأخير عن اللي قبله) |
| `[x]` | `[x]` | أنيميشن **Morphing Transition** للـ Before/After في الـ Demo (fade + scale + blur) |
| `[x]` | `[x]` | ضبط **التجاوب الكامل** — Modal يتحول لـ Bottom Sheet على الموبايل |
| `[x]` | `[x]` | اختبار على كل الـ Themes (Dark / Light / كل الثيمات الموجودة) |
| `[x]` | `[x]` | اختبار أداء — الأنيميشن لازم تكون `60fps` بدون jank (استخدام `will-change` و `transform` فقط) |
| `[x]` | `[x]` | ضبط الـ `print-hide` — الـ Feature Cards والـ Modal لا يظهروا في الطباعة |

---

### **المرحلة 4: التوثيق والتسليم 📝**

> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** تحديث التوثيق وتسجيل التغييرات
> **يعتمد على:** المرحلة 3 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | تحديث `project-context.md` — إضافة Review Mode Guide كميزة نشطة |
| `[ ]` | `[ ]` | تحديث `project-key.md` — إضافة الملفات الجديدة (FeatureCard, FeatureCardsGrid, ReviewModeGuide) |
| `[ ]` | `[ ]` | تحديث `changelog.md` — تسجيل التغيير (v1.6.0) |
| `[ ]` | `[ ]` | تحديث رقم الإصدار في `App.tsx` (footer) من v1.4.0 إلى v1.6.0 |

---

## 📊 ملخص النماذج والمراحل

| المرحلة | الوصف | النموذج | الحالة |
|---------|-------|---------|--------|
| 1 | Feature Cards Grid + Glassmorphism Card | Claude Opus 🔴 | ✅ |
| 2 | Review Mode Guide Modal + Live Demo | Claude Opus 🔴 | ✅ |
| 3 | الأنيميشن والتلميع والتجاوب | Claude Opus 🔴 | ✅ |
| 4 | التوثيق والتسليم | Gemini Flash 🟢 | ⏳ |

---

## 📂 الملفات المتأثرة

| الملف | التغيير |
|-------|---------|
| `src/components/ui/FeatureCard.tsx` | **[NEW]** — مكون الكارت الزجاجي العام |
| `src/components/ui/FeatureCardsGrid.tsx` | **[NEW]** — شبكة كروت الميزات |
| `src/components/ui/ReviewModeGuide.tsx` | **[NEW]** — Modal الدليل التفاعلي |
| `src/components/ui/EmptyState.tsx` | **[MODIFY]** — إضافة FeatureCardsGrid |
| `src/styles/globals.css` | **[MODIFY]** — إضافة ستايلات Glassmorphism + Modal |
| `project-context.md` | **[MODIFY]** — تحديث الميزات النشطة |
| `project-key.md` | **[MODIFY]** — تحديث فهرس الملفات |
| `changelog.md` | **[MODIFY]** — تسجيل v1.6.0 |

---

## 🚪 بوابات ما قبل التنفيذ

### 🚪 بوابة البساطة:
- [x] الحل يستخدم **3 ملفات جديدة فقط** — كل ملف ليه وظيفة واضحة
- [x] لا يوجد "تحسين مستقبلي" — كل حاجة مُستخدمة فعلياً
- [x] كل قرار تقني ليه سبب واضح

### 🚪 بوابة عدم التجريد:
- [x] نستخدم React + Tailwind + CSS Variables مباشرة
- [x] لا مكتبات أنيميشن خارجية — CSS transitions و `@keyframes` فقط

### 🚪 بوابة الوضوح:
- [x] المتطلبات واضحة 100%
- [x] لا يوجد `[محتاج توضيح]` معلق

---

## 🔄 برومبت بدء المرحلة الأولى:

```
افتح الخطة plans/11-review-mode-guide.md وابدأ تنفيذ المرحلة 1: Feature Cards Grid.

المطلوب:
1. أنشئ FeatureCard.tsx — كارت زجاجي (Glassmorphism) عام يقبل: icon, title, description, onClick
2. أنشئ FeatureCardsGrid.tsx — شبكة responsive تعرض الكروت (حالياً كارت واحد: Review Mode)
3. عدّل EmptyState.tsx — أضف FeatureCardsGrid تحت Hero Section
4. أضف ستايلات Glassmorphism في globals.css

خد بالك:
- التصميم لازم يكون مبهر (Glassmorphism + gradient border + hover scale)
- الشبكة لازم تكون جاهزة لإضافة كروت جديدة مستقبلاً (Grid layout)
- الكارت الحالي عنوانه: "✨ وضع المراجعة التفاعلي" ووصفه: "حول جداول الـ AI لأزرار تفاعلية — وفر وقتك ورد بضغطة"
- لا تضيف أي مكتبات خارجية
```
