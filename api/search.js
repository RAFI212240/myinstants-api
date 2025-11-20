const axios = require('axios');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q = 'bangladesh' } = req.query;
  
  try {
    // Simple mock data for testing
    const mockResults = [
      {
        name: "Bangladeshi Rickshaw Horn",
        audio: "https://www.myinstants.com/media/sounds/rickshaw-horn-bd.mp3",
        url: "https://www.myinstants.com/instant/bangladeshi-rickshaw-horn/"
      },
      {
        name: "Dhaka Police Siren", 
        audio: "https://www.myinstants.com/media/sounds/police-siren-bangladesh.mp3",
        url: "https://www.myinstants.com/instant/dhaka-police-siren/"
      },
      {
        name: "Bengali Wedding Music",
        audio: "https://www.myinstants.com/media/sounds/bengali-wedding-music.mp3",
        url: "https://www.myinstants.com/instant/bengali-wedding-music/"
      }
    ];
    
    res.json({
      success: true,
      query: q,
      count: mockResults.length,
      results: mockResults
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: "API is working but search temporarily disabled",
      message: error.message
    });
  }
};
