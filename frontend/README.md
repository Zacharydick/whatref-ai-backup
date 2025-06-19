# Wristwatch Analyzer App

This project is a web-based application that allows users to upload or drag-and-drop a photo of a wristwatch, compress the image, send it to OpenAI’s ChatGPT API for analysis, and display the results clearly to the user.

## Frontend

The frontend is built using React and provides a user-friendly interface for uploading images and displaying results.

### Installation

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

### Running the Application

To start the frontend application, run the following command:
```
npm start
```
This will start the development server and open the application in your default web browser.

### Components

- **ImageUpload**: A component that allows users to upload or drag-and-drop an image of a wristwatch.
- **ResultDisplay**: A component that displays the analysis results returned from the OpenAI API.

### Usage

1. Upload or drag-and-drop a wristwatch image.
2. The image will be compressed and sent to the backend for analysis.
3. The results will be displayed on the screen, including the likely reference number for the wristwatch.

## Backend

The backend is built using Node.js and Express, handling image uploads and communication with the OpenAI API.

### Installation

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

### Running the Server

To start the backend server, run the following command:
```
node src/app.js
```

### API Endpoints

- **POST /analyze**: Endpoint for analyzing the uploaded wristwatch image.

### Image Compression

The application includes functionality to compress images before sending them to the OpenAI API to ensure efficient processing.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.

## License

This project is licensed under the MIT License.