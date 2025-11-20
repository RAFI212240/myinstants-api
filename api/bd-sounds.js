module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const popularSounds = [
    {
      id: 1,
      name: "Amar Sonar Bangla",
      audio: "https://www.myinstants.com/media/sounds/amar-sonar-bangla-instrumental.mp3",
      type: "national_anthem"
    },
    {
      id: 2,
      name: "Dhaka Police Siren", 
      audio: "https://www.myinstants.com/media/sounds/police-siren-bangladesh.mp3",
      type: "siren"
    },
    {
      id: 3,
      name: "Rickshaw Horn",
      audio: "https://www.myinstants.com/media/sounds/rickshaw-horn-bd.mp3",
      type: "vehicle"
    },
    {
      id: 4,
      name: "Bangladeshi Wedding DJ",
      audio: "https://www.myinstants.com/media/sounds/bangladeshi-wedding-dhol.mp3",
      type: "celebration"
    },
    {
      id: 5,
      name: "Vuter Gaan",
      audio: "https://www.myinstants.com/media/sounds/vuter-gaan-traditional.mp3",
      type: "folk"
    },
    {
      id: 6, 
      name: "Tiger Growl",
      audio: "https://www.myinstants.com/media/sounds/bengal-tiger.mp3",
      type: "animal"
    },
    {
      id: 7,
      name: "Cricket Cheer",
      audio: "https://www.myinstants.com/media/sounds/bangladesh-cricket-crowd.mp3",
      type: "sports"
    }
  ];
  
  res.json({
    success: true,
    country: "Bangladesh",
    count: popularSounds.length,
    sounds: popularSounds
  });
};
