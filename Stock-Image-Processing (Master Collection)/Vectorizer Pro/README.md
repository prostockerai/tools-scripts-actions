# 📘 Vectorizer Pro — User Manual

**Version:** 1.0
**Developed by:** Mostafizar Rahman
**Contact:** [Telegram: @mostafizarfiz](https://t.me/mostafizarfiz)

---

## 🔰 Overview

Vectorizer Pro একটি অটোমেশন টুল যা আপনার কম্পিউটারের **input ফোল্ডার** থেকে JPG, JPEG, PNG ফাইলগুলো নিয়ে স্বয়ংক্রিয়ভাবে [Vectorizer.AI](https://vectorizer.ai/) ওয়েবসাইটে আপলোড করে EPS ফাইল আকারে **output ফোল্ডারে** ডাউনলোড করে।

### Features:

* Input ফোল্ডারের সব ইমেজ প্রসেস করে
* Browser session একবার সংরক্ষণ করলে পুনরায় লগইন দরকার নেই
* Progress bar এবং live status label সহ কাজের অবস্থা দেখায়

---

## 🧩 Requirements

* Windows 10/11 বা নতুন
* Python 3.8+
* Playwright লাইব্রেরি:

  ```bash
  python -m pip install playwright
  python -m playwright install
  ```
* Vectorizer.AI Premium অ্যাকাউন্ট
* Internet connection

---

## 📁 Folder Structure

```bash
E:\Vectorizer-Pro\
│
├── input\        # JPG, JPEG, PNG ফাইল
├── output\       # EPS ফাইল সংরক্ষণের জন্য
├── VectorizerPro.py
└── session.json  # First run এ auto create হবে
```

---

## ⚙️ Setup Steps

1. Python ইনস্টল করুন এবং **"Add Python to PATH"** সিলেক্ট করুন
2. প্রজেক্ট ফোল্ডার তৈরি করুন এবং `input` / `output` ফোল্ডার তৈরি করুন
3. Playwright ইনস্টল করুন:

   ```bash
   pip install playwright
   python -m playwright install
   ```
4. `VectorizerPro.py` ফাইল ফোল্ডারে রাখুন

---

## 🚀 How to Use

1. PowerShell/Terminal খুলুন এবং প্রজেক্ট ফোল্ডারে যান
2. স্ক্রিপ্ট চালান:

   ```bash
   python VectorizerPro.py
   ```

### First Time Setup (Session Save)

* `"1. Save Session"` বাটনে ক্লিক করুন
* Browser খুলবে → Vectorizer.AI তে লগইন করুন
* Browser বন্ধ করুন → `session.json` তৈরি হবে

### Process Images

* `input` ফোল্ডারে ইমেজ রাখুন
* `"2. Process Images"` বাটনে ক্লিক করুন
* সব ইমেজ EPS হয়ে `output` ফোল্ডারে সেভ হবে

---

## 📝 Notes & Tips

* Input ফোল্ডার খালি থাকলে কাজ করবে না
* `session.json` না থাকলে প্রসেস শুরু হবে না
* Session একবারই সংরক্ষণ করতে হয়
* EPS ডাউনলোডের সময় browser visible থাকবে
* বড় batch এর আগে ছোট test করুন
* সবসময় input ফোল্ডারের backup রাখুন

---

## 🛠️ Troubleshooting

* **Browser open হচ্ছে না** → Playwright ঠিকভাবে install হয়েছে কিনা দেখুন
* **Session file not found** → "Save Session" ক্লিক করুন
* **Folder not found** → input/output ঠিক আছে কিনা চেক করুন
* **Download fail** → Internet + Premium account চেক করুন
* **PermissionError** → ফাইল অন্য প্রোগ্রামে খোলা আছে কিনা দেখুন

---

## ❓ FAQ

**Q: একই নামের ছবি থাকলে কী হবে?**
A: Output ফোল্ডারে duplicate হলে browser auto rename করতে পারে

**Q: EPS ফাইল কোথায় যাবে?**
A: `output` ফোল্ডারে

**Q: একবারে কত ছবি প্রসেস করা যাবে?**
A: আপনার কম্পিউটারের resources অনুযায়ী

---

## 📄 License / Credits

© 2025 Vectorizer Pro
Developed by Mostafizar Rahman
[Telegram: @mostafizarfiz](https://t.me/mostafizarfiz)
