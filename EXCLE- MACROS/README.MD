# 📸 Excel VBA Auto Image Arrange & Group Tool

এই VBA script টা Excel এর মধ্যে automatically image গুলো detect করে, same size এ resize করে, grid layout এ সাজায়, এবং 4 টা করে group করে দেয়।

👉 Manual Ctrl + click করে image select করার কোনো দরকার নেই — just একটা area select করে macro run করলেই হবে 🚀

---

## ✨ Features / কি কি করতে পারবে

* ✅ Selected area এর ভিতরের সব image auto detect করবে
* ✅ All images will be resized to exact same width & height
* ✅ Grid layout এ সাজাবে (4 images per row)
* ✅ 4 টা করে image automatically group করবে
* ✅ No need for manual selection

---

## 🛠️ Setup Guide / কিভাবে সেটআপ করবে

### 1. VBA Editor open করো

* Press: `ALT + F11`

### 2. Module add করো

* Click: `Insert` → `Module`

### 3. Code paste করো

তোমার VBA code টা ওই module এর ভিতরে paste করো

### 4. File save করো

```id="v2m8xq"
.xlsm (Macro Enabled Workbook)
```

---

## ▶️ How to Use / কিভাবে ব্যবহার করবে

### Step 1: Area select করো

Excel এ যেই জায়গায় image গুলো আছে, ওই cell area টা select করো

### Step 2: Macro run করো

* Press: `ALT + F8`
* Select:

```id="c7p3ld"
ArrangeImages_FromSelectedArea
```

* Click: **Run**

### Step 3: Size input দাও

* Enter Width
* Enter Height

👉 Done! 🎉

Images automatically:

* Resize হবে
* Grid এ arrange হবে
* 4 টা করে group হয়ে যাবে

---

## 🧠 How it Works / কিভাবে কাজ করে

* Script টি sheet এর সব shape check করে
* তারপর শুধুমাত্র selected area এর ভিতরের image গুলো নেয়
* প্রতিটি image কে same size এ resize করে
* Grid layout এ position করে
* প্রতি 4 টা image automatically group করে

---

## ⚙️ Customization / কাস্টমাইজেশন অপশন

এই অংশটা দিয়ে তুমি সহজেই script টা নিজের মতো adjust করতে পারবে 👇

### 🔢 1. Images per row change করা

Default ভাবে 4টা image per row থাকে।
চাইলে তুমি change করতে পারো:

```id="k9d2mp"
If i Mod 4 = 0
```

👉 5 per row করতে চাইলে → `Mod 5`
👉 6 per row করতে চাইলে → `Mod 6`

---

### 📏 2. Gap (spacing) control করা

Image এর মাঝে space বাড়াতে বা কমাতে:

```id="g5t8qn"
gapX = 0
gapY = 0
```

👉 Example:

* gapX = 10 → horizontal space বাড়বে
* gapY = 20 → vertical space বাড়বে

---

### 📐 3. Default size system (smart control)

User input ছাড়া fixed size দিতে চাইলে:

```id="w3x7rt"
userW = 120
userH = 140
```

👉 এতে every image same fixed design size পাবে

---

### 📦 4. Grouping behavior control

Grouping system 4 image per group:

```id="m8k4vz"
If i Mod 4 = 0 Then
```

👉 চাইলে group system change করে:

* 2 image group
* 3 image group
* 6 image group

---

### 🎯 5. Start position control

Image layout কোথা থেকে শুরু হবে:

```id="s6n2xp"
startX = Selection.Left
startY = Selection.Top
```

👉 তুমি চাইলে fixed position দিতে পারো (like A1 area)

---

### 🧩 6. Advanced improvement ideas (optional upgrade)

* Auto center alignment (page middle)
* Auto page fit (print ready layout)
* Button click UI (no ALT + F8 needed)
* Auto detect only newly pasted images
* Smart spacing based on page width

---

## ⚠️ Notes / গুরুত্বপূর্ণ

* Only selected area এর ভিতরের image process হবে
* Locked shape থাকলে কাজ নাও করতে পারে
* Best performance for picture (msoPicture)

---

## 👨‍💻 Author

Created by **Fizar**

---

## ⭐ Support

যদি useful লাগে, GitHub এ একটা ⭐ দিয়ে দিও 😄
