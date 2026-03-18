# 🏥 HealthOS — AI-Powered Clinical Documentation Platform

> **Team HealthWarriors** · Ambient Intelligence for Modern Healthcare

---

## Video

https://github.com/user-attachments/assets/1d2b470b-7377-4a80-b0e0-863ac9bc700d

## 🌟 Overview

**HealthOS** is a full-stack, AI-powered clinical documentation platform that listens to real-time doctor–patient conversations and automatically generates structured medical records — so doctors can focus on patients, not paperwork.

It captures spoken dialogue(Multilangual), produces a summarized consultation note, and maps the extracted clinical data to **FHIR R4** resources — making records instantly interoperable with modern healthcare systems.

---

## 🎯 The Problem We Solve

| Pain Point | HealthOS Solution |
|---|---|
| Doctors spend 2–4 hrs/day on documentation | Real-time ambient scribe automates note-taking |
| Inconsistent record formats across hospitals | FHIR R4 mapping ensures universal interoperability |
| No historical context during consultations | Patient history is surfaced during live sessions |
| Transcription errors in manual notes | LLM-powered summarization with clinical accuracy |

---

## ✨ Key Features

- 🎙️ **Real-Time Speech-to-Text** — Powered by Faster-Whisper with Hinglish support for multilingual consultations
- 🧠 **AI Summarization** — LangChain + Gemini LLM pipeline generates clean, structured SOAP notes
- 📋 **FHIR R4 Mapping** — Automatically converts conversation data into standards-compliant FHIR resources
- 📁 **Patient History Context** — Retrieves prior records to give the LLM historical context for better summaries
- 📄 **Soft Copy Export** — Download consultation summaries as PDFs and structured JSON
- 🖥️ **Live Dashboard** — React PWA frontend displays transcription and summary in real time

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HealthOS Platform                           │
│                                                                     │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────┐  │
│  │   React PWA  │────▶│   FastAPI Backend  │────▶│  Gemini LLM   │  │
│  │  (Frontend)  │◀────│  (API + Websocket) │◀────│  via LangChain│  │
│  └──────────────┘     └────────┬───────────┘     └───────────────┘  │
│                                │                                     │
│              ┌─────────────────┼──────────────────┐                 │
│              ▼                 ▼                  ▼                  │
│  ┌──────────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │  Faster-Whisper  │ │  Patient DB  │ │   FHIR R4 Mapper Engine  │ │
│  │  (ASR Engine)    │ │  (History)   │ │  (Clinical Data Extract) │ │
│  └──────────────────┘ └──────────────┘ └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React (PWA) |
| Styling | Tailwind CSS |
| State Management | React Context / Hooks |
| Audio Capture | Web Audio API |

### Backend
| Layer | Technology |
|---|---|
| API Framework | FastAPI (Python) |
| Speech-to-Text | Faster-Whisper |
| LLM Orchestration | LangChain |
| LLM Model | Google Gemini |
| FHIR Mapping | Custom FHIR R4 Engine |
| Data Storage | PostgreSQL / Firebase |
| Hosting | HuggingFace |

### DevOps & Deployment
| Layer | Technology |
|---|---|
| Backend Hosting | Vercel / Railway |
| Frontend Hosting | Vercel |
| CI/CD | GitHub Actions |

---

## 📁 Project Structure

```
HealthOS/
├── frontend/                  # React PWA
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI Components
│   │   ├── pages/             # Dashboard, Patient View
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # API helpers
│   └── package.json
│
├── backend/                   # FastAPI Application
│   ├── main.py                # App entry point
│   ├── api/
│   │   ├── routes/            # API route handlers
│   │   └── websockets/        # Real-time audio stream
│   ├── services/
│   │   ├── transcription.py   # Faster-Whisper ASR
│   │   ├── summarization.py   # LangChain + Gemini pipeline
│   │   └── fhir_mapper.py     # FHIR R4 resource builder
│   ├── models/                # Pydantic schemas & DB models
│   └── requirements.txt
│
├── docs/                      # Architecture & API docs
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- A Google Gemini API Key
- ffmpeg (for audio processing)

---

### 1. Clone the Repository

```bash
git clone [Link](https://github.com/shivam99392677/HealthOS.git)
cd HealthOS
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables section)

# Run the development server
uvicorn main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`
API Docs (Swagger): `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# LLM
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/healthos

# FHIR Server (optional)
FHIR_SERVER_BASE_URL=https://your-fhir-server.com/fhir/R4

# App Settings
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session/start` | Start a new consultation session |
| `WS` | `/ws/stream/{session_id}` | WebSocket for live audio streaming |
| `GET` | `/api/session/{id}/transcript` | Get raw transcript |
| `GET` | `/api/session/{id}/summary` | Get AI-generated SOAP note |
| `GET` | `/api/session/{id}/fhir` | Get FHIR R4 Bundle for the session |
| `GET` | `/api/patient/{id}/history` | Fetch patient's previous records |
| `POST` | `/api/session/{id}/export` | Export summary as PDF |

---

## 🧬 FHIR R4 Resources Generated

HealthOS maps conversation data to the following FHIR resources:

- `Patient` — Demographics extracted from conversation
- `Encounter` — Visit metadata (date, type, provider)
- `Condition` — Diagnoses and chief complaints
- `Observation` — Vitals and clinical findings
- `MedicationRequest` — Prescribed medications
- `Procedure` — Any procedures discussed
- `AllergyIntolerance` — Allergies mentioned
- `CarePlan` — Follow-up and treatment plan

---

## 🌐 Deployment

### Deploy Backend to Vercel

```bash
# vercel.json is pre-configured for FastAPI
vercel deploy --prod
```

### Deploy Frontend to Vercel

```bash
cd frontend
vercel deploy --prod
```

> ⚠️ Ensure all environment variables are set in your Vercel project dashboard.

---

## 🗺️ Roadmap

- [x] Real-time audio transcription (Faster-Whisper)
- [x] LangChain + Gemini summarization pipeline
- [x] FHIR R4 resource mapping engine
- [x] React PWA frontend with live dashboard
- [ ] Hinglish / multilingual improvement fine-tuning
- [ ] EHR system integration (OpenMRS, Bahmni)
- [ ] On-device inference for offline clinics
- [ ] Role-based access control (Doctor / Nurse / Admin)
- [ ] Voice activity detection & speaker diarization
- [ ] RCM (Revenue Cycle Management) AI integration

---

## 🤝 Contributing

We welcome contributions from the community!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

## 👥 Team HealthWarriors

Built with ❤️ for better healthcare, one conversation at a time.

> *"The best interface between a doctor and their notes is no interface at all."*

---

<p align="center">
  <strong>HealthOS · HealthWarriors · 2025</strong>
</p>
