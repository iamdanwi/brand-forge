import { chatWithImage, generateImage, processMultimodalChat } from '../services/ai.js';
import { incrementUsage } from '../services/userService.js';

export const handleUnifiedChat = async (req, res) => {
    const { prompt, image, history } = req.body;
    const { tenantId } = req;

    if (!prompt && !image) {
        return res.status(400).json({ message: 'Prompt or Image is required' });
    }

    try {
        // Strip prefix if present
        let base64Data = null;
        if (image) {
            base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        }

        const result = await processMultimodalChat(prompt, base64Data, history);

        if (tenantId) {
            // Track usage based on result type
            if (result.type === 'image') {
                await incrementUsage(tenantId, 'content');
            } else {
                await incrementUsage(tenantId, 'analysis');
            }
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to process chat' });
    }
};

export const generateNewImage = async (req, res) => {
    const { prompt } = req.body;
    const { tenantId } = req;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const imageUrl = await generateImage(prompt);

        if (tenantId) {
            await incrementUsage(tenantId, 'content'); // Count as content generation
        }

        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate image' });
    }
};

export const chatAboutImage = async (req, res) => {
    const { image, prompt } = req.body; // image is base64 string
    const { tenantId } = req;

    if (!image || !prompt) {
        return res.status(400).json({ message: 'Image and prompt are required' });
    }

    try {
        // Strip prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const response = await chatWithImage(base64Data, prompt);

        if (tenantId) {
            await incrementUsage(tenantId, 'analysis'); // Count as analysis? Or separate? Let's use analysis for now.
        }

        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process image chat' });
    }
};
