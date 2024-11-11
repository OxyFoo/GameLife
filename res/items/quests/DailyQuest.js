/**
 * @typedef {import('Types/Global/Rarities').Rarities} Rarities
 * @typedef {{ type: 'ox', value: number } | { type: 'chest', value: Rarities }} DailyQuestRewardType
 */

// TODO: Link to the server
/**
 * /!\ Warning: This is not linked to the server side \
 * Server side data are in `src/Server/HTTP/src/data/dailyquest_rewards.php`
 * @type {Array<Array<DailyQuestRewardType>>}
 */
const DAILY_QUEST_REWARDS = [
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [{ type: 'ox', value: 1 }],
    [
        { type: 'ox', value: 2 },
        { type: 'chest', value: 'common' }
    ],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [{ type: 'ox', value: 2 }],
    [
        { type: 'ox', value: 3 },
        { type: 'chest', value: 'rare' }
    ],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [{ type: 'ox', value: 3 }],
    [
        { type: 'ox', value: 5 },
        { type: 'chest', value: 'epic' }
    ],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [{ type: 'ox', value: 5 }],
    [
        { type: 'ox', value: 10 },
        { type: 'chest', value: 'legendary' }
    ]
];

export default DAILY_QUEST_REWARDS;
