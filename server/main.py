# server/main.py
# --- Standard Imports ---
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
import os
from typing import List
# --- Third-party Library Imports ---
from openai import OpenAI
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
import time

# --- Load Environment Variables ---
load_dotenv()

# --- Rate Limiter Setup ---
limiter = Limiter(key_func=get_remote_address)

# --- Initialize FastAPI App ---
app = FastAPI()

# --- Custom Rate Limit Handler ---
def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded errors that provides user-friendly messages
    """
    # Determine which endpoint was hit based on the path
    if "/generate-summary" in str(request.url.path):
        message = "You can only generate 5 summaries per hour due to rate-limiting. Please wait 1 hour before trying again."
        retry_after = 3600  # 1 hour in seconds
    elif "/share-summary" in str(request.url.path):
        message = "You can only send 5 emails per minute due to rate-limiting. Please wait a minute before trying again."
        retry_after = 60  # 1 minute in seconds
    else:
        message = "Too many requests. Please wait before trying again."
        retry_after = 60
    
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limit_exceeded",
            "message": message,
            "retry_after": retry_after
        },
        headers={
            "Retry-After": str(retry_after)
        }
    )

# --- Apply Rate Limiter to the App ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# --- OpenAI Client Initialization ---
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception as e:
    print(f"Error initializing OpenAI client: {e}")

# --- CORS (Cross-Origin Resource Sharing) Middleware ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    # "https://your-deployed-frontend.vercel.app", # Example
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Retry-After"]
)

# --- Pydantic Data Validation Models ---
class SummaryRequest(BaseModel):
    transcript: str
    prompt: str

class SummaryResponse(BaseModel):
    summary: str

class ShareRequest(BaseModel):
    subject: str  # <-- ADD THIS LINE
    summary: str
    recipients: List[EmailStr]

# --- Email Configuration ---
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True").lower() in ("true", "1", "t"),
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False").lower() in ("true", "1", "t"),
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

# ======================
# --- API ENDPOINTS ---
# ======================

@app.post("/api/generate-summary", response_model=SummaryResponse)
@limiter.limit("5/hour")
async def generate_summary(request: Request, summary_request: SummaryRequest):
    try:
        # Validate input
        if not summary_request.transcript.strip():
            raise HTTPException(status_code=400, detail="Transcript cannot be empty.")
        
        if not summary_request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
        
        messages = [
            {"role": "system", "content": "You are an expert assistant specialized in summarizing text based on user instructions."},
            {"role": "user", "content": f"Please follow this instruction: '{summary_request.prompt}'. Here is the text you need to work on: \n\n{summary_request.transcript}"}
        ]
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=messages, 
            temperature=0.7
        )
        
        summary_content = response.choices[0].message.content
        
        if summary_content is None:
            raise HTTPException(status_code=500, detail="AI model returned an empty response. Please try again.")
        
        return SummaryResponse(summary=summary_content)
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"An error occurred during summary generation: {e}")
        
        # Provide more specific error messages based on the error type
        if "API key" in error_msg.lower():
            detail = "OpenAI API configuration error. Please contact support."
        elif "rate limit" in error_msg.lower():
            detail = "OpenAI API rate limit exceeded. Please try again later."
        elif "timeout" in error_msg.lower():
            detail = "Request timed out. Please try again with a shorter text."
        elif "connection" in error_msg.lower():
            detail = "Unable to connect to AI service. Please try again later."
        else:
            detail = "An unexpected error occurred while generating the summary. Please try again."
            
        raise HTTPException(status_code=500, detail=detail)

@app.post("/api/share-summary")
@limiter.limit("5/minute")
async def share_summary(request: Request, share_request: ShareRequest):
    try:
        # Validate input
        if not share_request.summary.strip():
            raise HTTPException(status_code=400, detail="Summary cannot be empty.")
        
        if not share_request.recipients:
            raise HTTPException(status_code=400, detail="At least one recipient email is required.")
        
        message = MessageSchema(
            subject=share_request.subject,  # <-- UPDATE THIS LINE
            recipients=share_request.recipients,
            body=share_request.summary,
            subtype="plain"
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)
        return {"status": "success", "message": "Email has been sent successfully."}
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Failed to send email: {e}")
        
        # Provide more specific error messages based on the error type
        if "authentication" in error_msg.lower() or "login" in error_msg.lower():
            detail = "Email authentication failed. Please contact support."
        elif "invalid" in error_msg.lower() and "email" in error_msg.lower():
            detail = "One or more email addresses are invalid. Please check and try again."
        elif "smtp" in error_msg.lower() or "connection" in error_msg.lower():
            detail = "Unable to connect to email server. Please try again later."
        elif "quota" in error_msg.lower() or "limit" in error_msg.lower():
            detail = "Email sending quota exceeded. Please try again later."
        else:
            detail = "Failed to send email. Please check email addresses and try again."
            
        raise HTTPException(status_code=500, detail=detail)