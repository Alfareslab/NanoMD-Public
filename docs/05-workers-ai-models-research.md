# 📚 بحث نماذج Workers AI - تحديث الترجمة 2026

**التاريخ:** 2026-05-07  
**الحالة:** تم تحديث القرار بعد إشعار Cloudflare الرسمي  
**الإصدار المرتبط:** v1.7.0

---

## 1. سبب التحديث

تم استلام إشعار رسمي من Cloudflare بأن نموذج الترجمة السابق في NanoMD:

```text
@cf/meta/llama-3.1-8b-instruct
```

ضمن النماذج المخطط لإيقافها يوم **30 مايو 2026**.

لذلك لم يعد مناسباً الاستمرار عليه كنموذج أساسي للترجمة.

---

## 2. النموذج السابق

كان الكود يستخدم سابقاً:

```typescript
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: body.text }
    ]
});
```

المشكلة:

- النموذج ضمن قائمة deprecation من Cloudflare.
- حد الترجمة كان مضبوطاً يدوياً على 5000 حرف.
- شكل الاستجابة كان يعتمد على `response.response` فقط.
- الترجمة المحددة داخل المحرر كانت تستخدم استبدالاً نصياً غير آمن.

---

## 3. القرار النهائي

| الدور | النموذج | السبب |
|------|---------|-------|
| النموذج الأساسي | `@cf/google/gemma-4-26b-a4b-it` | جودة ترجمة أفضل، سياق كبير، مناسب للترجمة متعددة اللغات والصياغة الطبيعية |
| النموذج الاحتياطي | `@cf/zai-org/glm-4.7-flash` | سريع، متعدد اللغات، مناسب كـ fallback عند أخطاء الخدمة المؤقتة |
| مؤجل | `@cf/moonshotai/kimi-k2.6` | قوي جداً، لكنه أكبر من احتياج الترجمة اليومية حالياً |

---

## 4. التغييرات المنفذة في v1.7.0

- تحديث نموذج الترجمة الأساسي إلى `@cf/google/gemma-4-26b-a4b-it`.
- إضافة fallback إلى `@cf/zai-org/glm-4.7-flash`.
- رفع حد الترجمة المباشر إلى 50000 حرف.
- إضافة ترجمة واعية بالسياق داخل نفس طلب الترجمة.
- دعم استخراج الاستجابة من `choices[0].message.content` مع دعم الشكل القديم `response.response`.
- إصلاح ترجمة النص المحدد داخل المحرر باستخدام `selectionStart` و `selectionEnd`.

---

## 5. ملاحظات فنية

- سياق النموذج يقاس بالتوكنز وليس بعدد الأحرف.
- حد 50000 حرف هو حد عملي أولي، وليس الحد الأقصى المطلق لسياق النموذج.
- تقسيم النصوص الطويلة Markdown-aware مؤجل لخطة لاحقة إذا ظهرت الحاجة.
- دعم ترجمة التحديد من المعاينة مؤجل، لأن النص المعروض HTML وقد لا يطابق Markdown الأصلي حرفياً.

---

## 6. المراجع

- Workers AI Models: https://developers.cloudflare.com/workers-ai/models/
- Gemma 4: https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/
- GLM 4.7 Flash: https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/
- Workers AI Changelog: https://developers.cloudflare.com/workers-ai/changelog/
