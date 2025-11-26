import BrandProfile from '../models/BrandProfile.js';
import { analyzeBrand, generateContent } from '../services/ai.js';
import { incrementUsage, getUserUsage } from '../services/userService.js';
import puppeteer from 'puppeteer';
import Tenant from '../models/Tenant.js';

export const analyzeUrl = async (req, res) => {
    const { url } = req.body;
    const { tenantId } = req; // From middleware

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some environments
        });
        const page = await browser.newPage();

        // Set viewport to desktop size for better screenshot
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Get Text Content (for tone analysis)
        const textContent = await page.evaluate(() => document.body.innerText);

        // Get Screenshot (for visual analysis)
        const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 80, fullPage: false });
        const screenshotBase64 = screenshotBuffer.toString('base64');

        await browser.close();

        // Analyze with AI (Multimodal)
        const aiAnalysis = await analyzeBrand(url, textContent, screenshotBase64);

        // Merge Data
        const brandProfileData = {
            url,
            tenantId,
            userId: tenantId, // Populate userId with tenantId for schema validation
            brandName: aiAnalysis.brandName,
            toneOfVoice: Array.isArray(aiAnalysis.toneOfVoice) ? aiAnalysis.toneOfVoice : [aiAnalysis.toneOfVoice],
            keywords: aiAnalysis.keywords,
            visualStyle: aiAnalysis.visualStyle,
            colors: aiAnalysis.colors || [],
            fonts: [], // Placeholder
            // Pro Fields
            typography: aiAnalysis.typography,
            tagline: aiAnalysis.tagline,
            personality: aiAnalysis.personality,
        };

        // Save to DB
        const brandProfile = await BrandProfile.create(brandProfileData);

        // Increment Usage
        if (tenantId) {
            await incrementUsage(tenantId, 'analysis');
        }

        res.status(201).json(brandProfile);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        res.status(500).json({ message: 'Failed to analyze URL', error: error.message });
    }
};

export const getBrandProfile = async (req, res) => {
    try {
        const profile = await BrandProfile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Brand profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUserBrands = async (req, res) => {
    const { tenantId } = req; // From middleware
    try {
        const brands = await BrandProfile.find({ tenantId }).sort({ createdAt: -1 });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const generateBrandContent = async (req, res) => {
    const { id } = req.params;
    const { contentType, platform } = req.body; // 'captions', 'ideas'
    const { tenantId } = req;

    try {
        const profile = await BrandProfile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Brand profile not found' });
        }

        const content = await generateContent(profile, contentType, platform);

        // Increment Usage
        if (tenantId) {
            await incrementUsage(tenantId, 'content');
        }

        res.json({ content });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getUsage = async (req, res) => {
    const { tenantId } = req;
    try {
        const usage = await getUserUsage(tenantId);
        // Also fetch plan to show limits
        let tenant = await Tenant.findOne({ tenantId });
        if (!tenant) tenant = { plan: 'free' };

        res.json({ usage, plan: tenant.plan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
