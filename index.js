const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const app = express();

// হোম রুট
app.get('/', (req, res) => res.send("FB Cover Photo API is Running!"));

// API রুট: /api/cover?url=FACEBOOK_PROFILE_LINK
app.get('/api/cover', async (req, res) => {
    try {
        const fbUrl = req.query.url;

        if (!fbUrl) {
            return res.json({ 
                status: false, 
                message: "Please provide a Facebook profile URL using ?url=" 
            });
        }

        // ১. টার্গেট ওয়েবসাইট
        const targetUrl = 'https://www.fbprofileviewer.com/';

        // ২. ফর্ম ডেটা তৈরি করা (ওয়েবসাইটটি যেভাবে চায়)
        const form = new FormData();
        form.append('url', fbUrl); // ইনপুট ফিল্ডের নাম 'url'

        // ৩. ওয়েবসাইটে POST রিকোয়েস্ট পাঠানো
        const response = await axios.post(targetUrl, form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'https://www.fbprofileviewer.com',
                'Referer': 'https://www.fbprofileviewer.com/'
            }
        });

        // ৪. HTML পার্স করা (Cheerio দিয়ে)
        const $ = cheerio.load(response.data);
        
        // ৫. কভার ফটো খুঁজে বের করা
        // ওয়েবসাইটটি রেজাল্ট পেজে কভার ফটোটি 'Cover Photo' টেক্সটের নিচে দেখায়
        // সাধারণত এটি id="result" বা নির্দিষ্ট কোনো div এর মধ্যে থাকে।
        
        let coverPhotoUrl = null;

        // ওয়েবসাইটের স্ট্রাকচার অনুযায়ী কভার ফটো খোঁজা
        // সাধারণত result সেকশনে থাকে এবং 'Download Cover Photo' বাটনের লিংক হতে পারে
        
        // মেথড ১: সরাসরি ইমেজ ট্যাগ খোঁজা
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            // কভার ফটোগুলো সাধারণত scontent বা external link হয় এবং profile pic থেকে আলাদা হয়
            if (src && src.startsWith('http') && !src.includes('logo')) {
                 // এখানে লজিক হলো সাধারণত ২য় বড় ছবিটি কভার ফটো হয়
                 // তবে আমরা আরও স্পেসিফিক হতে পারি যদি ক্লাসনেম জানা থাকে।
                 // এই সাইটে কভার ফটো সাধারণত শেষের দিকে লোড হয়।
                 coverPhotoUrl = src; 
            }
        });

        // মেথড ২ (More Accurate for this site): ডাউনলোড বাটন বা নির্দিষ্ট ক্লাস খোঁজা
        // এই সাইটটি রেজাল্ট দেখানোর সময় একটি div ব্যবহার করে।
        // কভার ফটোটি সাধারণত ২য় ইমেজ হিসেবে থাকে (প্রথমটি প্রোফাইল পিকচার)
        
        // আমরা সব ইমেজ লিংক নিয়ে একটি অ্যারে বানাই
        const images = [];
        $('#result img').each((i, el) => {
            images.push($(el).attr('src'));
        });

        // সাধারণত ২য় ছবিটি কভার ফটো হয় (যদি প্রোফাইল এবং কভার দুটোই থাকে)
        if (images.length >= 2) {
            coverPhotoUrl = images[1]; 
        } else if (images.length === 1) {
            coverPhotoUrl = images[0]; // যদি শুধু একটাই পায়
        }

        if (!coverPhotoUrl) {
            return res.json({ 
                status: false, 
                message: "Cover photo not found or profile is private/invalid." 
            });
        }

        // ৬. সফল রেসপন্স
        res.json({
            status: true,
            author: "RAFI",
            input_url: fbUrl,
            cover_photo: coverPhotoUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: false, 
            message: "Server Error or Scraping Failed", 
            error: error.message 
        });
    }
});

// Vercel এর জন্য এক্সপোর্ট
module.exports = app;
                
