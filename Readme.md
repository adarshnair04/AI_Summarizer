AI Meeting Notes Summarizer
<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Python-3776AB%3Fstyle%3Dfor-the-badge%26logo%3Dpython%26logoColor%3Dwhite" alt="Python"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/FastAPI-009688%3Fstyle%3Dfor-the-badge%26logo%3Dfastapi%26logoColor%3Dwhite" alt="FastAPI"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Render-46E3B7%3Fstyle%3Dfor-the-badge%26logo%3Drender%26logoColor%3Dwhite" alt="Render"/>
</p>

A full-stack application designed to summarize meeting transcripts and other text using AI. Users can upload or paste text, provide custom instructions, edit the generated summary, and share it via email.

Live Demo: https://your-frontend-url.vercel.app

Application Preview
(To add your screenshot, replace the screenshot.png file in the root directory with your own image.)

Key Features
Dynamic Summarization: Utilizes the OpenAI API to generate concise and accurate summaries.

Custom Instructions: Users can guide the AI with custom prompts to tailor the summary's focus and format.

Flexible Input: Supports both pasting text directly and uploading .txt files.

Editable Output: The generated summary is presented in an editable text area for easy refinement.

Email Sharing: Seamlessly share the final summary with multiple recipients directly from the application.

Secure and Robust: Implemented with API rate limiting to prevent abuse and manage costs.

Tech Stack
Category

Technology

Backend

Python 3.11+, FastAPI, Uvicorn

Frontend

React.js, Axios, CSS

AI & Email

OpenAI API, FastAPI-Mail, SlowAPI (Rate Limit)

Deployment

Vercel (Frontend), Render (Backend)

Local Setup and Installation
To run this project on your local machine, please follow these steps:

Prerequisites
Node.js (v18 or later)

Python (v3.11 or later)

An OpenAI API key

A Gmail account with an "App Password" for sending emails

1. Clone the Repository
git clone [https://github.com/your-username/ai-summarizer.git](https://github.com/your-username/ai-summarizer.git)
cd ai-summarizer

2. Backend Setup
# Navigate to the server directory
cd server

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install the required Python packages
pip install -r requirements.txt

# Create a .env file for your credentials
# (You will need to create this file and add the variables below)
touch .env

# Start the backend server
uvicorn main:app --reload

The backend will be running at http://127.0.0.1:8000.

3. Frontend Setup
# Open a new terminal and navigate to the client directory
cd client

# Install the required npm packages
npm install

# Start the React development server
npm start

The frontend will be running at http://localhost:3000.

Environment Variables
The backend requires a .env file in the server directory. Create this file and add the following variables:

# Your secret key from the OpenAI platform
OPENAI_API_KEY="sk-..."

# Your Gmail credentials for sending emails
MAIL_USERNAME="your-email@gmail.com"
MAIL_PASSWORD="your-16-digit-app-password"
MAIL_FROM="your-email@gmail.com"
MAIL_PORT=587
MAIL_SERVER="smtp.gmail.com"

Note: It is highly recommended to use a Google "App Password" instead of your main account password for security.