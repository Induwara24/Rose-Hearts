# Rose Hearts: AI-Powered Breast Cancer Detection System

**Rose Hearts** is a web-based decision support system designed to assist radiologists in the early detection of breast cancer from mammograms. It utilizes advanced Deep Learning (ResNet-50) and Explainable AI (XAI) to provide accurate, transparent, and trustworthy diagnostic insights.

-----

## 📖 Table of Contents

  - [Background & Problem](https://www.google.com/search?q=%23-background--problem)
  - [Key Features](https://www.google.com/search?q=%23-key-features)
  - [System Architecture](https://www.google.com/search?q=%23-system-architecture)
  - [Performance](https://www.google.com/search?q=%23-performance)
  - [Installation & Setup](https://www.google.com/search?q=%23-installation--setup)
  - [Usage](https://www.google.com/search?q=%23-usage)
  - [Known Limitations](https://www.google.com/search?q=%23-known-limitations)
  - [Roadmap](https://www.google.com/search?q=%23-roadmap)
  - [Authors & Acknowledgments](https://www.google.com/search?q=%23-authors--acknowledgments)

-----

## 🧐 Background & Problem

[cite_start]Breast cancer is the leading cause of cancer-related mortality among Sri Lankan women[cite: 3063]. Early detection is critical, but standard screening faces significant challenges:

  * [cite_start]**High False Positives:** Leading to unnecessary biopsies and patient anxiety[cite: 3064].
  * [cite_start]**Missed Diagnoses (False Negatives):** Particularly in dense breast tissue where tumors are hard to see[cite: 3320].
  * [cite_start]**"Black Box" AI:** Lack of transparency in AI predictions prevents clinical trust[cite: 3323].

**Rose Hearts** addresses these by offering a low-cost, accessible web tool that classifies standard 2D mammograms and visually explains *why* a prediction was made.

-----

## ✨ Key Features

  * **automated Classification:** Classifies mammograms into **Normal**, **Benign**, or **Malignant** with high accuracy.
  * **Explainable AI (XAI):**
      * [cite_start]**Grad-CAM:** Heatmaps showing the general region of interest[cite: 3599].
      * [cite_start]**LIME:** Granular segmentation highlighting specific super-pixels[cite: 3603].
  * [cite_start]**Robust Preprocessing:** Uses **CLAHE** (Contrast Limited Adaptive Histogram Equalization) to enhance features in dense breast tissue[cite: 3490].
  * [cite_start]**Instant Reporting:** Generates downloadable PDF reports with diagnosis, confidence scores, and visual evidence[cite: 3680].
  * [cite_start]**Privacy Focused:** Processes images locally/securely without permanent storage[cite: 4003].

-----

## 🏗️ System Architecture

### **Tech Stack**

  * [cite_start]**Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn/UI[cite: 5825].
  * [cite_start]**Backend:** Python, FastAPI, Uvicorn[cite: 5781].
  * **AI Engine:** TensorFlow/Keras, OpenCV, NumPy.
  * [cite_start]**Model:** Fine-tuned **ResNet-50** CNN (Pre-trained on ImageNet)[cite: 5782].

### **Data Pipeline**

The model was trained on a **Composite Dataset** of **26,602 images** combining three global standards:

1.  [cite_start]**MIAS** (Mammographic Image Analysis Society) [cite: 4089]
2.  [cite_start]**InBreast** (Full Field Digital Mammograms) [cite: 4091]
3.  [cite_start]**DDSM** (Digital Database for Screening Mammography) [cite: 4092]

-----

## 📊 Performance

The system was rigorously evaluated on an independent test set.

| Metric | Score | Description |
| :--- | :--- | :--- |
| **Accuracy** | **91.83%** | [cite_start]Overall correctness of predictions[cite: 5888]. |
| **Recall (Sensitivity)** | **91.75%** | [cite_start]Ability to correctly identify Malignant cases (Critical for minimizing false negatives)[cite: 5889]. |
| **Precision** | **91.84%** | [cite_start]Ability to minimize False Positives[cite: 5892]. |
| **AUC Score** | **0.9864** | [cite_start]Excellent discriminative ability between classes[cite: 5893]. |

> [cite_start]**Note:** The model outperformed other architectures like InceptionV3 and EfficientNetB0 in our experiments[cite: 5888].

-----

## ⚙️ Installation & Setup

### Prerequisites

  * **Git LFS** (Large File Storage) - *Required for downloading the model weights.*
  * **Python 3.10+**
  * **Node.js 18+**

### 1\. Clone the Repository

```bash
# Install Git LFS first if you haven't
git lfs install

# Clone the repo
git clone https://github.com/Induwara24/Rose-Hearts.git
cd Rose-Hearts
```

### 2\. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate
# Activate it (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3\. Frontend Setup

```bash
cd ../frontend

# Install Node modules
npm install
```

-----

## 🚀 Usage

### Step 1: Start the Backend Server

Open a terminal in the `backend` folder:

```bash
# Ensure venv is active
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

*Wait until you see the message:* `✅ Model weights loaded and verified successfully!`

### Step 2: Start the Frontend

Open a new terminal in the `frontend` folder:

```bash
npm run dev
```

Open your browser to `http://localhost:5173`.

### Step 3: Diagnosis

1.  Navigate to the **Upload** page.
2.  Drag and drop a mammogram image (JPG/PNG).
3.  Click **Submit for Analysis**.
4.  View the prediction, confidence score, and XAI heatmaps on the **Results** dashboard.

-----

## ⚠️ Known Limitations

  * **Domain Shift (Photographs vs. Scans):** The model is optimized for **direct digital mammograms** (scanned images). [cite_start]During validation at Sri Lanka Cancer Hospital, performance degraded on *photographs* of physical films due to glare, uneven lighting, and camera noise[cite: 3017].
  * **Preprocessing Sensitivity:** The system applies CLAHE automatically. Uploading images that have *already* been enhanced may lead to "Double CLAHE" artifacts, affecting accuracy. Please upload **RAW** images for best results.

-----

## 🗺️ Roadmap

  * [cite_start][ ] **Clinical Trials:** Formal validation with a second ethical clearance for live patient testing[cite: 5951].
  * [cite_start][ ] **3D Mammography (DBT):** Upgrading the model to process Digital Breast Tomosynthesis volumes[cite: 5956].
  * [cite_start][ ] **PACS Integration:** Direct integration with hospital DICOM servers for seamless data retrieval[cite: 5961].

-----

## 👥 Authors & Acknowledgments

**Research Team:**

  * **Induwara Sithum Siriwardana**
  * **Januthma Sadamini Dharmadasa**
  * **Thivanka Chathuranga Ekanayaka**

**Supervisors:**

  * **Ms. Asanka Ranasinghe** (Principal Supervisor)
  * **Ms. Rusini Siyara Liyanachchi** (Co-Supervisor)
  * **Dr. [cite_start]Akalanka Muthukumarana** (Medical Supervisor - Surgical SHO, BH Balapitiya) [cite: 3037]

[cite_start]*Special thanks to the staff of the National Cancer Institute (Maharagama) and Sri Lanka Cancer Hospital (Karapitiya) for their support.* [cite: 3042]

-----

## 📄 License

This project is licensed under the **MIT License**.
