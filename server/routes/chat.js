const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "Please provide a message." });
    }

    try {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.match(/^(hi|hello|hey|greetings)/i) && lowerMsg.split(' ').length < 3) {
            return res.json({ reply: "Hello! I am your AI Career Mentor. I can help you with roadmaps, skills, and career doubts. specific questions work best!" });
        }

        // Use DuckDuckGo HTML version for scraping (no API key needed, strictly for demo purposes)
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(message)}`;

        const response = await fetch(searchUrl, {
            headers: {
                // User-Agent is often required to avoid 403
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Search failed with status ${response.status}`);
        }

        const html = await response.text();

        // Simple Regex to extract results (Title and Link)
        // DDG HTML usually has results in <div class="result__body"> ... <a class="result__a" href="...">Title</a> ... <a class="result__snippet" ...>Snippet</a>

        // Match results
        const results = [];
        const resultRegex = /<div class="result__body">[\s\S]*?<a class="result__a" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet" href="[^"]+">([\s\S]*?)<\/a>/g;

        // This regex is complex and might be brittle. Let's try a simpler approach:
        // extracting text blocks that look like results.

        // Extract up to 3 results
        let match;
        let count = 0;

        // Reset regex state just in case
        resultRegex.lastIndex = 0;

        while ((match = resultRegex.exec(html)) !== null && count < 3) {
            // DDG links are often redirected strings like /l/?kh=-1&uddg=... 
            // but usually the href in the anchor is the redirect.
            // We can try to decode it, or just present it.
            // Actually, for a simple chatbot, we want the title and snippet mostly.

            let link = match[1];
            let title = match[2].replace(/<[^>]+>/g, '').trim(); // Remove tags if any inside title
            let snippet = match[3].replace(/<[^>]+>/g, '').trim();

            // Decode DDG redirect if possible (optional, but cleaner)
            if (link.startsWith('//duckduckgo.com/l/?uddg=')) {
                try {
                    const urlParams = new URLSearchParams(link.split('?')[1]);
                    link = decodeURIComponent(urlParams.get('uddg'));
                } catch (e) {
                    // ignore
                }
            }

            results.push({ title, link, snippet });
            count++;
        }

        if (results.length > 0) {
            let reply = `Here is what I found for "${message}":\n`;

            results.forEach(r => {
                reply += `\n**${r.title}**\n${r.snippet}\n[Read more](${r.link})\n`;
            });

            res.json({ reply });
        } else {
            // Fallback if scraping fails (layout change, etc)
            console.log("Regex found no matches. HTML length:", html.length);
            res.json({ reply: `I found some information on DuckDuckGo but couldn't parse the specific details. You can check the results here: [Search Results](${searchUrl})` });
        }

    } catch (error) {
        console.error("Search error:", error);
        res.json({ reply: "I'm having trouble connecting to the internet right now. Please try again later." });
    }
});

module.exports = router;
