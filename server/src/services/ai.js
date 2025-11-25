const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeBrand = async (url, textContent, screenshotBase64) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    You are an expert Brand Strategist and UI/UX Designer.
    Analyze this brand based on the provided website screenshot and text content.
    
    Target URL: ${url}

    Extract the following "Brand DNA" elements into a JSON object:
    1. "brandName": The likely name of the brand.
    2. "tagline": The main slogan or value proposition.
    3. "toneOfVoice": An array of 3-5 adjectives describing the copy's tone (e.g., "Playful", "Corporate", "Technical").
    4. "keywords": An array of 5 SEO/Brand keywords.
    5. "colors": An array of 3-5 hex codes extracted directly from the screenshot (Primary, Secondary, Accents).
    6. "typography": An object with "primary" (headings font style), "secondary" (body font style), and "pairing_reason" (why they work together).
    7. "visualStyle": A detailed paragraph describing the imagery, layout, and aesthetic (e.g., "Minimalist with flat illustrations", "Dark mode with neon gradients").
    8. "personality": An object with "traits" (array of adjectives) and "voice_description" (how they speak to users).

    Return ONLY the JSON object. Do not use markdown code blocks.
    `;

    try {
        const parts = [prompt];

        if (screenshotBase64) {
            parts.push({
                inlineData: {
                    data: screenshotBase64,
                    mimeType: "image/jpeg",
                },
            });
        }

        // If we have text content, we can add it as context, but Vision is often enough.
        // Let's keep text content as a fallback or supplementary data if needed, 
        // but for now, let's rely on the screenshot + prompt for the visual heavy lifting.
        // Actually, passing large text might hit token limits if not careful, but 2.0 Flash has a huge context window.
        if (textContent) {
            parts.push(`\n\nWebsite Text Content:\n${textContent.substring(0, 10000)}`); // Truncate to be safe
        }

        const result = await model.generateContent(parts);
        const responseText = result.response.text();

        // Clean up markdown if present
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('Error analyzing brand with AI:', error.message);
        throw new Error('Failed to analyze brand');
    }
};

const generateContent = async (brandProfile, contentType, platform = 'instagram') => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = '';
    if (contentType === 'captions') {
        prompt = `Generate 3 ${platform} captions for ${brandProfile.brandName}. 
    Tone: ${brandProfile.toneOfVoice}. 
    Keywords: ${brandProfile.keywords.join(', ')}.
    Platform Best Practices:
    - Instagram: Visual, engaging, use emojis and hashtags.
    - LinkedIn: Professional, insightful, industry-focused.
    - Twitter/X: Short, punchy, trending hashtags.
    - Facebook: Conversational, community-focused.
    
    Format:
    **Caption 1:** [Text]
    `;
    } else if (contentType === 'ideas') {
        prompt = `Generate 3 marketing campaign ideas for ${brandProfile.brandName} on ${platform}.
    Tone: ${brandProfile.toneOfVoice}.
    Focus on strategies that work best for ${platform}.`;
    } else if (contentType === 'ads') {
        prompt = `Generate 3 Ad Copy variations (including Flyer concepts) for ${brandProfile.brandName} on ${platform}.
    Tone: ${brandProfile.toneOfVoice}.
    Keywords: ${brandProfile.keywords.join(', ')}.
    
    Format for each variation:
    **Headline:** [Catchy Headline]
    **Body Copy:** [Persuasive text]
    **CTA:** [Call to Action]
    **Visual/Flyer Concept:** [Brief description of the image/layout for the ad/flyer]
    `;
    }

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error.message);
        throw new Error('Failed to generate content');
    }
};

const chatWithImage = async (imageBase64, prompt) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: 'image/jpeg', // Assuming JPEG for now, or extract from base64 header
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        return result.response.text();
    } catch (error) {
        console.error('Error chatting with image:', error.message);
        throw new Error('Failed to chat with image');
    }
};

const generateImage = async (prompt) => {
    // Placeholder for Image Generation
    // In a real app, this would call OpenAI DALL-E or Stable Diffusion API
    // For now, we return a high-quality placeholder image based on keywords
    console.log('Generating image for prompt:', prompt);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return a generated image from Pollinations AI (free, no key required)
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux-pro`;
};

const generateCampaignStrategy = async (brandProfile, targetAudience, goal) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    Act as a Senior Marketing Strategist.
    Create a comprehensive campaign strategy for the following brand:
    
    Brand Name: ${brandProfile.brandName}
    Tagline: ${brandProfile.tagline}
    Tone of Voice: ${brandProfile.toneOfVoice.join(', ')}
    Key Traits: ${brandProfile.personality?.traits?.join(', ') || 'N/A'}
    
    Campaign Goal: ${goal}
    Target Audience: ${targetAudience}

    Generate a JSON object with the following structure:
    {
        "campaignTitle": "Creative Title",
        "concept": "Core creative concept/hook",
        "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3"],
        "channels": [
            {
                "name": "Instagram",
                "strategy": "Visual-heavy focus on...",
                "contentIdeas": ["Idea 1", "Idea 2"]
            },
            {
                "name": "LinkedIn",
                "strategy": "Professional thought leadership...",
                "contentIdeas": ["Idea 1", "Idea 2"]
            }
        ],
        "timeline": "4-week rollout plan summary"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('Error generating campaign strategy:', error.message);
        throw new Error('Failed to generate campaign strategy');
    }
};

const processMultimodalChat = async (prompt, imageBase64, history = []) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `
    You are a creative AI assistant for a Brand Studio. 
    The user may ask you to generate images, edit uploaded images, or just chat/ask questions.
    
    RULES:
    1. If the user wants to GENERATE a new image (e.g., "create a logo", "generate a banner"), reply with: <GENERATE_IMAGE>detailed description of the image</GENERATE_IMAGE>
    2. If the user wants to EDIT an uploaded image (e.g., "make it blue", "add a dog"), reply with: <GENERATE_IMAGE>detailed description of the NEW image based on the uploaded image and the user's change</GENERATE_IMAGE>
    3. If the user asks a QUESTION or wants to CHAT (e.g., "what is this?", "suggest a slogan"), reply normally with text.
    
    Do not output markdown code blocks for the tag. Just the tag.
    `;

    try {
        const parts = [{ text: systemPrompt }];

        // Add History (Simplified for now, just last few turns could be added here if needed)
        // For now, let's stick to single turn + context for simplicity, or append history as text.

        if (imageBase64) {
            parts.push({
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg',
                },
            });
        }

        parts.push({ text: `User: ${prompt}` });

        const result = await model.generateContent(parts);
        const responseText = result.response.text();

        // Check for generation tag
        const genMatch = responseText.match(/<GENERATE_IMAGE>(.*?)<\/GENERATE_IMAGE>/s);

        if (genMatch) {
            const imagePrompt = genMatch[1].trim();
            const imageUrl = await generateImage(imagePrompt);
            return {
                type: 'image',
                content: imageUrl,
                text: "Here is the image you requested:" // Optional accompanying text
            };
        } else {
            return {
                type: 'text',
                content: responseText
            };
        }

    } catch (error) {
        console.error('Error in multimodal chat:', error.message);
        throw new Error('Failed to process chat');
    }
};

module.exports = { analyzeBrand, generateContent, chatWithImage, generateImage, generateCampaignStrategy, processMultimodalChat };
