import { readFileSync } from 'fs';
import { OpenAI } from 'openai';

import { StrIsJson } from './Functions.js';

const SYSTEM_PROMPT = readFileSync('./src/Utils/prompt.txt').toString();

class GPT {
    constructor() {
        this.openai = new OpenAI();
    }

    /**
     * @param {string} prompt
     * @param {string} skillsName
     * @param {(error: string) => void} callbackError
     * @returns {Promise<string | null>}
     */
    PromptToActivities = async (prompt, skillsName, callbackError) => {
        const response = await this.AskGPT(prompt, skillsName)
        .catch((error) => {
            callbackError(error.message);
            return null;
        });

        if (response === null || !StrIsJson(response)) {
            return null;
        }

        return response;
    }

    /**
     * @private
     * @param {string} message
     * @param {string} skillsName
     * @returns {Promise<string | null>}
     */
    AskGPT = async (message, skillsName) => {
        const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const prompt = SYSTEM_PROMPT
            .replace('{today}', today)
            .replace('{skills}', skillsName);

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
