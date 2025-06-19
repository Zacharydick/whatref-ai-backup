# WhatRef.ai

A web application that uses AI to analyze wristwatch images and identify their reference numbers.

## Features

- Upload or drag-and-drop wristwatch images
- Automatic image compression
- AI-powered watch reference number identification using GPT-4o
- "Guess Again" functionality for alternative identifications
- Clean, responsive user interface with Material-UI
- Secure API key handling
- Loading states and error handling
- Upload history tracking with thumbnails
- Markdown-formatted AI responses
- **Professional tips section** with multiple payment options (PayPal, Venmo, Bitcoin, etc.)

## Tech Stack

- **Frontend:** React.js, Material-UI, React Dropzone, Axios
- **Backend:** Node.js with Express, Multer, OpenAI API
- **AI:** OpenAI GPT-4o Vision API
- **Image Processing:** Browser-based compression
- **Storage:** Local Storage for history

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key (sk-proj- format)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm start
   ```

## Usage

1. Open the application in your browser (http://localhost:3000)
2. Upload a wristwatch image by clicking the upload area or dragging and dropping
3. Wait for the AI analysis (powered by GPT-4o)
4. View the detailed results including reference number, case size, year, etc.
5. Use "Guess Again" for alternative identifications
6. Previous analyses are saved with thumbnails in your browser's local storage

## Tips Configuration

To set up the tips section with your payment information:

1. **Edit the configuration file:** `frontend/src/config/tipsConfig.js`
2. **Update with your payment links:**
   ```javascript
   export const tipsConfig = {
     paypal: "https://paypal.me/YOUR_USERNAME",
     venmo: "https://venmo.com/u/YOUR_USERNAME",
     bitcoin: "0xYOUR_BITCOIN_ADDRESS_HERE",
     // Optional: cashapp, ethereum, etc.
   };
   ```
3. **See detailed setup guide:** [TIPS_SETUP.md](TIPS_SETUP.md)

## Deployment

To make your WhatRef.ai application publicly accessible, see the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) guide.

### Quick Deployment Steps:

1. **Prepare for deployment:**
   ```bash
   ./deploy.sh  # Run the deployment preparation script
   ```

2. **Deploy Backend to Railway:**
   - Sign up at [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set environment variables (OPENAI_API_KEY, etc.)

3. **Deploy Frontend to Vercel:**
   - Sign up at [Vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set REACT_APP_API_URL to your Railway backend URL

**Cost:** ~$5-20/month depending on usage (free tiers available)

## Fine-Tuning (Advanced)

For improved accuracy (80-95% vs 30-50%), see the fine-tuning toolkit in `backend/fine-tuning/`:
- Dataset preparation scripts
- Training job management
- Cost analysis and implementation guide

## Security

- API keys are stored securely on the backend
- Image data is compressed before transmission
- CORS protection configured for production
- All API calls are made through the backend to protect sensitive information
- Environment variables used for configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT