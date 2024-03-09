import { readFileSync } from 'fs';
import { OpenAI } from 'openai';

import { StrIsJson } from './Functions.js';

/**
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('../Users.js').User} User
 * @typedef {import('Types/TCP.js').ZapGPTState} ZapGPTState
 */

const SYSTEM_PROMPT = readFileSync('./src/Utils/prompt.txt').toString();

class GPT {
    constructor() {
        this.openai = new OpenAI();
    }

    /**
     * @param {Users} users
     * @param {User} user
     * @returns {Promise<ZapGPTState | null>}
     */
    GetRemaining = async (users, user) => {
        const command = `SELECT
            (
                SELECT \`Data\`
                FROM \`App\`
                WHERE \`ID\` = "RequestPerUserZapGPT"
            ) AS Total,
            (
                SELECT Total - COUNT(\`ID\`)
                FROM \`Logs\`
                WHERE \`AccountID\` = ? AND Type = "zap-gpt-request" AND Date > CURDATE()
            ) AS Remaining
        `;

        const response = await users.db.QueryPrepare(command, [ user.accountID ]);
        if (response === null || response.length === 0) {
            return null;
        }
        if (!response[0].hasOwnProperty('Remaining') || !response[0].hasOwnProperty('Total')) {
            return null;
        }

        return {
            remaining: Math.max(0, response[0]['Remaining']),
            total: response[0]['Total']
        };
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
