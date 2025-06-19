const express = require('express');
const multer = require('multer');
const { compressImage } = require('../utils/imageCompressor');
const axios = require('axios');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('watchImage'), async (req, res) => {
    try {
        const compressedImage = await compressImage(req.file.path);
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Analyze this wristwatch image: ${compressedImage}` }]
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error analyzing the image');
    }
});

module.exports = router;