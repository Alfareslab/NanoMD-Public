# 🧪 ملف تجربة شامل — NanoMD v1.1.1

هذا الملف يختبر **جميع ميزات** NanoMD في مكان واحد.

---

## 1. 📝 أساسيات النصوص

هذه **فقرة عادية** فيها نص **عريض** ونص *مائل* ونص ***عريض ومائل***.

يمكنك أيضاً كتابة `كود مضمن` داخل السطر مثل `const x = 42;` أو `npm install`.

**رابط:** [زر NanoMD على GitHub](https://github.com)

---

## 2. 📋 القوائم

### قائمة عادية:
- بند أول
- بند ثاني
  - بند متداخل
  - بند متداخل آخر
    - مستوى ثالث
- بند ثالث

### قائمة مرقمة:
1. الخطوة الأولى
2. الخطوة الثانية
   1. خطوة فرعية
   2. خطوة فرعية أخرى
3. الخطوة الثالثة

---

## 3. 💬 الاقتباسات (بلوك داخل بلوك)

> هذا اقتباس عادي بمستوى واحد.
> يمكن أن يمتد لأكثر من سطر.

> **اقتباس مع نص عريض**
>> هذا اقتباس داخل اقتباس — المستوى الثاني.
>>> هذا المستوى الثالث من الاقتباس المتداخل.

> **ملاحظة مهمة:**
> يمكن وضع `كود مضمن` داخل اقتباس.
>> بل يمكن وضع اقتباس ثانٍ يحتوي على **نص عريض** و*مائل*.

---

## 4. 💻 بلوكات الأكواد (Code Blocks)

### JavaScript:
```javascript
// Hello World in JavaScript
const greet = (name) => {
  return `Hello, ${name}!`;
};

console.log(greet("NanoMD"));
```

### Python:
```python
# مثال بلغة Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# طباعة أول 10 أرقام
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")
```

### TypeScript + React:
```tsx
import React, { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => {
        setClicked(true);
        onClick();
      }}
      className={clicked ? 'active' : ''}
    >
      {label}
    </button>
  );
};
```

### CSS — Manus Style:
```css
/* Manus UI Variables */
:root {
  --font-arabic: 'IBM Plex Sans Arabic', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --code-bg: #f6f6f6;
  --code-border: #e5e5e5;
  --hover-bg: rgba(0, 0, 0, 0.02);
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  font-family: var(--font-mono);
}
```

### Shell / Bash:
```bash
# أوامر تشغيل المشروع
cd d:\MyProjects\Nano-IDE\NanoMD
npm install
npm run dev

# أو للبناء للإنتاج:
npm run build
```

### JSON:
```json
{
  "name": "nanomd",
  "version": "1.1.1",
  "features": ["review-mode", "url-hash", "file-upload", "manus-style"],
  "fonts": {
    "arabic": "IBM Plex Sans Arabic",
    "mono": "JetBrains Mono"
  }
}
```

---

## 5. 📊 جدول عادي (Manus Style)

| الميزة | الإصدار | الحالة |
|--------|---------|--------|
| Review Mode | v1.0.0 | ✅ مكتمل |
| URL Hash Loading | v1.1.0 | ✅ مكتمل |
| Split Columns | v1.1.0 | ✅ مكتمل |
| Section Separator | v1.1.0 | ✅ مكتمل |
| Section Colors | v1.1.0 | ✅ مكتمل |
| File Upload | v1.1.0 | ✅ مكتمل |
| Manus UI Style | v1.1.1 | ✅ مكتمل |

---

## 6. 🔍 جدول مراجعة (Review Mode) — مع Split Columns وSection Separators

| البند | التوصية | الأولوية | القرار |
|-------|---------|---------|--------|
| # | 📌 قسم: الخطوط والتايبوغرافي | | |
| تحديث خط الكود إلى JetBrains Mono | استخدام `--font-mono` في CSS | عالية | |
| إضافة متغيرات `--leading-*` | للتحكم في ارتفاع السطر بشكل موحد | متوسطة | |
| # | 📌 قسم: ألوان الثيمات | | |
| إضافة `--code-bg` للثيم الداكن | `#111111` مع حدود `#222222` | عالية | |
| إضافة `--hover-bg` | `rgba(255,255,255,0.03)` للداكن | متوسطة | |
| إضافة `--link-color` و`--link-hover` | ألوان مختلفة لكل ثيم | عالية | |
| # | 📌 قسم: مكونات المعاينة | | |
| ترقية CodeBlock بشريط علوي | عرض اسم اللغة + زر Copy | عالية | |
| تحديث PreviewPane | التفريق بين inline و block code | عالية | |
| إزالة macOS dots من الهيدر | الاستعاضة بـ language label نظيف | منخفضة | |

---

## 7. 📎 خط فاصل وصور

---

> **💡 تلميح:** يمكنك تجربة **وضع التركيز** (Focus Mode) بالنقر على الأيقونة في الشريط العلوي للكتابة بدون تشتت.

---

*تم إنشاء هذا الملف للتجربة الشاملة لكل ميزات NanoMD v1.1.1*
