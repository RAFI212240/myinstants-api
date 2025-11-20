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

  try {
    const popularSounds = [
      {
        id: 1,
        name: "Amar Sonar Bangla Instrumental",
        audio: "https://www.myinstants.com/media/sounds/amar-sonar-bangla-instrumental.mp3",
        type: "national_anthem"
      },
      {
        id: 2,
        name: "Police Siren Bangladesh", 
        audio: "https://www.myinstants.com/media/sounds/police-siren-bangladesh.mp3",
        type: "siren"
      },
      {
        id: 3,
        name: "Rickshaw Horn BD",
        audio: "https://www.myinstants.com/media/sounds/rickshaw-horn-bd.mp3",
        type: "vehicle"
      },
      {
        id: 4,
        name: "Bangladeshi Wedding Dhol",
        audio: "https://www.myinstants.com/media/sounds/bangladeshi-wedding-dhol.mp3",
        type: "celebration"
      },
      {
        id: 5,
        name: "Vuter Gaan Traditional",
        audio: "https://www.myinstants.com/media/sounds/vuter-gaan-traditional.mp3",
        type: "folk"
      }
    ];
    
    res.json({
      success: true,
      country: "Bangladesh",
      count: popularSounds.length,
      sounds: popularSounds
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};
