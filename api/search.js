const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { q = 'bangladesh' } = req.query;
  
  try {
    const response = await axios.get(`https://www.myinstants.com/en/search/?name=${encodeURIComponent(q)}`, {
      timeout: 10000
    });
    const $ = cheerio.load(response.data);
    
    const results = [];
    $('.instant').slice(0, 10).each((i, el) => {
      const name = $(el).find('.instant-link').text().trim();
      const onclick = $(el).find('button').attr('onclick');
      const audioPath = onclick?.match(/play\('([^']+)'\)/)?.[1];
      
      if (name && audioPath) {
        results.push({
          name: name,
          audio: `https://www.myinstants.com${audioPath}`,
          url: `https://www.myinstants.com${$(el).find('.instant-link').attr('href')}`
        });
      }
    });
    
    res.json({
      success: true,
      query: q,
      count: results.length,
      results: results
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: "Failed to fetch sounds",
      message: error.message
    });
  }
};
