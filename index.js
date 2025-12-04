const express = require('express');
const axios = require('axios');
const app = express();

// আপনার অ্যাপ টোকেন (এটি cover.js থেকে নেওয়া হয়েছে)
// এটি পরিবর্তন হলে আপনি এখানে নতুন টোকেন দিতে পারেন
const ACCESS_TOKEN = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

app.get('/', (req, res) => res.send("FB Cover API is Running (Graph Method)!"));

app.get('/api/cover', async (req, res) => {
    try {
        const fbUrl = req.query.url;

        if (!fbUrl) {
            return res.json({ 
                status: false, 
                message: "Please provide a Facebook profile URL using ?url=" 
            });
        }

        // ১. ইউজারনেম বা আইডি বের করা
        let userID = await getUserID(fbUrl);

        if (!userID) {
             return res.json({ 
                status: false, 
                message: "Could not extract User ID from the URL." 
            });
        }

        // ২. গ্রাফ এপিআই কল করা (কভার ফটো পাওয়ার জন্য)
        const graphUrl = `https://graph.facebook.com/${userID}?fields=cover&access_token=${ACCESS_TOKEN}`;
        
        const response = await axios.get(graphUrl);
        const data = response.data;

        if (data.cover && data.cover.source) {
            res.json({
                status: true,
                author: "RAFI",
                id: data.id,
                cover_photo: data.cover.source
            });
        } else {
            res.json({ 
                status: false, 
                message: "No cover photo found or profile is private." 
            });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            status: false, 
            message: "Failed to fetch cover photo.", 
            error: error.message 
        });
    }
});

// হেল্পার ফাংশন: URL থেকে আইডি বের করা
async function getUserID(url) {
    try {
        // যদি সরাসরি আইডি থাকে (যেমন profile.php?id=100...)
        const idMatch = url.match(/id=(\d+)/);
        if (idMatch) return idMatch[1];

        // যদি ইউজারনেম থাকে (যেমন facebook.com/zuck)
        const usernameMatch = url.match(/facebook\.com\/([a-zA-Z0-9.]+)/);
        if (usernameMatch) {
            const username = usernameMatch[1];
            if (username === 'profile.php') return null;
            
            // ইউজারনেম থেকে আইডিতে কনভার্ট করা (গ্রাফ এপিআই দিয়ে)
            // নোট: অ্যাপ টোকেন দিয়ে অনেক সময় ইউজারনেম টু আইডি কনভারশন কাজ নাও করতে পারে
            // সেক্ষেত্রে আমরা সরাসরি ইউজারনেম ব্যবহার করে দেখবো
            return username; 
        }
        
        return url; // যদি ইনপুটটাই আইডি হয়
    } catch (e) {
        return null;
    }
}

module.exports = app;
        
