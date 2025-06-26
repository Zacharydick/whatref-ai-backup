import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Card,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TipsSection from './components/TipsSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('watchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [guessAgainLoading, setGuessAgainLoading] = useState(false);
  const [guessAttempts, setGuessAttempts] = useState(0);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileCollapsed, setMobileCollapsed] = useState(true);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setGuessAttempts(0); // Reset guess attempts when a new image is uploaded
    setPreviousGuesses([]); // Reset previous guesses for new image
    setUserInfo(''); // Reset user info for new image
    try {
      setLoading(true);
      
      const file = acceptedFiles[0];
      
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', compressedFile, file.name);

      console.log('Sending request to:', `${API_URL}/analyze`);

      // Send to backend
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      if (!response.data || !response.data.result) {
        throw new Error('Invalid response from server');
      }

      // Convert compressed file to base64
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });

      const newResult = {
        ...response.data,
        image: base64data,
        file: compressedFile
      };

      setResult(newResult);
      setError(null);
      
      // Only add to history if the result is a successful analysis (not a non-watch/unclear message)
      const failureKeywords = [
        'sorry',
        'unable',
        "can't view",
        'cannot view',
        'issue with the image upload',
        'describe the watch',
        'not identifiable',
        'unclear',
        'not a watch',
        'not a wristwatch',
        'no watch detected',
        'no wristwatch detected',
        'no watch in the image',
        'no wristwatch in the image',
        'not recognized',
        'not recognized as a watch',
        'not recognized as a wristwatch',
        'not enough information',
        'not enough detail',
        'not able to determine',
        'not able to analyze',
        'could not identify',
        'cannot identify',
        "couldn't identify"
      ];
      const resultText = newResult.result.toLowerCase();
      const isFailure = failureKeywords.some(keyword => resultText.includes(keyword));
      if (!isFailure) {
        const newHistory = [newResult, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('watchHistory', JSON.stringify(newHistory));
        setResult(newResult);
      } else {
        setResult({ ...newResult, result: "Sorry, the image you uploaded does not appear to be a wristwatch or is too unclear to identify. Please try again with a clearer photo of a single wristwatch on a plain background." });
        console.log('Filtered fallback result:', newResult.result);
      }

    } catch (err) {
      console.error('Analysis error:', err);
      let errorMessage = 'Failed to analyze image';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response && err.response.data && typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else if (!err.response) {
        errorMessage = 'Network error. Please check if the backend server is running.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleGuessAgain = async () => {
    if (!result || !result.file) return;
    if (guessAttempts >= 3) {
      setError("You've reached the maximum number of guesses for this image. Please try uploading a different photo of the watch for better results.");
      return;
    }
    setGuessAgainLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      const file = new File([result.file], 'watch.jpg', { type: 'image/jpeg' });
      formData.append('image', file);
      formData.append('guessAgain', 'true');
      formData.append('previousGuesses', JSON.stringify(previousGuesses));
      if (userInfo && userInfo.trim().length > 0) {
        formData.append('userInfo', userInfo);
      }
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newResult = {
        ...response.data,
        image: result.image,
        file: file,
        timestamp: new Date().toISOString()
      };
      setResult(newResult);
      setGuessAttempts(prev => prev + 1);
      setPreviousGuesses(prev => [...prev, result.result]);
      // Only add to history if the result is a successful analysis (not a fallback/failure message)
      const failureKeywords = [
        'sorry',
        'unable',
        "can't view",
        'cannot view',
        'issue with the image upload',
        'describe the watch',
        'not identifiable',
        'unclear',
        'not a watch',
        'not a wristwatch',
        'no watch detected',
        'no wristwatch detected',
        'no watch in the image',
        'no wristwatch in the image',
        'not recognized',
        'not recognized as a watch',
        'not recognized as a wristwatch',
        'not enough information',
        'not enough detail',
        'not able to determine',
        'not able to analyze',
        'could not identify',
        'cannot identify',
        "couldn't identify"
      ];
      const resultText = newResult.result.toLowerCase();
      const isFailure = failureKeywords.some(keyword => resultText.includes(keyword));
      if (!isFailure) {
        setHistory([newResult, ...history]);
      }
    } catch (err) {
      console.error('Guess again error:', err);
      setError('Failed to guess again: ' + (err.response?.data?.error || err.message));
    } finally {
      setGuessAgainLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{
      width: '100vw',
      maxWidth: '1600px',
      px: { xs: 0.5, sm: 8, md: 12 },
      mx: 'auto'
    }}>
      <Box sx={{
        my: { xs: 2, sm: 4 },
        mx: 'auto',
        maxWidth: { xs: '100vw', sm: '98vw', md: 1500 },
        width: '100%'
      }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
          WhatRef.ai
        </Typography>
        
        <Paper
          {...getRootProps()}
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            mb: { xs: 2, sm: 4 },
            borderRadius: { xs: 2, sm: 3 },
            minHeight: { xs: 120, sm: 160 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <input {...getInputProps()} />
          <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            {isDragActive
              ? "Drop the image here"
              : isMobile
                ? "Tap to upload a wristwatch image here"
                : "Drag and drop a wristwatch image here, or click to select"}
          </Typography>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={40} />
            <Typography sx={{ mt: 2, fontSize: { xs: '1.1rem', sm: '1.2rem' }, color: 'primary.main', fontWeight: 500 }}>
              AI Watchmaker at work...
            </Typography>
          </Box>
        )}

        {error && !result && (
          <Typography color="error" align="center" sx={{ my: 2, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            {error}
          </Typography>
        )}

        {result && (
          <Paper sx={{
            p: { xs: 3, sm: 6 },
            mb: 4,
            maxWidth: { xs: '100vw', sm: '100%', md: '100%' },
            mx: 'auto',
            width: '100%'
          }}>
            <ListItem alignItems="flex-start" sx={{ py: { xs: 2, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-start' } }}>
              <ListItemAvatar sx={{ minWidth: 0, mb: { xs: 3, sm: 0 } }}>
                <Box
                  component="img"
                  src={result.image}
                  alt="Watch thumbnail"
                  sx={{
                    width: { xs: 200, sm: 320, md: 400 },
                    height: { xs: 200, sm: 320, md: 400 },
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 2
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ mb: 2 }}>
                    <ReactMarkdown
                      components={{
                        strong: ({node, ...props}) => <span style={{fontWeight: 700}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginBottom: 12, fontSize: '1.25rem'}} {...props} />,
                        p: ({node, ...props}) => <p style={{marginBottom: 12, fontSize: '1.25rem'}} {...props} />,
                      }}
                    >
                      {(result.result || '')
                        .replace(/Reference Number:/g, '**Reference Number:**')
                        .replace(/Summary:/g, '**Summary:**')
                        .replace(/Other Details:/g, '**Other Details:**')
                        .replace(/Brand and Model:/g, '**Brand and Model:**')
                        .replace(/Reasoning:/g, '**Reasoning:**')}
                    </ReactMarkdown>
                  </Box>
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }}
                  >
                    {new Date(result.timestamp).toLocaleString()}
                  </Typography>
                }
                sx={{ ml: { xs: 0, sm: 3 }, width: '100%' }}
              />
            </ListItem>
            {/* User info text field and Guess Again button */}
            <Box sx={{ mt: 3, width: '100%' }}>
              <label htmlFor="user-info-field">
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
                  Wrong guess? Add more info about your watch and click guess again below
                </Typography>
              </label>
              <textarea
                id="user-info-field"
                value={userInfo}
                onChange={e => setUserInfo(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: 14, borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '1.15rem', marginTop: 8, background: '#fafbfc', resize: 'vertical' }}
                placeholder="e.g. Brand, model, year, caseback engravings, or anything else you know"
              />
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80, mt: 2 }}>
                {guessAttempts < 3 ? (
                  <Button
                    variant="outlined"
                    onClick={handleGuessAgain}
                    disabled={guessAgainLoading}
                    sx={{
                      mb: 2,
                      mt: 1,
                      width: { xs: '100%', sm: 'auto' },
                      fontSize: { xs: '1.15rem', sm: '1.25rem' },
                      py: 1.5,
                      px: 5,
                      maxWidth: 400,
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {guessAgainLoading ? 'Analyzing Again...' : `Guess Again (${3 - guessAttempts} left)`}
                  </Button>
                ) : (
                  <Typography color="error" align="center" sx={{ my: 2, fontWeight: 500, fontSize: { xs: '1.15rem', sm: '1.25rem' } }}>
                    You've reached the maximum number of guesses for this image.<br />
                    Please try uploading a new photo of your watch for better results.
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        )}

        {history.length > 0 && (
          <Paper sx={{ p: { xs: 1.5, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Recent Analyses
            </Typography>
            {isMobile && mobileCollapsed ? null : (
              <List>
                {history.slice(0, isMobile ? 3 : (showAllHistory ? history.length : 3)).map((item, index) => (
                  <React.Fragment key={item.timestamp}>
                    <ListItem alignItems="flex-start" sx={{ py: { xs: 1, sm: 2 } }}>
                      <ListItemAvatar sx={{ minWidth: 80 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt="Watch thumbnail"
                          sx={{
                            width: { xs: 70, sm: 100 },
                            height: { xs: 70, sm: 100 },
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: 1
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ mb: 1 }}>
                            <ReactMarkdown>{item.result}</ReactMarkdown>
                          </Box>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
                          >
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
                        }
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                    {index < (isMobile ? 3 : (showAllHistory ? history.length : 3)) - 1 && <Divider variant="fullWidth" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
            {history.length > 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {isMobile ? (
                  <Button
                    variant="outlined"
                    onClick={() => setMobileCollapsed(!mobileCollapsed)}
                    sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '1rem', sm: '1.1rem' }, py: 1 }}
                  >
                    {mobileCollapsed ? 'Show More' : 'Show Less'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '1rem', sm: '1.1rem' }, py: 1 }}
                  >
                    {showAllHistory ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        )}

        {/* Tips Section */}
        <TipsSection />
      </Box>
    </Container>
  );
}

export default App;