import Storage from 'Utils/Storage';
import { DataManager } from '../DataManager';

/**
 * Minimal app data payload: every table gets one entry so that a missed reset in
 * Clear() is visible. The rows deliberately omit the rest of the domain fields —
 * these tests only look at row counts (and `Enabled`, which Skills.Get filters on).
 * @type {any}
 */
const APP_DATA = {
    achievements: [{ ID: 1 }],
    ads: [{ ID: 1 }],
    contributors: [{ ID: 1 }],
    dailyQuestsRewards: [{ ID: 1 }],
    items: [{ ID: 1 }],
    missions: [{ ID: 1 }],
    quotes: [{ ID: 1 }],
    // Skills.Get() only returns enabled skills and sorts them by localized name
    skills: [{ ID: 1, Enabled: true, Name: { fr: 'Sport', en: 'Sport' } }],
    skillIcons: [{ ID: 1 }],
    skillCategories: [{ ID: 1 }],
    titles: [{ ID: 1 }]
};

/** @param {DataManager} manager */
const loadEverything = (manager) => {
    manager.achievements.Load(APP_DATA.achievements);
    manager.ads.Load(APP_DATA.ads);
    manager.contributors.Load(APP_DATA.contributors);
    manager.dailyQuestsRewards.Load(APP_DATA.dailyQuestsRewards);
    manager.items.Load(APP_DATA.items);
    manager.missions.Load(APP_DATA.missions);
    manager.quotes.Load(APP_DATA.quotes);
    manager.skills.Load({
        skills: APP_DATA.skills,
        skillIcons: APP_DATA.skillIcons,
        skillCategories: APP_DATA.skillCategories
    });
    manager.titles.Load(APP_DATA.titles);
};

describe('[Manager] DataManager', () => {
    /** @type {DataManager} */
    let dataManager;

    beforeEach(() => {
        jest.clearAllMocks();
        dataManager = new DataManager();
    });

    describe('Clear', () => {
        it('should empty every app data table', async () => {
            loadEverything(dataManager);
            expect(dataManager.CountAll()).toBeGreaterThan(0);

            await dataManager.Clear();

            expect(dataManager.CountAll()).toBe(0);
        });

        // Regression: missions.Clear() was missing from Clear(), so missions
        // survived a data reset while every other table was emptied.
        it('should empty the missions table too', async () => {
            loadEverything(dataManager);
            expect(dataManager.missions.Get()).toHaveLength(1);

            await dataManager.Clear();

            expect(dataManager.missions.Get()).toEqual([]);
        });

        it('should wipe the locally stored app data and hashes', async () => {
            await dataManager.Clear();

            expect(Storage.Save).toHaveBeenCalledWith('APP_DATA', null);
            expect(Storage.Save).toHaveBeenCalledWith('APPDATA_HASHES', null);
        });

        // Regression: the two resets were fired without await, so they could land
        // after a save started right afterwards and wipe it.
        it('should resolve only once the local wipe is done', async () => {
            let resolveSave = () => {};
            jest.mocked(Storage.Save).mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        resolveSave = () => resolve(true);
                    })
            );

            let settled = false;
            const clearing = dataManager.Clear().then(() => {
                settled = true;
            });

            await Promise.resolve();
            expect(settled).toBe(false);

            resolveSave();
            await clearing;
            expect(settled).toBe(true);
        });
    });

    describe('DataAreLoaded', () => {
        it('should be false on a fresh manager', () => {
            expect(dataManager.DataAreLoaded()).toBe(false);
        });

        it('should be true once every table has content', () => {
            loadEverything(dataManager);
            expect(dataManager.DataAreLoaded()).toBe(true);
        });

        it('should be false again after a Clear', async () => {
            loadEverything(dataManager);
            await dataManager.Clear();
            expect(dataManager.DataAreLoaded()).toBe(false);
        });
    });

    describe('CountAll', () => {
        it('should count every row across all tables', () => {
            loadEverything(dataManager);
            // 11 tables (skills, skillIcons and skillCategories counted separately)
            expect(dataManager.CountAll()).toBe(11);
        });
    });
});
