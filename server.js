require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post('/api/calculate-calories', async (req, res) => {
    const { food, quantity } = req.body;

    if (!food || !quantity) {
        return res.status(400).json({ error: "Food and quantity are required." });
    }

    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.COHERE_API_KEY}`
            },
            body: JSON.stringify({
                model: "command-r-plus",
                prompt: `Calculate the approximate calories and benefits of ${quantity} of ${food}. Provide the response in strict JSON format with only two keys: calories (in kcal) and benefits (as an array).`,
                max_tokens: 200
            })
        });

        const data = await response.json();
        const rawText = data.generations[0]?.text?.trim();

        if (!rawText) {
            console.error("No valid response from AI API");
            return res.status(500).json({ error: "No response received from AI API." });
        }

        const jsonStart = rawText.indexOf("{");
        const jsonEnd = rawText.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
            try {
                const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
                const result = JSON.parse(jsonString);
                
                return res.json({
                    calories: result.calories || "Not available",
                    benefits: Array.isArray(result.benefits) ? result.benefits : ["No benefits provided."]
                });
            } catch (parseError) {
                console.error("Error parsing AI response as JSON:", parseError);
                return res.status(500).json({ error: "Failed to parse AI response as JSON." });
            }
        }

        console.error("No valid JSON structure found in AI response:", rawText);
        return res.status(500).json({ error: "AI response did not contain valid JSON data." });
    } catch (error) {
        console.error("Error calling AI API:", error);
        res.status(500).json({ error: "Failed to fetch calorie data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
