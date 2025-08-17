📝 AI Meeting Notes Summarizer

A full-stack application that leverages AI to generate concise summaries from meeting transcripts and documents. Users can upload or paste text, provide custom instructions, edit the generated summary, and share it via email.

<p align="center"> <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/> <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/> <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"/> </p>
🚀 Live Demo

👉 Try it here

📸 Application Preview

(Add your own screenshot by replacing screenshot.png in the root directory.)

✨ Features

AI-Powered Summarization – Generate concise, accurate summaries using OpenAI.

Custom Instructions – Guide the AI’s focus and tone.

Multiple Input Options – Paste text or upload .txt files.

Editable Output – Review and refine summaries before sharing.

Email Integration – Send summaries to multiple recipients seamlessly.

Rate Limiting – Prevent abuse and manage API costs effectively.

🛠️ Tech Stack
Category	Technology
Backend	Python 3.11+, FastAPI, Uvicorn
Frontend	React.js, Axios, CSS
AI & Email	OpenAI API, FastAPI-Mail, SlowAPI
Deployment	Vercel (Frontend), Render (Backend)
🏗️ Architecture
flowchart LR
    A[User] -->|Upload Text / File| B[React Frontend]
    B -->|API Request| C[FastAPI Backend]
    C -->|Summarization| D[OpenAI API]
    C -->|Send Email| E[SMTP (Gmail)]
    C -->|Response| B
    B -->|Summary Display / Edit| A

⚙️ Local Setup & Installation
Prerequisites

Node.js v18+

Python v3.11+

OpenAI API key

Gmail account with a Google App Password

1. Clone the Repository
git clone https://github.com/your-username/ai-summarizer.git
cd ai-summarizer

2. Backend Setup
# Navigate to server directory
cd server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
touch .env


Add the following in .env:

# OpenAI API Key
OPENAI_API_KEY="sk-..."

# Gmail SMTP Config
MAIL_USERNAME="your-email@gmail.com"
MAIL_PASSWORD="your-16-digit-app-password"
MAIL_FROM="your-email@gmail.com"
MAIL_PORT=587
MAIL_SERVER="smtp.gmail.com"


Run the backend:

uvicorn main:app --reload


Backend runs at → http://127.0.0.1:8000

3. Frontend Setup
# Open a new terminal
cd client

# Install dependencies
npm install

# Start React development server
npm start


Frontend runs at → http://localhost:3000

🔐 Security Notes

Always use Google App Passwords instead of your main Gmail password.

Never commit .env files to version control.

Apply rate limiting in production to manage API costs.

📜 License

This project is licensed under the MIT License.