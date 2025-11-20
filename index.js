const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.get('/', (req, res) => res.send("MyInstants API is Running!"));

app.get('/api/instants', async (req, res) => {
    try {
        const query = req.query.query; // সার্চ কুয়েরি নেওয়া
        const baseUrl = 'https://www.myinstants.com';
        let url;

        // যদি কুয়েরি থাকে তবে সার্চ পেজে যাবে, না থাকলে হোমপেজে
        if (query) {
            url = `https://www.myinstants.com/search/?name=${encodeURIComponent(query)}`;
        } else {
            url = 'https://www.myinstants.com/en/index/bd/';
        }

        const { data } = await axios.get(url);
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
            return res.json({ status: false, message: "No sounds found" });
        }

        // সার্চ রেজাল্ট থেকে র্যানডম একটি সাউন্ড পাঠানো
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        
        res.json({
            status: true,
            search_term: query || "random",
            result: randomSound
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = app;
