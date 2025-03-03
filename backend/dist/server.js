import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import logger from "./logger.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Initialize GROQ SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
app.use(express.json());
app.use(cors());
app.post("/autocomplete", async (req, res) => {
    const { text, context } = req.body;
    // Validate that 'text' is provided
    if (!text) {
        logger.warn("Autocomplete request missing text.");
        return res.status(400).json({ suggestion: "Text is required" });
    }
    logger.info(`Processing autocomplete request for text: "${text}"`);
    try {
        // Generate autocomplete suggestions
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: "You are an AI assistant that provides email autocomplete suggestions." },
                { role: "user", content: `Email Subject: ${context}\nUser is typing: "${text}"\nSuggest a continuation:` }
            ],
            max_tokens: 50,
            temperature: 0.7,
        });
        const suggestion = response.choices[0]?.message?.content?.trim() || "No suggestion available.";
        logger.info(`Generated suggestion: "${suggestion}"`);
        res.json({ suggestion });
    }
    catch (error) {
        logger.error(`Error generating autocomplete: ${error}`);
        res.status(500).json({ suggestion: "Internal Server Error" });
    }
});
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
