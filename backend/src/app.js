const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(multer({ dest: 'uploads/' }).single('image'));

// Routes
app.use('/api/analyze', analyzeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});