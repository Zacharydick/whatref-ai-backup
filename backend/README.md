# Wristwatch Analyzer App - Backend

## Overview
The Wristwatch Analyzer App is a web-based application that allows users to upload images of wristwatches for analysis. The backend is built using Node.js and Express, providing an API for image processing and communication with the OpenAI ChatGPT API.

## Features
- Image upload via API
- Image compression to optimize size
- Integration with OpenAI's ChatGPT API for wristwatch analysis
- Clear response display for users

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd wristwatch-analyzer-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the backend server, run:
```
npm start
```
The server will be running on `http://localhost:5000`.

### API Endpoints
- **POST /analyze**: Uploads an image for analysis.
  - Request Body: Form-data containing the image file.
  - Response: Analysis results from the OpenAI API.

## Usage
1. Use a tool like Postman or a frontend application to send a POST request to the `/analyze` endpoint with the wristwatch image.
2. The server will process the image, compress it, and send it to the OpenAI API for analysis.
3. The results will be returned in the response.

## License
This project is licensed under the MIT License. See the LICENSE file for details.