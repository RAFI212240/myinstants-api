const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/', (req, res) => res.send("MyInstants API is Running!"));

app.get('/api/instants', async (req, res) => {
    try {
        const query = req.query.query;
        const baseUrl = 'https://www.myinstants.com';
        let url;

        if (query) {
            url = `https://www.myinstants.com/search/?name=${encodeURIComponent(query)}`;
        } else {
            url = 'https://www.myinstants.com/en/index/bd/';
        }

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const sounds = [];

        $('.instant').each((index, element) => {
            const name = $(element).find('.instant-link').text().trim();
            const button = $(element).find('.small-button');
            const onclickAttr = button.attr('onmousedown') || button.attr('onclick');
            
            if (onclickAttr) {
                const match = onclickAttr.match(/play\('(.+?)'\)/);
                if (match && match[1]) {
                    sounds.push({
                        title: name,
                        url: baseUrl + match[1]
                    });
                }
            }
        });

        if (sounds.length === 0) {
            return res.json({ status: false, message: "No sounds found for your query." });
        }

        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        
        res.json({
            status: true,
            search_term: query || "random (homepage)",
            total_results: sounds.length,
            random_result: randomSound,
            results: sounds
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = app;
            
