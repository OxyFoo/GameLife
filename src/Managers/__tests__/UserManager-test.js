// The global mock in jest.setup.js replaces UserManager for the UI tests; this suite
// exercises the real save/clear orchestration.
jest.unmock('Managers/UserManager');

const { UserManager } = require('Managers/UserManager');

/**
 * Only the console and navigation entry points are exercised here, so the
 * FlowEngine interface is stubbed rather than rendered.
 * @param {UserManager} user
 */
const stubInterface = (user) => {
    user.interface = /** @type {any} */ ({
        console: {
            AddLog: jest.fn(() => 1),
            EditLog: jest.fn()
        },
        ChangePage: jest.fn(),
        ClearHistory: jest.fn()
    });
};

describe('[Manager] UserManager', () => {
    /** @type {UserManager} */
    let user;

    beforeEach(() => {
        jest.clearAllMocks();
        user = new UserManager();
        stubInterface(user);
    });

    describe('registries', () => {
        // Regression: `informations` is an IUserData but was also listed in CLASS, so it
        // was serialized into both USER_CLASS and USER_DATA and cleared/unmounted twice.
        it('should register each save key exactly once across CLASS and DATA', () => {
            const keys = [...user.CLASS, ...user.DATA].map((entry) => entry.key);
            expect(new Set(keys).size).toBe(keys.length);
        });

        it('should keep informations in DATA only', () => {
            expect(user.DATA).toContain(user.informations);
            expect(user.CLASS).not.toContain(user.informations);
        });

        it('should give every registered entry a non-empty key', () => {
            for (const entry of [...user.CLASS, ...user.DATA]) {
                expect(typeof entry.key).toBe('string');
                expect(entry.key.length).toBeGreaterThan(0);
            }
        });
    });

    describe('SaveOnline', () => {
        beforeEach(() => {
            jest.spyOn(user.server2, 'IsAuthenticated').mockReturnValue(true);
        });

        it('should return false when not authenticated', async () => {
            jest.mocked(user.server2.IsAuthenticated).mockReturnValue(false);
            await expect(user.SaveOnline()).resolves.toBe(false);
        });

        it('should return true when every data saves', async () => {
            for (const data of user.DATA) {
                jest.spyOn(data, 'SaveOnline').mockResolvedValue(true);
            }

            await expect(user.SaveOnline()).resolves.toBe(true);
        });

        // Regression: SaveOnline computed a `success` flag then returned a hardcoded
        // `true`, so a failed online save was reported as a success.
        it('should return false when one data fails to save', async () => {
            for (const data of user.DATA) {
                jest.spyOn(data, 'SaveOnline').mockResolvedValue(true);
            }
            jest.mocked(user.DATA[2].SaveOnline).mockResolvedValue(false);

            await expect(user.SaveOnline()).resolves.toBe(false);
        });

        it('should still try every data even after one failure', async () => {
            for (const data of user.DATA) {
                jest.spyOn(data, 'SaveOnline').mockResolvedValue(true);
            }
            jest.mocked(user.DATA[0].SaveOnline).mockResolvedValue(false);

            await user.SaveOnline();

            for (const data of user.DATA) {
                expect(data.SaveOnline).toHaveBeenCalled();
            }
        });
    });

    describe('GlobalSave', () => {
        it('should report a failure when the online save fails', async () => {
            jest.spyOn(user, 'SaveOnline').mockResolvedValue(false);
            jest.spyOn(user, 'SaveLocal').mockResolvedValue(true);

            await expect(user.GlobalSave()).resolves.toBe(false);
        });

        it('should save locally even when the online save fails', async () => {
            jest.spyOn(user, 'SaveOnline').mockResolvedValue(false);
            jest.spyOn(user, 'SaveLocal').mockResolvedValue(true);

            await user.GlobalSave();

            expect(user.SaveLocal).toHaveBeenCalled();
        });

        it('should refuse a concurrent save', async () => {
            let releaseOnline = () => {};
            jest.spyOn(user, 'SaveOnline').mockImplementation(
                () => new Promise((resolve) => (releaseOnline = () => resolve(true)))
            );
            jest.spyOn(user, 'SaveLocal').mockResolvedValue(true);

            const first = user.GlobalSave();
            await expect(user.GlobalSave()).resolves.toBe(false);

            releaseOnline();
            await expect(first).resolves.toBe(true);
        });

        // Regression: the `globalSaving` lock was released on the happy path only, so a
        // throwing save left it stuck and blocked every later save of the session.
        it('should release its lock when a save throws', async () => {
            jest.spyOn(user, 'SaveOnline').mockRejectedValueOnce(new Error('network down'));

            await expect(user.GlobalSave()).rejects.toThrow('network down');
            expect(user.globalSaving).toBe(false);

            jest.spyOn(user, 'SaveOnline').mockResolvedValue(true);
            jest.spyOn(user, 'SaveLocal').mockResolvedValue(true);
            await expect(user.GlobalSave()).resolves.toBe(true);
        });
    });
});
