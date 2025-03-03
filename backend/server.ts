import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import logger from "./logger.ts"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize GROQ SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

app.use(express.json());
app.use(cors());

app.post("/autocomplete", async (req: Request, res: Response) => {
    try {
        const { text, context } = req.body;
        console.log("text", text);
        console.log("context", context);

        if (!text) {
            logger.warn("Autocomplete request missing text.");
            return res.status(400).json({ error: "Text is required" });
        }

        logger.info(`Processing autocomplete request for text: "${text}"`);
const prompt = `You are an AI assistant providing concise email autocomplete suggestions. Your goal is to complete the user's sentence in a professional and natural manner.

- The user is composing an email.  
- Suggest **only one** short and relevant continuation.  
- Do not generate multiple options.  
- Ensure the response is fluent and maintains the email's tone.  
- Do not repeat the user's text.  

User's email subject: ${context}  
User is typing: "${text}"  
Provide a concise and natural continuation:  
`;
        // Generate autocomplete suggestions
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: "You are an AI assistant that provides email autocomplete suggestions. you only return the completion nothing more!" },
                { role: "user", content: prompt }
            ],
            max_tokens: 50,
            temperature: 0.7,
        });

        const suggestion = response.choices[0]?.message?.content?.trim() || "No suggestion available.";
        logger.info(`Generated suggestion: "${suggestion}"`);

        res.json({ suggestion });
    } catch (error) {
        logger.error(`Error generating autocomplete: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
