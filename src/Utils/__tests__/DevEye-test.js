import Storage from 'Utils/Storage';

/**
 * The audience measurement is a silent path: a bug in it does not crash anything, it just stops
 * producing figures, and nothing on the DevEye side can tell that apart from "nobody used the app"
 * - the ingestion endpoint answers 204 on a refusal too. Hence these tests.
 *
 * The module holds its queue, its key and its consent for as long as it is loaded, which is the
 * whole point: a launch is one module lifetime. Each test therefore reloads it rather than trying
 * to undo the previous one, and `load()` returns that launch's instance.
 */

const ENDPOINT = 'https://devapi.geremy.dev/api/t/b';
const KEY = 'pk_test000000000000000000000';

/** @returns {any} A freshly loaded DevEye, as if the app had just started */
const load = () => {
    /** @type {any} */
    let mod;
    jest.isolateModules(() => {
        mod = require('../DevEye').default;
    });
    return mod;
};

/** @returns {any} The body of the last POST, decoded */
const lastBody = () => JSON.parse(/** @type {any} */ (global.fetch).mock.calls.at(-1)[1].body);

/** Let the grouping timer fire and the send that follows it settle. */
const drain = async () => {
    jest.runOnlyPendingTimers();
    await Promise.resolve();
    await Promise.resolve();
};

describe('[Utils] DevEye', () => {
    /** @type {any} */
    let DevEye;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        global.fetch = jest.fn(() => Promise.resolve(/** @type {any} */ ({ status: 204 })));
        DevEye = load();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('the two gates', () => {
        it('should send nothing while the user choice is unknown', async () => {
            DevEye.SetKey(KEY);
            DevEye.View('/home');
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should send nothing while the key is unknown', async () => {
            DevEye.SetConsentProvider(() => true);
            DevEye.View('/home');
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should send what was seen before both were known, once they are', async () => {
            DevEye.View('/loading');
            DevEye.View('/onboarding');

            DevEye.SetConsentProvider(() => true);
            DevEye.SetKey(KEY);
            await drain();

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(lastBody().events.map((/** @type {any} */ e) => e.path)).toEqual(['/loading', '/onboarding']);
        });

        it('should drop what was queued when the choice is no', async () => {
            DevEye.SetKey(KEY);
            DevEye.View('/home');

            DevEye.SetConsentProvider(() => false);
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should queue nothing at all once the choice is no', async () => {
            DevEye.SetKey(KEY);
            DevEye.SetConsentProvider(() => false);
            DevEye.View('/home');
            DevEye.Event('Activité ajoutée');
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should stop and forget everything when the server empties the key', async () => {
            DevEye.SetConsentProvider(() => true);
            DevEye.View('/home');

            DevEye.SetKey('');
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    describe('the key', () => {
        it('should keep a key handed by the server, for the next launch', () => {
            DevEye.SetKey(KEY);

            expect(Storage.Save).toHaveBeenCalledWith('DEVEYE_KEY', { key: KEY });
        });

        it('should clear the kept key when the server revokes it', () => {
            DevEye.SetKey(KEY);
            DevEye.SetKey('');

            expect(Storage.Save).toHaveBeenLastCalledWith('DEVEYE_KEY', null);
        });

        it('should measure a cold start from the key kept last time', async () => {
            /** @type {any} */ (Storage.Load).mockResolvedValueOnce({ key: KEY });

            const fresh = load();
            await fresh.Initialize();
            fresh.SetConsentProvider(() => true);
            fresh.View('/loading');
            await drain();

            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(lastBody().key).toBe(KEY);
        });

        it('should stay silent on a first launch, nothing being kept yet', async () => {
            const fresh = load();
            await fresh.Initialize();
            fresh.SetConsentProvider(() => true);
            fresh.View('/loading');
            await drain();

            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    describe('what is sent', () => {
        beforeEach(() => {
            DevEye.SetKey(KEY);
            DevEye.SetConsentProvider(() => true);
        });

        it('should post the site key and a stable visitor identifier', async () => {
            DevEye.View('/home');
            await drain();

            const [url, options] = /** @type {any} */ (global.fetch).mock.calls[0];
            expect(url).toBe(ENDPOINT);
            expect(options.method).toBe('POST');

            const body = lastBody();
            expect(body.key).toBe(KEY);
            expect(body.visitorId).toMatch(/^[0-9a-f]{32}$/);
        });

        it('should attach an event to the screen it happened on', async () => {
            DevEye.View('/panel/add-activity');
            DevEye.Event('Activité ajoutée');
            await drain();

            expect(lastBody().events).toEqual([
                expect.objectContaining({ type: 'view', path: '/panel/add-activity' }),
                expect.objectContaining({ type: 'event', path: '/panel/add-activity', name: 'Activité ajoutée' })
            ]);
        });

        it('should declare the app version and the platform rather than let them be guessed', async () => {
            DevEye.View('/home');
            await drain();

            expect(lastBody().events[0]).toEqual(
                expect.objectContaining({ browser: 'GameLife 2.3.2', os: 'iOS 14', device: 'mobile' })
            );
        });

        it('should keep the events when the send fails, and send them on the next attempt', async () => {
            /** @type {any} */ (global.fetch).mockRejectedValueOnce(new Error('offline'));

            DevEye.View('/home');
            await drain();

            expect(global.fetch).toHaveBeenCalledTimes(1);

            await drain();

            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(lastBody().events).toEqual([expect.objectContaining({ path: '/home' })]);
        });

        it('should never send more than a full batch at once', async () => {
            for (let i = 0; i < 25; i++) {
                DevEye.View(`/page-${i}`);
            }
            await drain();

            expect(lastBody().events).toHaveLength(20);
        });

        it('should drain every batch when the app leaves the foreground', async () => {
            for (let i = 0; i < 25; i++) {
                DevEye.View(`/page-${i}`);
            }

            await DevEye.Flush();

            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(lastBody().events).toHaveLength(5);
        });
    });
});
