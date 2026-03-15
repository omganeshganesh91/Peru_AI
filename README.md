# PERU Travel Chatbot

A modern, AI-powered travel assistant chatbot designed to provide personalized travel recommendations, itineraries, and information. Built with a clean web interface and powered by Google's Gemini AI.

## 🌟 Features

- **Intelligent Travel Assistance**: Get personalized travel recommendations and itineraries
- **Real-time Responses**: Powered by Google's Gemini AI for accurate, contextual answers
- **Travel-Focused**: Strictly answers only travel-related questions (plans, destinations, hotels, transport, etc.)
- **Responsive Design**: Clean, mobile-friendly chat interface
- **FastAPI Backend**: Robust and scalable API with CORS support
- **Secure API Handling**: Environment-based API key management

## 🛠 Tech Stack

### Backend

- **Python 3.12**
- **FastAPI** - Modern, fast web framework
- **Google Gemini AI** - Advanced language model for responses
- **Uvicorn** - ASGI server for production deployment

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Responsive styling
- **Vanilla JavaScript** - Client-side functionality
- **Fetch API** - AJAX requests

## 🚀 Installation

### Prerequisites

- Python 3.12 or higher
- Git
- Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd PERU-Chatbot
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Configuration**

   ```bash
   # Create .env file in backend directory
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Run the Application**

   ```bash
   # From backend directory
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Access the Chatbot**
   Open your browser and navigate to: `http://127.0.0.1:8000`

## 📖 Usage

1. **Start Chatting**: Type your travel-related question in the input field
2. **Get Recommendations**: Ask about destinations, itineraries, hotels, flights, etc.
3. **Travel Focus**: The bot only responds to travel-related queries

### Example Queries

- "Plan a 5-day trip to Paris"
- "Best hotels in Tokyo under $200"
- "Weather in Bali this month"
- "Visa requirements for India"

## 🔧 API Endpoints

### GET /status

Check if the backend is running.

**Response:**

```json
{
  "status": "PERU backend running ✅"
}
```

### POST /chat

Send a travel question to the chatbot.

**Request:**

```json
{
  "question": "Plan a weekend trip to New York"
}
```

**Response:**

```json
{
  "answer": "Here's a suggested itinerary for your weekend in New York..."
}
```

## 🏗 Project Structure

```
PERU Chatbot/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── .env             # Environment variables (API key)
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html       # Main chat interface
│   ├── style.css        # Styling
│   └── Script.js        # Client-side logic
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent responses
- FastAPI for the robust backend framework
- Open source community for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:

- Check the terminal for error messages
- Ensure your Gemini API key is valid and has sufficient quota
- Verify all dependencies are installed correctly

---

**Built with ❤️ for travelers worldwide**
