import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
  Collapse,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  AccountBalance as PayPalIcon,
  Phone as VenmoIcon,
  AttachMoney as CashAppIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  CurrencyBitcoin as BitcoinIcon
} from '@mui/icons-material';
import { tipsConfig } from '../config/tipsConfig';

const TipsSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleBitcoinClick = (e) => {
    e.preventDefault();
    handleCopyToClipboard(tipsConfig.bitcoin, 'Bitcoin address');
  };

  const paymentOptions = [
    {
      name: 'Venmo',
      icon: <VenmoIcon />,
      url: tipsConfig.venmo,
      color: '#3d95ce',
      hoverColor: '#2d7bb8',
      label: 'Venmo'
    },
    {
      name: 'PayPal',
      icon: <PayPalIcon />,
      url: tipsConfig.paypal,
      color: '#0070ba',
      hoverColor: '#005ea6',
      label: 'PayPal'
    }
  ];

  // Add optional payment methods if they exist in config
  if (tipsConfig.cashapp) {
    paymentOptions.push({
      name: 'Cash App',
      icon: <CashAppIcon />,
      url: tipsConfig.cashapp,
      color: '#00d632',
      hoverColor: '#00b82a',
      label: 'Cash App'
    });
  }

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mt: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(25, 118, 210, 0.1)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(156, 39, 176, 0.1)',
          zIndex: 0
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 2 }}>
          <FavoriteIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Enjoying WhatRef.ai?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Help keep this service free and support continued development!
          </Typography>
        </Box>

        {copySuccess && (
          <Alert severity="success" sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
            {copySuccess}
          </Alert>
        )}

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          {paymentOptions.map((option) => (
            <Grid item key={option.name}>
              <a
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Chip
                  icon={option.icon}
                  label={option.label}
                  clickable
                  sx={{ 
                    bgcolor: option.color, 
                    color: 'white',
                    '&:hover': { bgcolor: option.hoverColor },
                    fontSize: '0.9rem',
                    py: 2,
                    px: 1,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              </a>
            </Grid>
          ))}
          
          {/* Custom Bitcoin button */}
          <Grid item>
            <Chip
              icon={<BitcoinIcon />}
              label="Bitcoin"
              clickable
              onClick={handleBitcoinClick}
              sx={{ 
                bgcolor: '#f7931a', 
                color: 'white',
                '&:hover': { bgcolor: '#e8830f' },
                fontSize: '0.9rem',
                py: 2,
                px: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          </Grid>
        </Grid>

        {/* Expandable section for crypto and additional options */}
        {(tipsConfig.ethereum) && (
          <>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mb: 2 }}
            >
              More Crypto Options
            </Button>

            <Collapse in={expanded}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Additional Cryptocurrency
              </Typography>
              
              {tipsConfig.ethereum && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Ethereum (ETH)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        bgcolor: 'background.paper', 
                        p: 1, 
                        borderRadius: 1,
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {tipsConfig.ethereum}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopyToClipboard(tipsConfig.ethereum, 'Ethereum')}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
              )}
            </Collapse>
          </>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          {tipsConfig.message}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Tips are voluntary and help cover AI API costs and development time ⚡
        </Typography>
      </Box>
    </Paper>
  );
};

export default TipsSection; 