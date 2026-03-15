import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Use Gemini API
GEMINI_API_KEY = ""
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

app = FastAPI(title="PERU Travel Chatbot API")

# ✅ Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.get("/status")
def status():
    return {"status": "PERU backend running ✅"}

@app.post("/chat")
def chat(req: ChatRequest):
    user_question = req.question.strip()

    if not user_question:
        return {"answer": "Please ask a travel-related question."}

    system_prompt = (
        "You are PERU, a travel assistant chatbot.\n"
        "ONLY answer travel-related questions like trip plans, itinerary, places, hotels, budget, transport, food, visa, weather, safety, travel news.\n"
        "If user asks non-travel questions, reply: 'Sorry, I only answer travel-related questions.'\n"
        "Keep answers short and helpful.\n"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt + "\n\nUser: " + user_question}
                ]
            }
        ]
    }

    try:
        r = requests.post(GEMINI_URL, json=payload, timeout=20)

        # ✅ If Gemini returns error, show full response
        if r.status_code != 200:
            return {
                "answer": "❌ Gemini API Error",
                "status_code": r.status_code,
                "details": r.text
            }

        data = r.json()
        
        # Check if response has the expected structure
        if "candidates" not in data or not data["candidates"]:
            return {"answer": "❌ Empty response from Gemini API", "details": str(data)}
        
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"answer": answer}

    except Exception as e:
        return {"answer": "❌ Error contacting Gemini API", "error": str(e)}

# ✅ Serve frontend files (after routes to avoid conflicts)
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "../frontend"), html=True), name="frontend")
