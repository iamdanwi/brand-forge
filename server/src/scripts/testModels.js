require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const run = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching models from API...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("No models found or unexpected response:", data);
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
};

run();
