# Civenthra AI

> **“A Multimodal GenAI and Computer Vision-Based Civic Issue Detection and Grievance Management System”**  
> *Final-Year B.Tech Capstone Project Prototype*

---

## 🏛️ Project Overview

**Civenthra AI** is an advanced civic-technology platform designed to bridge the trust and efficiency deficit between citizens and municipal municipal corporations. By fusing **Computer Vision (YOLO defect localization)**, **Generative AI (multilingual grievance structuring)**, and **automated spatial clustering (Haversine duplicate detection)**, Civenthra AI automates the entire grievance lifecycle—from street-level reporting to cryptographic resolution verification.

---

## 🔄 Core End-to-End Workflow

```
Citizen
  → Multimodal Report (Image + Text + Voice + GPS)
  → Input Preprocessing & Tensor Normalization
  → Computer Vision Detection (YOLO Defect & Bounding Box)
  → Spatial GPS Verification
  → Proximity Duplicate Detection (75m Radius)
  → Impact & Priority Scoring (High / Medium / Low)
  → GenAI Multilingual Complaint Generation (EN, TE, HI, TA, KN)
  → Official Smart Ticket Issued (e.g., CIV-2026-000101)
  → Authority Dashboard Routing & Officer Allocation
  → Field Repair & After-Fix Photo Upload
  → Computer Vision Re-Verification (Before vs After Tensor Alignment)
  → Successful CV Match ──► RESOLVED & Certified
  → Failed CV Match     ──► Returned to ACTIVE (Rework Mandatory)
```

> **Crucial System Policy:** An issue can **never** be manually marked as `RESOLVED` by an authority or contractor. Closure is mathematically governed by the visual re-verification engine.

---

## 🌟 Key Functional Features

1. **Multimodal Reporting Interface**:
   - 📷 Street Camera / Gallery Upload with drag & drop and preview
   - 🎤 Hands-free Voice Note recording with simulated audio waveform visualizer
   - 📝 Natural text description for context
   - 📍 High-precision GPS geolocation and municipal ward geocoding
   - ⚡ 1-Click Demo presets for Potholes, Streetlights, Garbage Heaps, and Drainage

2. **Computer Vision & GenAI Intelligence**:
   - Simulated **YOLOv11** visual bounding box defect localization
   - **Haversine formula** proximity clustering for duplicate report detection within 75m
   - **GenAI complaint synthesis** in 5 Indian languages:
     - English
     - Telugu (తెలుగు)
     - Hindi (हिन्दी)
     - Tamil (தமிழ்)
     - Kannada (ಕನ್ನಡ)

3. **Official Smart Ticket System**:
   - Cryptographic Ticket ID format: `CIV-2026-XXXXXX`
   - Bounding box visual inspection overlay
   - Digital QR verification seal
   - Printable, shareable, and trackable

4. **Authority Control Console**:
   - KPI metrics: Total, Active, High Priority, In Progress, Awaiting Verification, Verified Resolved
   - Priority complaints queue with department and officer assignment modal
   - Interactive spatial map with color-coded severity pins (High, Medium, Low, Resolved)
   - Multi-criteria filterable complaints archive with CSV export

5. **Dedicated Resolution & CV Re-Verification Engine**:
   - Side-by-side **Before vs After** image matrix
   - Real-time animated scanning laser effect
   - Examiner Demo Mode: 1-Click toggle between **Test Successful Fix** and **Test Failed Fix (Reverts to Active)**
   - SSIM structural similarity %, defect clearance rate %, and verification certification

6. **UI & Accessibility**:
   - Dark mode and Light mode with persistent state
   - Fully responsive on mobile, tablet, and desktop
   - Built with modern React 19, Vite, Tailwind CSS v4, and Lucide icons

---

## 🚀 Quick Start Guide

### 1. Development Server
From the project directory:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## 🎤 Presentation Demo Walkthrough (For Examiners & Evaluators)

Use the persistent **Top Demo Banner** during your viva presentation:

1. **Citizen Submission Flow**:
   - Click **"Report Flow"** in the top bar (or navigate to `/citizen/report`).
   - Click one of the **1-Click Presets** (e.g., *Pothole* or *Garbage*).
   - Click **"Use My Current Location"** to pull live GPS.
   - Click **"Submit for AI Analysis"**.
   - Observe the 10-step animated AI pipeline (tensor preprocessing, YOLO defect detection, duplicate check, GenAI translation).
   - Test changing languages (Telugu, Hindi, Tamil, Kannada) to show the multilingual capability.
   - Click **"Generate Official Smart Ticket"**.
   - Show the generated Smart Ticket `CIV-2026-XXXXXX` with QR seal.

2. **Authority Assignment Flow**:
   - In the top banner, click **"Switch to Authority Portal"**.
   - View the executive KPI dashboard and priority complaints table.
   - Click **"Assign"** to allocate an engineer (e.g., *Er. Ramesh Babu*) to a ticket.

3. **CV Re-Verification & Resolution Flow (Most Important!)**:
   - Click **"Test CV Verification"** in the top banner (takes you to `/authority/resolution/comp_001`).
   - Point out the side-by-side **Original Image (Before)** vs **After-Fix Photo (After)**.
   - **First Demonstration (Success)**: Click **"Test Successful Fix"** → Click **"Submit for AI Verification"**. Watch the laser scan → Verified (96.8% confidence, 98.5% defect clearance) → Status transitions to **RESOLVED**.
   - **Second Demonstration (Failure Proof)**: Click **"Test Failed Fix"** → Click **"Submit for AI Verification"**. Watch the system detect residual hazards → Status **reverts to ACTIVE**! Explain that this prevents contractor fraud.

---

## 🔌 FastAPI & AI Backend Integration Ready

All services in `src/services/` are architecturally decoupled and prepared for immediate connection to a Python FastAPI backend:

- `src/services/api.js`: Base endpoints configured (`/api/v1/complaints`, `/api/v1/ai/computer-vision/detect`, etc.)
- Set environment variables in `.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000/api/v1
  VITE_USE_MOCK_API=false
  ```
- **Backend Stack Compatibility**:
  - Python FastAPI + Uvicorn
  - OpenCV + Ultralytics YOLOv11 (`best.pt` trained on civic defects)
  - Google Gemini API (`gemini-1.5-flash` or `gemini-2.0-flash`) for multilingual synthesis
  - MySQL / PostgreSQL with PostGIS for spatial queries

---

## 📂 Project Directory Structure

```
civenthra-ai/
├── src/
│   ├── components/
│   │   └── common/      # Logo, Button, Card, Modal, StatusBadge, PriorityBadge, DemoBanner
│   ├── layouts/         # CitizenLayout, AuthorityLayout
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── citizen/     # Dashboard, Report, AI Analysis, Smart Ticket, Tracking, Map, Profile
│   │   └── authority/   # Dashboard, Complaints, Details, Map, Departments, Resolution, Analytics
│   ├── services/        # api.js, aiService.js, verificationService.js, complaintService.js, locationService.js
│   ├── context/         # AuthContext, ComplaintContext, ThemeContext, LanguageContext
│   ├── data/            # Realistic mock dataset with coordinates and images
│   ├── App.jsx          # Route configuration
│   ├── main.jsx
│   └── index.css        # Tailwind v4 styles & Leaflet tokens
├── index.html
├── vite.config.js
└── package.json
```
