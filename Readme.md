AI Meeting Notes Summarizer

A full-stack application designed to summarize meeting transcripts and other text using AI. Users can upload or paste text, provide custom instructions, edit the generated summary, and share it via email.



Live Demo: https://your-frontend-url.vercel.app Deployed Link



Key Features

Dynamic Summarization: Utilizes the OpenAI API to generate concise and accurate summaries.



Custom Instructions: Users can guide the AI with custom prompts to tailor the summary's focus and format.



Flexible Input: Supports both pasting text directly and uploading .txt files.



Editable Output: The generated summary is presented in an editable text area for easy refinement.



Email Sharing: Seamlessly share the final summary with multiple recipients directly from the application.



Secure and Robust: Implemented with API rate limiting to prevent abuse and manage costs.



Tech Stack

Backend

Python 3.11+



FastAPI: For building a high-performance, modern API.



OpenAI API: For AI-powered text generation.



SlowAPI: For request rate limiting.



FastAPI-Mail: For handling email sending.



Uvicorn: As the ASGI server.



Frontend

React.js: For building the user interface.



Axios: For making API requests to the backend.



CSS: For custom styling and layout.



Deployment

Backend: Deployed on Render.



Frontend: Deployed on Vercel.



Local Setup and Installation

To run this project on your local machine, please follow these steps:



Prerequisites

Node.js (v18 or later)



Python (v3.11 or later)



An OpenAI API key



A Gmail account with an "App Password" for sending emails



1\. Clone the Repository

git clone \[https://github.com/your-username/ai-summarizer.git](https://github.com/your-username/ai-summarizer.git)

cd ai-summarizer



2\. Backend Setup

\# Navigate to the server directory

cd server



\# Create and activate a virtual environment

python -m venv venv

source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`



\# Install the required Python packages

pip install -r requirements.txt



\# Create a .env file and add your credentials (see .env.example)

cp .env.example .env

\# Now, edit the .env file with your keys



\# Start the backend server

uvicorn main:app --reload



The backend will be running at http://127.0.0.1:8000.



3\. Frontend Setup

\# Open a new terminal and navigate to the client directory

cd client



\# Install the required npm packages

npm install



\# Start the React development server

npm start



The frontend will be running at http://localhost:3000.



Environment Variables

The backend requires a .env file in the server directory with the following variables:



\# Your secret key from the OpenAI platform

OPENAI\_API\_KEY="sk-..."



\# Your Gmail credentials for sending emails

MAIL\_USERNAME="your-email@gmail.com"

MAIL\_PASSWORD="your-16-digit-app-password"

MAIL\_FROM="your-email@gmail.com"

MAIL\_PORT=587

MAIL\_SERVER="smtp.gmail.com"



Note: It is highly recommended to use a Google "App Password" instead of your main account password for security.



Screenshot

!\[Application

