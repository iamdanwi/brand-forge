const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../middleware/auth');
const { analyzeBrand, generateContent } = require('../services/ai');
const { scrapeWebsite } = require('../services/scraper');
const { extractColors } = require('../services/colorExtractor');
const { incrementUsage } = require('../services/userService');

// Public API: Analyze Brand
router.post('/analyze', validateApiKey, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const scrapedData = await scrapeWebsite(url);
        const extractedColors = await extractColors(scrapedData.images);
        const aiAnalysis = await analyzeBrand(scrapedData);

        const result = {
            brandName: aiAnalysis.brandName,
            toneOfVoice: aiAnalysis.toneOfVoice,
            keywords: aiAnalysis.keywords,
            visualStyle: aiAnalysis.visualStyle,
            colors: [...new Set([...extractedColors, ...(aiAnalysis.suggestedColors || [])])],
            typography: aiAnalysis.typography,
            tagline: aiAnalysis.tagline,
            personality: aiAnalysis.personality,
        };

        // Increment usage for analysis
        await incrementUsage(req.userId, 'analysis');

        res.json(result);
    } catch (error) {
        console.error('API Analyze Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Public API: Generate Content
router.post('/generate', validateApiKey, async (req, res) => {
    const { brandProfile, contentType, platform } = req.body;

    if (!brandProfile || !contentType) {
        return res.status(400).json({ message: 'brandProfile and contentType are required' });
    }

    try {
        const content = await generateContent(brandProfile, contentType, platform);

        // Increment usage for content
        await incrementUsage(req.userId, 'content');

        res.json({ content });
    } catch (error) {
        console.error('API Generate Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
