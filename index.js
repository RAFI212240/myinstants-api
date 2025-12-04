const express = require('express');
const axios = require('axios');
const app = express();

// আপনার অ্যাপ টোকেন
const ACCESS_TOKEN = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

app.get('/', (req, res) => res.send("FB Cover API (Smart ID) is Running!"));

app.get('/api/cover', async (req, res) => {
    try {
        const fbUrl = req.query.url;
        if (!fbUrl) return res.json({ status: false, message: "Please provide a Facebook profile URL." });

        // ১. স্মার্টলি আইডি বের করা (লিংক বা ইউজারনেম থেকে)
        const userID = await getNumericID(fbUrl);

        if (!userID) {
             return res.json({ 
                status: false, 
                message: "Could not find User ID from this link." 
            });
        }

        // ২. গ্রাফ এপিআই কল করা (সঠিক আইডি দিয়ে)
        const graphUrl = `https://graph.facebook.com/${userID}?fields=name,cover&access_token=${ACCESS_TOKEN}`;
        
        const response = await axios.get(graphUrl);
        const data = response.data;

        if (data.cover && data.cover.source) {
            res.json({
                status: true,
                author: "RAFI",
                id: data.id,
                name: data.name,
                cover_photo: data.cover.source
            });
        } else {
            res.json({ 
                status: false, 
                message: "User found but no cover photo available (Private?)." 
            });
        }

    } catch (error) {
        // এরর লগ দেখা
        const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(errorMsg);
        res.status(500).json({ 
            status: false, 
            message: "Failed to fetch data.", 
            error: errorMsg
        });
    }
});

// 🛠️ হেল্পার ফাংশন: যেকোনো লিংক থেকে নিউমেরিক আইডি বের করা
async function getNumericID(url) {
    try {
        // ১. যদি ইনপুট নিজেই আইডি হয় (শুধু সংখ্যা)
        if (/^\d+$/.test(url)) return url;

        // ২. যদি লিংকে profile.php?id= থাকে
        const idMatch = url.match(/id=(\d+)/);
        if (idMatch) return idMatch[1];

        // ৩. যদি ইউজারনেম থাকে, তবে HTML স্ক্র্যাপ করে আইডি বের করা
        // প্রথমে ইউজারনেম ক্লিন করা
        let cleanUrl = url;
        if (!url.startsWith('http')) cleanUrl = `https://www.facebook.com/${url}`;
        
        const response = await axios.get(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        
        const html = response.data;

        // মেথড ১: al:android:url মেটা ট্যাগ (সবচেয়ে নির্ভরযোগ্য)
        const metaMatch = html.match(/al:android:url" content="fb:\/\/profile\/(\d+)"/);
        if (metaMatch) return metaMatch[1];

        // মেথড ২: entity_id খোঁজা
        const entityMatch = html.match(/"entity_id":"(\d+)"/);
        if (entityMatch) return entityMatch[1];

        // মেথড ৩: userID খোঁজা
        const userMatch = html.match(/"userID":"(\d+)"/);
        if (userMatch) return userMatch[1];

        return null;
    } catch (e) {
        console.error("ID Extraction Failed:", e.message);
        return null;
    }
}

module.exports = app;
            
