
# 📦 Illustrator Pattern Template Scripts

Collection of custom **Adobe Illustrator scripts & actions** for automating pattern template workflows.

⚡ **One-click system:**
👉 Scripts background-এ থাকবে
👉 Actions panel থেকে শুধু ▶ Play করলেই সব run হবে

---

# 📥 Installation & Setup

## 🔹 Step 1: Download Project

* Download ZIP / Clone repository

---

## 🔹 Step 2: Install Scripts (.jsx)

সব `.jsx` file copy করে এখানে রাখো:

### 🪟 Windows

```
C:\Program Files\Adobe\Adobe Illustrator [version]\Presets\en_GB\Scripts
```

### 🍎 MacOS

```
/Applications/Adobe Illustrator [version]/Presets.localized/en_GB/Scripts
```

👉 তারপর Illustrator restart করো

---

## 🔹 Step 3: Install Actions (.aia)

1. Open Illustrator
2. Go → **Window → Actions**
3. Click menu (☰)
4. Click → **Load Actions...**
5. Select `.aia` file

✅ Done

---

# ⚙️ How It Works (IMPORTANT)

📌 System logic:

* `.jsx` → backend script (manual run করার দরকার নাই)
* `.aia` → script call করে internally

👉 তাই user শুধু এটা করবে:

```
Actions Panel → Select Action → ▶ Play
```

❌ File → Scripts manually run করতে হবে না
✅ সব automation action থেকেই হবে

---

# 🔁 Workflow (Serial Order)

👉 MUST follow order (1 → 6)

---

## 1️⃣ Pattern Alline Action

📁 `Pattern Alline Action/`

**Setup:**

* Load `.aia`

**Run:**
👉 Actions panel → ▶ Play

---

## 2️⃣ Size Script

📁 `Size Script/`

**Setup:**

* `.jsx` → Scripts folder
* `.aia` → Actions panel

**Run:**
👉 Actions panel → ▶ Play

---

## 3️⃣ Bounding Box

📁 `Bounding BoX/`

**Setup:**

* `.jsx` → Scripts folder
* `.aia` → Actions panel

**Run:**
👉 Actions panel → ▶ Play

---

## 4️⃣ Template Script (Nest Pattern)

📁 `Template Script Nest Pattern/`

**Setup:**

* `.jsx` → Scripts folder
* `.aia` → Actions panel

**Run:**
👉 Actions panel → ▶ Play

---

## 5️⃣ Arrow Mark

📁 `Arrow Mark/`

**Preview:**

![Arrow Mark](./Arrow%20Mark/arro%20mark.gif)

**Setup:**

* `.jsx` → Scripts folder
* `.aia` → Actions panel

**Run:**
👉 Actions panel → ▶ Play

---

## 6️⃣ Creat Design and Arrow Mark

📁 `Creat Design and Arro Mark/`

**Setup:**

* `.jsx` → Scripts folder
* `.aia` → Actions panel

**Run:**
👉 Actions panel → ▶ Play

---

# 🔗 Workflow Logic

```
1 → 2 → 3 → 4 → 5 → 6
```

👉 সব step connected
👉 একটার output next step use করে

---

# 📁 Folder Structure

```
Pattern Template Making Script and Action/
│
├── Arrow Mark/
├── Bounding BoX/
├── Creat Design and Arro Mark/
├── Pattern Alline Action/
├── Size Script/
└── Template Script Nest Pattern/
```

---

# ⚠️ Important Notes

* Illustrator restart না করলে script detect করবে না
* Scripts manually run করার দরকার নাই
* সব action থেকেই trigger হবে
* Object select থাকা লাগবে

---

# 📬 Contact

Telegram: **@mostafizarfiz**

---

If you want next level polish:
আমি এটাকে **premium GitHub repo style (badges + icons + UI preview sections)** বানিয়ে দিতে পারি 👍
