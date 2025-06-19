const axios = require('axios');

const extractLocationFromText = async (text) => {
    try {
        const prompt = `Extract location from: ${text}`;
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            },
            {
                params: { key: process.env.GEMINI_API_KEY },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const locationText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return locationText || null;
    } catch (err) {
        console.error('Gemini error:', err.message);
        return null;
    }
};

module.exports = { extractLocationFromText };
