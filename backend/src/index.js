require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    console.log('Received image upload request');
    
    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes, type: ${req.file.mimetype}`);

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    console.log('Image converted to base64');

    // Verify API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not set in environment variables');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    console.log('Calling OpenAI API...');
    
    const guessAgain = req.body?.guessAgain === 'true' || req.query?.guessAgain === 'true' || req.body?.guessAgain === true;
    console.log('Guess again flag:', guessAgain);
    
    const basePrompt = `What is the reference number of this watch?\n\nFor your answer, use the following format:\n1. Reference Number: (Your best, most specific guess. If not certain, state the most likely reference number and explain your reasoning. Do NOT answer 'Not identifiable' or say you cannot identify the watch unless the image is truly blank or contains absolutely no watch-like features. If you are unsure, make your best expert guess based on any visible features, brand, or style, and explain your reasoning.)\n2. Brand and Model: (Be as specific as possible.)\n3. Summary: (Describe the watch, including all visible features and why you think it matches your guess.)\n4. Other Details: (Case size, year, movement, material, dial color, special features, etc.)\n5. Reasoning: (Explain in detail how you arrived at your guess, referencing specific features in the image.)\n\nNever use fallback phrases like 'I'm sorry, but I can't identify...' or 'Not identifiable' unless there is absolutely no possible guess. Always make your best expert guess, even if uncertain.\n\nAlways use the exact same answer format as above for every guess, including Guess Again.`;

    let promptToUse = basePrompt;
    const userInfo = req.body?.userInfo;
    if (guessAgain) {
      let previousGuesses = [];
      if (req.body?.previousGuesses) {
        try {
          previousGuesses = JSON.parse(req.body.previousGuesses);
        } catch (e) {
          previousGuesses = [];
        }
      }
      let userInfoText = '';
      if (userInfo && userInfo.trim().length > 0) {
        userInfoText = `\n\nAdditional user-provided information about the watch: ${userInfo.trim()}\nTake this into account for your new guess.`;
      }
      if (previousGuesses.length > 0) {
        const previousText = previousGuesses.map((g, i) => `${i + 1}. ${g}`).join('\n');
        promptToUse = basePrompt + `\n\nPrevious guesses (not correct):\n${previousText}${userInfoText}\n\nPlease provide a new, different guess for the reference number, brand, and model, using a different approach or hypothesis. Do not repeat any previous guesses. Explain your new reasoning in detail, referencing features in the image that led you to this alternative guess.`;
      } else {
        promptToUse = basePrompt + `${userInfoText}\n\nIf you have already provided an answer, try to provide a different guess for the reference number and other details, if possible. Do not repeat your previous answer.`;
      }
    }

    // Log prompt, model, and image data for debugging
    console.log('--- OpenAI API Request Debug ---');
    console.log('Model:', 'gpt-4o');
    console.log('Prompt:', promptToUse);
    console.log('Image data (first 100 chars):', dataUrl.slice(0, 100));
    console.log('API Params:', { max_tokens: 500 });
    console.log('-------------------------------');

    // Call OpenAI API with gpt-4o model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptToUse
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    console.log('Received response from OpenAI API');
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    res.json({
      result: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Detailed error information:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.status,
      code: error.code
    });

    // Send more detailed error response
    res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message,
      errorType: error.name,
      errorCode: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    port: port
  });
});