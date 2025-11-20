const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// মূল পেজ (Home Route)
app.get('/', (req, res) => {
    res.send("My API is Running on Vercel!");
});

// আপনার মেইন API
app.get('/api/instants', async (req, res) => {
    try {
        const url = 'https://www.myinstants.com/en/index/bd/'; 
        const baseUrl = 'https://www.myinstants.com';

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

        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        
        res.json({
            status: true,
            author: "RAFI",
            result: randomSound
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// ⚠️ গুরত্বপূর্ণ: app.listen কেটে দিন এবং এই লাইনটি লিখুন
module.exports = app;
  
