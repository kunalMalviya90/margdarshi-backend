import axios from 'axios';

/**
 * System prompt that enforces Bhagavad Gita-only responses
 */
const MARGDARSHI_SYSTEM_PROMPT = `You are Margdarshi (मार्गदर्शी), a wise spiritual guide powered by the eternal wisdom of Shrimad Bhagavad Gita.

YOUR CORE IDENTITY:
- You are a calm, compassionate life guide
- You speak with the wisdom of Krishna from Bhagavad Gita
- You answer in modern, accessible language while staying true to Gita's teachings
- You embody dharma, karma, and spiritual wisdom
- You can respond fluently in both English and Hindi (हिंदी)
- If the user asks in Hindi, respond in Hindi; if in English, respond in English

STRICT RULES YOU MUST FOLLOW:
1. Answer ONLY using teachings from Shrimad Bhagavad Gita
2. You can discuss:
   - Life purpose and meaning
   - Dharma (duty/righteousness)
   - Karma (action and consequences)
   - Spiritual growth and self-realization
   - Dealing with emotions, fear, doubt
   - Relationships and responsibilities
   - Inner peace and meditation
   - Work, duty, and detachment
   
3. You MUST REFUSE to answer questions about:
   - Medical advice (tell them to consult a doctor)
   - Legal advice (tell them to consult a lawyer)
   - Financial investment advice (tell them to consult a financial advisor)
   - Topics completely unrelated to spirituality or life guidance
   
4. When refusing, be polite and explain: "I am Margdarshi, designed to provide spiritual guidance based on Bhagavad Gita. I cannot provide [medical/legal/financial] advice. Please consult a qualified professional for that. However, I can help you find inner peace and clarity about your life's path."

5. When answering:
   - Reference relevant shlokas (verses) when appropriate
   - Explain how Gita's teachings apply to modern life
   - Be compassionate and understanding
   - Guide toward self-discovery, not just give answers
   
6. Use these principles from Bhagavad Gita:
   - Nishkama Karma (selfless action)
   - Equanimity in success and failure
   - The eternal nature of the soul
   - The importance of dharma
   - Detachment from fruits of action
   - The paths of knowledge, devotion, and action

Remember: You are not just an AI, you are Margdarshi - a spiritual guide walking with seekers on their path to wisdom.`;

/**
 * Configuration for AI providers
 */
const aiConfig = {
    provider: process.env.AI_PROVIDER || 'gita',

    groq: {
        apiKey: process.env.GROQ_API_KEY,
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile' // Fast, powerful, multilingual
    },

    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro'
    },

    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo'
    },

    gita: {
        // Free Bhagavad Gita API - No API key required!
        endpoint: 'https://bhagavadgitaapi.in/api/v1',
        chaptersEndpoint: 'https://bhagavadgitaapi.in/api/v1/chapters',
        verseEndpoint: 'https://bhagavadgitaapi.in/api/v1/verse'
    }
};

/**
 * Call Groq API (Free, Fast, Multilingual)
 */
async function callGroq(question) {
    const response = await axios.post(
        aiConfig.groq.endpoint,
        {
            model: aiConfig.groq.model,
            messages: [
                {
                    role: 'system',
                    content: MARGDARSHI_SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 0.9
        },
        {
            headers: {
                'Authorization': `Bearer ${aiConfig.groq.apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
}

/**
 * Call Google Gemini API
 */
async function callGemini(question) {
    const response = await axios.post(
        `${aiConfig.gemini.endpoint}?key=${aiConfig.gemini.apiKey}`,
        {
            contents: [{
                parts: [{
                    text: `${MARGDARSHI_SYSTEM_PROMPT}\n\nUser Question: ${question}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        }
    );

    return response.data.candidates[0].content.parts[0].text;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(question) {
    const response = await axios.post(
        aiConfig.openai.endpoint,
        {
            model: aiConfig.openai.model,
            messages: [
                {
                    role: 'system',
                    content: MARGDARSHI_SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        },
        {
            headers: {
                'Authorization': `Bearer ${aiConfig.openai.apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
}

/**
 * Call Free Bhagavad Gita API
 * This uses gita-api.vercel.app - a free, working API with proper JSON responses
 */
async function callGitaAPI(question) {
    try {
        // Map common themes to relevant chapters and verses
        const themeToVerses = {
            'duty': [[2, 47], [3, 8], [18, 45]],
            'dharma': [[2, 47], [3, 35], [18, 47]],
            'karma': [[2, 47], [3, 9], [4, 18], [5, 2]],
            'action': [[2, 47], [3, 8], [4, 20]],
            'work': [[2, 47], [3, 19], [5, 11]],
            'fear': [[2, 11], [2, 56], [11, 50]],
            'death': [[2, 20], [2, 27], [2, 22]],
            'soul': [[2, 20], [13, 31], [15, 7]],
            'atma': [[2, 20], [2, 23], [13, 31]],
            'peace': [[2, 66], [6, 15], [12, 12]],
            'meditation': [[6, 25], [6, 35], [6, 47]],
            'yoga': [[6, 23], [6, 47], [2, 50]],
            'devotion': [[9, 22], [12, 6], [18, 65]],
            'bhakti': [[9, 22], [12, 2], [18, 66]],
            'knowledge': [[4, 38], [13, 11], [18, 63]],
            'wisdom': [[2, 11], [4, 33], [13, 8]],
            'detachment': [[2, 56], [5, 10], [6, 4]],
            'equanimity': [[2, 14], [2, 48], [6, 7]],
            'anger': [[2, 63], [16, 3], [16, 21]],
            'desire': [[2, 70], [3, 37], [16, 21]],
            'grief': [[2, 11], [2, 25], [2, 27]],
            'suffering': [[2, 14], [2, 15], [6, 17]],
            'purpose': [[2, 31], [3, 20], [18, 46]],
            'god': [[7, 7], [9, 18], [10, 8], [11, 54]],
            'krishna': [[10, 8], [10, 12], [11, 1]],
            'life': [[2, 13], [2, 22], [3, 16]],
            'worry': [[2, 11], [2, 47], [6, 35]],
            'anxiety': [[2, 56], [6, 13], [6, 35]]
        };

        // Find relevant verses based on question keywords
        const lowerQuestion = question.toLowerCase();
        let relevantVerses = [[2, 47]]; // Default to the most famous verse

        for (const [theme, verses] of Object.entries(themeToVerses)) {
            if (lowerQuestion.includes(theme)) {
                relevantVerses = verses;
                break;
            }
        }

        // Pick 1-2 random verses from relevant verses
        const numVerses = Math.min(2, relevantVerses.length);
        const selectedVerses = [];
        const usedIndices = [];

        for (let i = 0; i < numVerses; i++) {
            let idx;
            do {
                idx = Math.floor(Math.random() * relevantVerses.length);
            } while (usedIndices.includes(idx));
            usedIndices.push(idx);
            selectedVerses.push(relevantVerses[idx]);
        }

        // Fetch the selected verses
        const verseData = [];
        for (const [chapter, verse] of selectedVerses) {
            try {
                const response = await axios.get(`https://gita-api.vercel.app/en/verse/${chapter}/${verse}`);
                verseData.push(response.data);
            } catch (err) {
                console.error(`Error fetching verse ${chapter}.${verse}:`, err.message);
            }
        }

        if (verseData.length === 0) {
            throw new Error('Failed to fetch verses');
        }

        // Build response with beautiful formatting
        let response = `🕉️ **Margdarshi's Wisdom from Bhagavad Gita**\n\n`;
        response += `**Regarding your question:** "${question}"\n\n`;

        verseData.forEach((verse, idx) => {
            if (idx > 0) response += `\n---\n\n`;

            response += `**Shloka ${verse.chapter_no}.${verse.verse_no}**\n`;
            response += `*Chapter: ${verse.chapter_name}*\n\n`;
            response += `**Sanskrit Verse:**\n${verse.verse}\n\n`;

            if (verse.translation) {
                response += `**Meaning:**\n${verse.translation}\n\n`;
            }
        });

        response += `\n---\n\n`;
        response += `**✨ Margdarshi's Guidance:**\n\n`;

        // Add contextual wisdom based on the question
        response += `Dear seeker, the Bhagavad Gita teaches us that `;

        if (lowerQuestion.includes('worry') || lowerQuestion.includes('fear') || lowerQuestion.includes('anxiety')) {
            response += `fear and worry arise from attachment to outcomes. Lord Krishna teaches us to focus on our duty (dharma) and perform actions without attachment to results. This is the path to peace and inner strength.`;
        } else if (lowerQuestion.includes('purpose') || lowerQuestion.includes('meaning')) {
            response += `our true purpose is to realize our divine nature. We must perform our duties with dedication while understanding that we are eternal souls on a spiritual journey. Every action is an opportunity for spiritual growth.`;
        } else if (lowerQuestion.includes('karma') || lowerQuestion.includes('action') || lowerQuestion.includes('work')) {
            response += `every action has consequences, but we should practice **Nishkama Karma** - selfless action without desire for personal gain. Work becomes worship when done with the right intention and without attachment to results.`;
        } else if (lowerQuestion.includes('krishna') || lowerQuestion.includes('god')) {
            response += `Lord Krishna is the Supreme Being, the source of all creation. Through devotion (bhakti) and surrender, we can attain divine grace and eternal peace. He resides in the hearts of all beings.`;
        } else if (lowerQuestion.includes('peace') || lowerQuestion.includes('meditation')) {
            response += `true peace comes from controlling the mind through meditation and yoga. By detaching from worldly desires and focusing on the eternal self, we find lasting tranquility.`;
        } else {
            response += `true wisdom comes from understanding our eternal nature, performing our dharma with dedication, and maintaining equanimity in all situations - success or failure, pleasure or pain.`;
        }

        response += `\n\n🙏 **Om Shanti. May the wisdom of Bhagavad Gita illuminate your path.**`;

        return response;

    } catch (error) {
        console.error('Gita API Error:', error.message);

        // Fallback response with real Gita wisdom
        return `🕉️ **Margdarshi's Wisdom**\n\nDear seeker, the Bhagavad Gita teaches us eternal truths:\n\n**कर्मण्येवाधिकारस्ते मा फलेषु कदाचन**\n*"You have the right to perform your duty, but not to the fruits of your actions."* (Bhagavad Gita 2.47)\n\nThe Gita guides us to:\n\n1. **Perform our duty (dharma)** without attachment to results\n2. **Maintain equanimity** in success and failure, pleasure and pain  \n3. **Understand our eternal nature** - we are immortal souls, not just bodies\n4. **Practice selfless action (Nishkama Karma)** for the greater good\n5. **Seek inner peace** through meditation and self-realization\n6. **Surrender to the Divine** with devotion and faith\n\n🙏 May you find peace and clarity on your path.`;
    }
}

/**
 * Get AI response based on configured provider
 */
export async function getAIResponse(question) {
    try {
        if (aiConfig.provider === 'groq') {
            // Groq - Free, fast, multilingual AI
            if (!aiConfig.groq.apiKey) {
                throw new Error('Groq API key not configured. Get free key at https://console.groq.com/keys');
            }
            return await callGroq(question);
        } else if (aiConfig.provider === 'gita') {
            // Free Bhagavad Gita API - No API key needed!
            return await callGitaAPI(question);
        } else if (aiConfig.provider === 'gemini') {
            if (!aiConfig.gemini.apiKey) {
                throw new Error('Gemini API key not configured');
            }
            return await callGemini(question);
        } else if (aiConfig.provider === 'openai') {
            if (!aiConfig.openai.apiKey) {
                throw new Error('OpenAI API key not configured');
            }
            return await callOpenAI(question);
        } else {
            throw new Error('Invalid AI provider configured');
        }
    } catch (error) {
        console.error('AI API Error:', error.response?.data || error.message);
        throw error;
    }
}

export { MARGDARSHI_SYSTEM_PROMPT };
