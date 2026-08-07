# StudyWise

**Adaptive revision assistant that transforms your notes into a personalised study roadmap using Retrieval-Augmented Generation (RAG).**

StudyWise helps students revise more efficiently by transforming uploaded notes into structured study material. It extracts topics, stores note embeddings, and generates topic-wise flashcards, quizzes, and summaries using Retrieval-Augmented Generation (RAG). Study sessions continuously update an adaptive roadmap so students focus on the topics that need the most revision.

[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL + pgvector](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Gemini](https://img.shields.io/badge/Gemini%20API-generation%20%2B%20embeddings-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

# Overview

| | |
|---|---|
| **Problem** | Students often accumulate large volumes of notes without knowing which topics require the most revision. |
| **Solution** | Studywise extracts topics, builds a vector database from uploaded notes, and retrieves only the relevant content before generating study material with Gemini. |
| **Result** | A dynamic roadmap that continuously adapts based on recall confidence, quiz performance, and revision history. |

---

# Screenshots

## Projects Dashboard

The central workspace displaying all the user's active projects.

<p align="center">
  <img src="docs/images/Projects.png" width="90%">
</p>

---

## Adaptive Roadmap

Topics are ranked dynamically based on confidence, quiz accuracy, and revision history.

<p align="center">
  <img src="docs/images/Roadmap.png" width="90%">
</p>

---

## Flashcards

Generate flashcards grounded in retrieved sections of your uploaded notes.

<p align="center">
  <img src="docs/images/Flashcards.png" width="90%">
</p>

---

## Quiz

Test your understanding with AI-generated quizzes tailored to each topic.

<p align="center">
  <img src="docs/images/Quiz.png" width="90%">
</p>

---

## AI Summary

View the topic at a glance with a short AI-generated summary

<p align="center">
  <img src="docs/images/Summary.png" width="90%">
</p>

---

# Features

### Upload & Organise Notes

- Upload PDF or text notes.
- Automatically extract revision topics.
- Organise multiple subjects using project-based workspaces.
- Track progress independently for each topic and each project.

### Adaptive Revision Roadmap

- Calculates a priority score for every topic.
- Reorders the roadmap after every study session.
- Prioritisation considers:
  - Recall confidence
  - Quiz Accuracy
  - Time since last revision

### AI Study Material

- Generate flashcards grounded in uploaded notes.
- Generate AI-powered quizzes for active recall.
- Produce concise topic summaries.
- Uses Retrieval-Augmented Generation (RAG) to reduce hallucinations.

### Secure Authentication

- JWT-based authentication
- Password hashing with Bcrypt
- User-specific projects and study history

### Developer Experience

- Async FastAPI backend
- Auto-generated OpenAPI documentation
- Modular service-based architecture

---

# Why Retrieval-Augmented Generation?

Instead of relying on a language model's general knowledge, StudyWise retrieves only the most relevant sections from a user's uploaded notes before generation.

> Traditional LLMs rely on general knowledge and may hallucinate facts. StudyWise retrieves only the relevant sections of a user's uploaded notes before generation, ensuring study material remains grounded in the source content.

This approach:
- Reduces hallucinations
- Keeps generated content grounded in the original notes
- Produces personalised study material
- Avoids generating information unrelated to the uploaded content

---

# Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, React Router 7 |
| **Backend** | FastAPI (Async), SQLAlchemy (Async), Alembic |
| **Database** | PostgreSQL (pgvector extention), Supabase |
| **AI** | Google Gemini API (Generation), Gemini Embeddings |
| **Authentication** | JWT, Bcrypt |

---

# System Architecture

```text
                    Upload Notes (PDF/TXT)
                             │
                             ▼
                     Document Parsing
                             │
                             ▼
                     Topic Extraction
                             │
                             ▼
                     Chunk & Embed
                             │
                             ▼
                        PostgreSQL
        (Users, Projects, Topics, Chunks + Embeddings)
                             │
                             ▼
                  pgvector Similarity Search
                             │
                             ▼
                    Retrieved Chunks
                             │
                             ▼
                     Gemini LLM
                             │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
               Flashcards         Quizzes        Summaries
                                     │
                                     ▼
                           Study Session Results
                                     │
                                     ▼
                             Priority Engine
                                     │
                                     ▼
                            Adaptive Roadmap
```

# Project Structure

```text
studywise/
|
├── backend/
|    ├── main.py
|    ├── config.py
|    ├── schemas.py
|    ├── models/
|    ├── routers/
|    ├── services/
|    ├── prompts/
|    ├── db/
|
├── frontend/
|    └── src
|        ├── pages/
|        ├── components/
|        ├── api/
|        ├── store/
|        └── types/
|
└── README.md
```

---

# Priority Scoring

Each topic maintains a `priority_score` between **0** and **1**, updated after every study session.

The score is computed using a weighted combination of:

- Recall confidence
- Quiz Accuracy
- Time since the previous revision

Topics with higher scores are surfaced first in the roadmap, ensuring time is focused on the areas that need the most attention.

---

# Getting Started

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- Google Gemini API Key

## Backend

Create a `.env` file inside `backend/`.

```env
GEMINI_API_KEY=your_api_key
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/studywise
JWT_SECRET_KEY=your_secret_key
```

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r ../requirements.txt

alembic upgrade head

uvicorn main:app --reload
```

Backend:
```
http://localhost:8000
```

API Docs:
```
http://localhost:8000/docs
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:
```
http://localhost:5173
```

---

# API Overview

| Endpoint | Description |
|---|---|
| `POST /api/auth/*` | User Authentication |
| `POST /api/projects` | Create and manage study projects |
| `GET /api/roadmap` | Retrieve prioritised roadmap |
| `POST /api/study/flashcards` | Generate flashcards |
| `POST /api/study/quiz` | Generate quizzes |
| `POST /api/study/summary` | Generate summaries |
| `POST /api/session/result` | Updates study progress and reprioritises topics |

Complete API documentation is available at `/docs` after running the backend.

---

# Configuration

| Variable | Default | Description |
|---|---|---|
| `GEMINI_LLM_MODEL` | `gemini-3-flash-preview` | LLM used for content generation |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001` | Embedding model |
| `CHUNK_SIZE` | `500` | Size of note chunks  |
| `CHUNK_OVERLAP` | `50` | Chunk Overlap |
| `TOP_K_CHUNKS` | `5` | Retrieved chunks per request |
| `MAX_UPLOAD_SIZE_MB` | `20` | Maximum upload size |

---

# Future Improvements

- Smart revision scheduling with spaced repetition
- Learning analytics dashboard
- OCR support for handwritten notes
- Collaborative study groups
- Smart study sessions
- Multi-LLM support

---

# License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
