# AI Health Assistant

AI Health Assistant is a full-stack web application designed to help users get a preliminary analysis of their health symptoms using generative AI. Based on the analysis, the application recommends specialized nearby hospitals, leveraging the user's location.

## Features

- **AI-Powered Symptom Analysis**: Users can describe their symptoms in plain text, and the application's backend uses Google's Gemini AI to provide a detailed analysis.
- **File-Based Analysis**: Supports uploading PDF files containing symptoms for analysis.
- **Location-Aware Hospital Search**: Automatically detects the user's location to find and display a list of nearby hospitals.
- **Specialized Hospital Recommendations**: The AI analysis determines the type of hospital or specialist the user should visit, and the application searches for those specific types of facilities.
- **Multi-Step User Interface**: A clean, intuitive, and multi-step UI that guides the user through the process, from providing their location to receiving hospital recommendations.
- **Responsive Design**: The frontend is designed to be used on various devices.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Google Gemini
- **Maps & Geocoding**: Google Maps API
- **File Handling**: `multer` for file uploads and `pdf-parse` for parsing PDF files.
- **Database**: None (the application is stateless)

### Frontend

- **Library**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed
- Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Backend Setup:**
    -   Navigate to the backend directory:
        ```sh
        cd ai-health-assistant-backend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Create a `.env` file in the `ai-health-assistant-backend` directory and add the following environment variables. You will need to obtain your own API keys from Google.
        ```env
        # Server Port
        PORT=5000

        # Google Maps API Key
        gmaps_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

        # Gemini API Keys (you can add up to 20)
        gemini_API_KEY_1="YOUR_GEMINI_API_KEY"
        gemini_API_KEY_2="ANOTHER_GEMINI_API_KEY"
        # ...
        ```
    -   Start the backend server:
        ```sh
        npm start
        ```
    The backend will be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    -   In a new terminal, navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Start the frontend development server:
        ```sh
        npm run dev
        ```
    The frontend will be running on `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

The backend provides the following RESTful API endpoints:

-   `GET /health`: A health check endpoint to verify that the server is running.
-   `POST /analyze`: Analyzes symptoms provided as a JSON object in the request body.
    -   Body: `{ "symptoms": "user's symptoms here" }`
-   `POST /analyze-file`: Analyzes symptoms from an uploaded PDF file.
    -   Form Data: `file` (the PDF file)
-   `POST /get-address`: Converts geographic coordinates into a human-readable address.
    -   Body: `{ "lat": latitude, "lng": longitude }`
-   `POST /nearby-hospitals`: Finds nearby hospitals based on location, a hospital type, and a search radius.
    -   Body: `{ "lat": latitude, "lng": longitude, "hospitalType": "e.g., 'Cardiologist'", "radius": 5000 }`

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `ai-health-assistant-backend` directory:

-   `PORT`: The port on which the backend server will run.
-   `gmaps_API_KEY`: Your Google Maps API key for location services.
-   `gemini_API_KEY_1`, `gemini_API_KEY_2`, ...: Your API keys for Google Gemini. The application uses a round-robin approach to cycle through the provided keys.

## Usage

The application provides a guided, four-step process for the user:

1.  **Get Location**: The user is prompted to share their browser's location. This is essential for finding nearby hospitals.
2.  **Describe Symptoms**: The user enters their health symptoms into a text area.
3.  **AI Analysis Results**: The application sends the symptoms to the backend, which uses the Gemini AI to generate an analysis. This analysis includes a summary of the potential condition, advice, and a recommended type of hospital to visit.
4.  **Find Nearby Hospitals**: Based on the AI's recommendation and the user's location, the application automatically searches for and displays a list of relevant hospitals in the vicinity. The user can adjust the search radius if needed.
