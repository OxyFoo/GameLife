import dataManager from 'Managers/DataManager';

/**
 * @typedef {import('Managers/UserManager').default} User
 */

/**
 * @description Load the template data for the app
 * @param {User} user
 */
export function LoadTemplate_AppData(user) {
    dataManager.achievements.Load([
        {
            ID: 1,
            Type: 'AUTO',
            Name: { fr: 'Chasseur de rang D', en: 'D rank hunter' },
            Description: { fr: '', en: '' },
            Condition: {
                Comparator: {
                    Type: 'Level',
                    Value: null
                },
                Operator: 'GT',
                Value: '10'
            },
            Rewards: [
                { Type: 'OX', Amount: 100 },
                { Type: 'Title', TitleID: 1 }
            ],
            UniversalProgressPercentage: 90
        },
        {
            ID: 2,
            Type: 'AUTO',
            Name: { fr: 'Chasseur de rang A', en: 'A rank hunter' },
            Description: { fr: '', en: '' },
            Condition: {
                Comparator: {
                    Type: 'Level',
                    Value: null
                },
                Operator: 'GT',
                Value: '100'
            },
            Rewards: [
                { Type: 'OX', Amount: 2000 },
                { Type: 'Title', TitleID: 2 }
            ],
            UniversalProgressPercentage: 40
        },
        {
            ID: 3,
            Type: 'AUTO',
            Name: { fr: 'Chasseur de rang S', en: 'S rank hunter' },
            Description: { fr: '', en: '' },
            Condition: {
                Comparator: {
                    Type: 'Level',
                    Value: null
                },
                Operator: 'GT',
                Value: '500'
            },
            Rewards: [
                { Type: 'OX', Amount: 10000 },
                { Type: 'Title', TitleID: 3 }
            ],
            UniversalProgressPercentage: 1
        }
    ]);
    dataManager.ads.Load([]);
    dataManager.contributors.Load([
        { ID: 1, Name: 'John Doe', Type: 'alpha-player' },
        { ID: 2, Name: 'Jane Smith', Type: 'beta-player' },
        { ID: 3, Name: 'Alice Johnson', Type: 'V2' }
    ]);
    dataManager.dailyQuestsRewards.Load([{ index: 0, rewards: [{ Type: 'OX', Amount: 10000 }] }]);
    dataManager.items.Load([
        {
            ID: 'bottom_01',
            Slot: 'bottom',
            Name: { fr: 'Pantalon de survêtement', en: 'Sweatpants' },
            Description: {
                fr: 'Un jean.',
                en: 'Jeans.'
            },
            Rarity: 'common',
            Buyable: true,
            Buffs: [],
            Value: 35
        }
    ]);
    dataManager.missions.Load([]);
    dataManager.quotes.Load([
        { ID: 1, Quote: { fr: 'Crois en toi !', en: 'Believe in yourself!' }, Author: 'Unknown' }
    ]);
    dataManager.skills.Load({
        skills: [
            {
                ID: 1,
                Name: { fr: 'Corde à sauter', en: 'Jumping rope' },
                CategoryID: 1,
                XP: 100,
                Stats: { int: 0, soc: 1, for: 0, sta: 4, dex: 1, agi: 1 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 2,
                Name: { fr: 'Accrobranche', en: 'Tree climbing' },
                CategoryID: 1,
                XP: 100,
                Stats: { int: 0, soc: 1, for: 2, sta: 1, dex: 1, agi: 2 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 3,
                Name: { fr: 'Travail Scolaire', en: 'School work' },
                CategoryID: 2,
                XP: 100,
                Stats: { int: 6, soc: 1, for: 0, sta: 0, dex: 0, agi: 0 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 4,
                Name: { fr: 'Lecture', en: 'Reading' },
                CategoryID: 3,
                XP: 100,
                Stats: { int: 3, soc: 0, for: 0, sta: 0, dex: 0, agi: 0 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 5,
                Name: { fr: 'Écriture', en: 'Writing' },
                CategoryID: 3,
                XP: 100,
                Stats: { int: 2, soc: 0, for: 0, sta: 0, dex: 0, agi: 0 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 6,
                Name: { fr: 'Programmation', en: 'Programming' },
                CategoryID: 2,
                XP: 100,
                Stats: { int: 4, soc: 0, for: 0, sta: 0, dex: 0, agi: 0 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 7,
                Name: { fr: 'Cuisine', en: 'Cooking' },
                CategoryID: 4,
                XP: 100,
                Stats: { int: 1, soc: 2, for: 0, sta: 0, dex: 1, agi: 1 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 8,
                Name: { fr: 'Jardinage', en: 'Gardening' },
                CategoryID: 4,
                XP: 100,
                Stats: { int: 0, soc: 2, for: 1, sta: 1, dex: 1, agi: 1 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            },
            {
                ID: 9,
                Name: { fr: 'Sortie entre pote', en: 'Go out with bro' },
                CategoryID: 5,
                XP: 100,
                Stats: { int: 0, soc: 7, for: 0, sta: 0, dex: 0, agi: 0 },
                LogoID: 1,
                Enabled: true,
                Creator: ''
            }
        ],
        skillIcons: [
            {
                ID: 1,
                Name: 'Well-being',
                Content:
                    'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+CiAgICA8cGF0aCBmaWxsPSIjZmZmZmZmIgogICAgICAgIGQ9Ik0zMCwxN0wzMCwxN2MtMy45LDAtNy0zLjEtNy03VjhjMC0zLjksMy4xLTcsNy03bDAsMGMzLjksMCw3LDMuMSw3LDdsMCwwdjJDMzcsMTMuOSwzMy45LDE3LDMwLDE3eiBNNTksMzUuNmMwLDEuOS0xLjUsMy40LTMuNCwzLjRjLTAuMywwLTAuNy0wLjEtMS0wLjJsLTYuMi0xLjljLTEuNi0wLjUtMy0xLjMtNC4xLTIuNUw0MCwzMC4ybC0wLjksMTAuNGwxMS41LDQuNmMyLjcsMS4xLDQsNC4yLDIuOSw2LjljLTAuNywxLjctMi4yLDIuOS0zLjksMy4ybC0xMy4yLDIuM2MwLjEtMC4zLDAuMy0wLjYsMC4zLTAuOWwwLjEtMC4zbDAsMGMwLjYtMi44LTAuOC01LjYtMy41LTYuN2w3LjUtMi4ySDE5bDExLDMuMmwyLjMsMC43YzIsMC42LDMuMiwyLjcsMi43LDQuN2MwLDAsMCwwLDAsMGwwLDBjLTAuMiwwLjgtMC43LDEuNS0xLjMsMmMtMC44LDAuNy0xLjksMC45LTMsMC44bC0wLjYtMC4xbDAsMGwtMTkuOC0zLjVjLTIuOS0wLjUtNC44LTMuMy00LjItNi4yYzAuMy0xLjgsMS42LTMuMywzLjItMy45bDExLjUtNC42TDIwLDMwLjJsLTQuNywzLjljLTAuOCwwLjctMS44LDEuMy0yLjgsMS43bC03LDIuN2MtMS43LDAuNy0zLjYtMC4yLTQuMy0xLjlzMC4yLTMuNiwxLjktNC4zbDQuOS0yYzItMC44LDMuOC0yLDUuMi0zLjZsMy44LTQuMmMxLjktMi4xLDQuNi0zLjMsNy40LTMuM2gxMC44YzMsMCw1LjksMS40LDcuOCwzLjhsMi41LDMuMmMxLjYsMiwzLjcsMy41LDYuMSw0LjRsNS4xLDEuOEM1OC4xLDMyLjksNTksMzQuMiw1OSwzNS42eiIgLz4KPC9zdmc+'
            },
            {
                ID: 2,
                Name: 'Work',
                Content:
                    'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+Cgk8cGF0aCBmaWxsPSIjZmZmZmZmIgoJCWQ9Ik01MiwzNi42Yy0wLjQsMS40LTEsMi44LTEuNyw0LjJjLTAuNCwwLjctMC4yLDEuNiwwLjMsMi4ybDIuMiwyLjVjMC43LDAuOCwwLjcsMi0wLjEsMi43bC00LjQsNC40Yy0wLjcsMC43LTEuOSwwLjgtMi43LDAuMWwtMi41LTIuMmMtMC42LTAuNS0xLjUtMC43LTIuMi0wLjNjLTEuMywwLjctMi43LDEuMy00LjIsMS43Yy0wLjgsMC4zLTEuMywxLTEuNCwxLjhsLTAuMiwzYzAuMSwxLjItMC44LDIuMi0yLDIuMmMwLDAsMCwwLDAsMGgtNi4yYy0xLjEsMC0xLjktMC44LTItMS45bC0wLjItMy4zYzAtMC44LTAuNi0xLjUtMS40LTEuOGMtMS4zLTAuNC0yLjUtMC45LTMuNy0xLjVsMy0zYzIuOSwxLjIsNi4xLDEuNyw5LjMsMS40QzQyLjQsNDcuOSw1MCwzOC42LDQ5LDI4LjFTMzguNywxMC4xLDI4LjIsMTEuMVMxMC4xLDIxLjQsMTEuMiwzMS44YzAuMiwxLjksMC43LDMuOCwxLjQsNS42bC0zLDNjLTAuNi0xLjItMS4xLTIuNS0xLjYtMy44Yy0wLjItMC44LTEtMS40LTEuOC0xLjRsLTMuMy0wLjJDMS45LDM1LDEsMzQuMSwxLDMzLjF2LTYuMmMwLTEuMSwwLjgtMS45LDEuOS0ybDMuMy0wLjJjMC44LDAsMS41LTAuNiwxLjgtMS40YzAuNC0xLjQsMS0yLjgsMS43LTQuMmMwLjQtMC43LDAuMy0xLjYtMC4zLTIuMmwtMi4yLTIuNWMtMC43LTAuOC0wLjctMiwwLjEtMi43bDQuNC00LjRjMC43LTAuNywxLjktMC44LDIuNy0wLjFMMTcsOS40YzAuNiwwLjUsMS41LDAuNywyLjIsMC4zQzIwLjUsOSwyMS45LDguNCwyMy40LDhjMC44LTAuMywxLjMtMSwxLjQtMS44bDAuMi0zYy0wLjEtMS4yLDAuOC0yLjIsMS45LTIuMmMwLDAsMCwwLDAuMSwwaDYuMmMxLjEsMCwxLjksMC44LDIsMS45bDAuMiwzLjNjMCwwLjgsMC42LDEuNSwxLjQsMS44YzEuNCwwLjQsMi44LDEsNC4yLDEuN2MwLjcsMC40LDEuNiwwLjMsMi4yLTAuM2wyLjUtMi4yYzAuOC0wLjcsMi0wLjcsMi43LDAuMWw0LjQsNC40YzAuNywwLjcsMC44LDEuOSwwLjEsMi43bC0yLjIsMi41Yy0wLjUsMC42LTAuNywxLjUtMC4zLDIuMmMwLjcsMS4zLDEuMywyLjcsMS43LDQuMmMwLjMsMC44LDEsMS4zLDEuOCwxLjRsMywwLjJjMS4yLTAuMSwyLjIsMC44LDIuMiwyYzAsMCwwLDAsMCwwdjYuMmMwLDEuMS0wLjgsMS45LTEuOSwybC0yLjksMC4yQzUzLjIsMzUuMSw1Mi40LDM1LjcsNTIsMzYuNnoiIC8+Cgk8cGF0aCBmaWxsPSIjZmZmZmZmIgoJCWQ9Ik00NS44LDM1LjNMNDEsNDBjLTAuNywwLjctMS44LDAuNy0yLjUsMGMwLDAsMCwwLDAsMGwtMi43LTIuN2wxLjItMS4ybC0yLjYtMi42bC0xLjIsMS4ybC03LjgtNy44bDEuMy0xLjNjMC43LTAuNywwLjctMS45LDAtMi42Yy0xLjEtMS4xLTIuOC0xLjEtMy45LDBjMCwwLDAsMCwwLDBsLTAuNiwwLjZsLTItMmwyLTJjMi45LTIuOSw3LjYtMi45LDEwLjQsMGMwLDAsMCwwLDAsMGw3LjgsNy44bC0xLjIsMS4ybDIuNiwyLjZsMS4yLTEuMmwyLjcsMi43QzQ2LjQsMzMuNSw0Ni41LDM0LjYsNDUuOCwzNS4zQzQ1LjgsMzUuMyw0NS44LDM1LjMsNDUuOCwzNS4zeiIgLz4KCTxwYXRoIGZpbGw9IiNmZmZmZmYiCgkJZD0iTTMxLjMsMzQuNUw3LjUsNTguNGMtMC43LDAuOC0yLDAuOS0yLjgsMC4xYzAsMCwwLDAtMC4xLTAuMWwtMy0zYy0wLjgtMC44LTAuOC0yLDAtMi44YzAsMCwwLDAsMC4xLTAuMWwyMy44LTIzLjhMMzEuMywzNC41eiIgLz4KPC9zdmc+'
            }
        ],
        skillCategories: [
            { ID: 0, Name: { fr: 'Récent', en: 'Recent' }, Color: '#000000', LogoID: 1 },
            { ID: 1, Name: { fr: 'Bien-être', en: 'Well-being' }, Color: '#006DFF', LogoID: 1 },
            { ID: 2, Name: { fr: 'Travail', en: 'Work' }, Color: '#A8C69F', LogoID: 2 },
            { ID: 3, Name: { fr: 'Créativité', en: 'Creativity' }, Color: '#BDB2FA', LogoID: 1 },
            { ID: 4, Name: { fr: 'Quotidien', en: 'Daily life' }, Color: '#FFA5BA', LogoID: 1 },
            { ID: 5, Name: { fr: 'Social', en: 'Social' }, Color: '#8C2155', LogoID: 1 }
        ]
    });
    dataManager.titles.Load([
        { ID: 1, Name: { fr: 'Chasseur de rang D', en: 'D rank hunter' }, Value: 100, Buyable: false },
        { ID: 2, Name: { fr: 'Chasseur de rang A', en: 'A rank hunter' }, Value: 100, Buyable: false },
        { ID: 3, Name: { fr: 'Chasseur de rang S', en: 'S rank hunter' }, Value: 100, Buyable: false }
    ]);

    user.interface.console?.AddLog('info', 'App data: template load success');
}

/**
 * @description Load the template user data
 * @param {User} user
 */
export function LoadTemplate_UserData(user) {
    user.informations.username.Set('TemplateUser');
    user.server2.userAuth.SetEmail('templateuser@localhost');
}
