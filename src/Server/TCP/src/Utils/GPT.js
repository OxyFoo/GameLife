import { readFileSync } from 'fs';
import { OpenAI } from 'openai';

import { StrIsJson } from './Functions.js';

/**
 * @typedef {import('Class/Activities.js').Activity} Activity
 */

const SYSTEM_PROMPT = readFileSync('./src/Utils/prompt.txt').toString();

class GPT {
    constructor() {
        this.openai = new OpenAI();
    }

    /**
     * @param {string} prompt
     * @returns {Promise<string | null>}
     */
    PromptToActivities = async (prompt) => {
        const response = await this.AskGPT(prompt);
        if (response === null) return null;

        if (!StrIsJson(response)) {
            return null;
        }

        return response;
    }

    /**
     * @private
     * @param {string} message
     * @returns {Promise<string | null>}
     */
    AskGPT = async (message) => {
        const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const prompt = SYSTEM_PROMPT.replace('{today}', today);

        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        return response?.choices[0]?.message?.content || null;
    }
}

export default GPT;
