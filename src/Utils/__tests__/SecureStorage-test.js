import * as Keychain from 'react-native-keychain';

import SecureStorage from '../SecureStorage';
import { SECURE_STORAGE_KEYS } from 'Constants/StorageKeys';

const BUNDLE_ID = 'com.gamelife.app';

const setGenericPassword = jest.mocked(Keychain.setGenericPassword);
const getGenericPassword = jest.mocked(Keychain.getGenericPassword);
const resetGenericPassword = jest.mocked(Keychain.resetGenericPassword);

/** @param {string} key */
const serviceOf = (key) => `${BUNDLE_ID}.${key}`;

/** @returns {Array<string>} Services passed to every resetGenericPassword call */
const clearedServices = () => resetGenericPassword.mock.calls.map(([options]) => options?.service ?? '');

describe('[Utils] SecureStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Save', () => {
        it('should store a string under a service scoped to the bundle id', async () => {
            setGenericPassword.mockResolvedValueOnce(/** @type {any} */ ({}));

            const saved = await SecureStorage.Save('SESSION_TOKEN', 'token-value');

            expect(saved).toBe(true);
            expect(setGenericPassword).toHaveBeenCalledWith('SESSION_TOKEN', 'token-value', {
                service: serviceOf('SESSION_TOKEN')
            });
        });

        it('should serialize an object before storing it', async () => {
            setGenericPassword.mockResolvedValueOnce(/** @type {any} */ ({}));

            await SecureStorage.Save('ACCOUNT_EMAIL', { email: 'a@b.co' });

            expect(setGenericPassword).toHaveBeenCalledWith('ACCOUNT_EMAIL', JSON.stringify({ email: 'a@b.co' }), {
                service: serviceOf('ACCOUNT_EMAIL')
            });
        });

        it('should refuse an unknown key', async () => {
            const unknownKey = /** @type {keyof SECURE_STORAGE_KEYS} */ (/** @type {unknown} */ ('NOT_A_KEY'));

            const saved = await SecureStorage.Save(unknownKey, 'value');

            expect(saved).toBe(false);
            expect(setGenericPassword).not.toHaveBeenCalled();
        });

        it('should report a failure when the keychain rejects', async () => {
            setGenericPassword.mockRejectedValueOnce(new Error('keychain unavailable'));

            await expect(SecureStorage.Save('SESSION_TOKEN', 'value')).resolves.toBe(false);
        });
    });

    describe('Load', () => {
        it('should return the raw string when it is not JSON', async () => {
            getGenericPassword.mockResolvedValueOnce(/** @type {any} */ ({ password: 'plain-token' }));

            await expect(SecureStorage.Load('SESSION_TOKEN')).resolves.toBe('plain-token');
        });

        it('should parse a stored JSON payload', async () => {
            getGenericPassword.mockResolvedValueOnce(/** @type {any} */ ({ password: '{"email":"a@b.co"}' }));

            await expect(SecureStorage.Load('ACCOUNT_EMAIL')).resolves.toEqual({ email: 'a@b.co' });
        });

        it('should return null when nothing is stored', async () => {
            getGenericPassword.mockResolvedValueOnce(false);

            await expect(SecureStorage.Load('DEVICE_UUID')).resolves.toBeNull();
        });
    });

    describe('ClearAll', () => {
        // Regression: ClearAll iterated over Object.values(SECURE_STORAGE_KEYS) while the
        // key check expects property names, so SESSION_TOKEN and the integrity tokens were
        // silently skipped and survived a disconnect.
        it('should remove every declared secure key', async () => {
            await SecureStorage.ClearAll();

            const services = clearedServices();
            const expected = Object.keys(SECURE_STORAGE_KEYS).map(serviceOf);

            expect(services).toHaveLength(expected.length);
            expect(services.sort()).toEqual(expected.sort());
        });

        it('should remove the session and integrity tokens in particular', async () => {
            await SecureStorage.ClearAll();

            const services = clearedServices();

            expect(services).toContain(serviceOf('SESSION_TOKEN'));
            expect(services).toContain(serviceOf('INTEGRITY_TOKEN'));
            expect(services).toContain(serviceOf('INTEGRITY_TOKEN_TIMESTAMP'));
        });
    });
});
