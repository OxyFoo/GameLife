import { Alert, Platform } from 'react-native';
import { check, request, RESULTS } from 'react-native-permissions';
import { AdsConsent } from 'react-native-google-mobile-ads';

import Consent from 'Class/Consent';

const mockInitialize = jest.fn(async () => []);

// The global mock in jest.setup.js only exposes the TurboModule registry: the consent
// helper and the enums are stubbed here.
jest.mock('react-native-google-mobile-ads', () => ({
    __esModule: true,
    default: () => ({ initialize: mockInitialize }),
    AdsConsent: {
        gatherConsent: jest.fn(),
        requestInfoUpdate: jest.fn(),
        getConsentInfo: jest.fn(),
        getGdprApplies: jest.fn(),
        getPurposeConsents: jest.fn(),
        getUserChoices: jest.fn(),
        showPrivacyOptionsForm: jest.fn(),
        loadAndShowConsentFormIfRequired: jest.fn(),
        reset: jest.fn()
    },
    AdsConsentDebugGeography: { DISABLED: 0, EEA: 1, NOT_EEA: 2, REGULATED_US_STATE: 3, OTHER: 4 },
    AdsConsentStatus: { UNKNOWN: 'UNKNOWN', REQUIRED: 'REQUIRED', NOT_REQUIRED: 'NOT_REQUIRED', OBTAINED: 'OBTAINED' },
    AdsConsentPrivacyOptionsRequirementStatus: {
        UNKNOWN: 'UNKNOWN',
        REQUIRED: 'REQUIRED',
        NOT_REQUIRED: 'NOT_REQUIRED'
    }
}));

/**
 * @param {Partial<Record<keyof import('react-native-google-mobile-ads').AdsConsentInfo, any>>} [overrides]
 * @returns {import('react-native-google-mobile-ads').AdsConsentInfo}
 */
const info = (overrides = {}) =>
    /** @type {any} */ ({
        status: 'OBTAINED',
        canRequestAds: true,
        privacyOptionsRequirementStatus: 'REQUIRED',
        isConsentFormAvailable: true,
        ...overrides
    });

/** @param {boolean} enabled */
const setDev = (enabled) => {
    /** @type {any} */ (global).__DEV__ = enabled;
};

/** All TCF purposes accepted */
const ACCEPTED_CHOICES = { storeAndAccessInformationOnDevice: true, selectPersonalisedAds: true };

/** @param {'ios' | 'android'} os */
const setPlatform = (os) => {
    Object.defineProperty(Platform, 'OS', { value: os, configurable: true, writable: true });
};

const mocked = {
    gatherConsent: /** @type {jest.Mock} */ (AdsConsent.gatherConsent),
    requestInfoUpdate: /** @type {jest.Mock} */ (AdsConsent.requestInfoUpdate),
    getConsentInfo: /** @type {jest.Mock} */ (AdsConsent.getConsentInfo),
    getGdprApplies: /** @type {jest.Mock} */ (AdsConsent.getGdprApplies),
    getPurposeConsents: /** @type {jest.Mock} */ (AdsConsent.getPurposeConsents),
    getUserChoices: /** @type {jest.Mock} */ (AdsConsent.getUserChoices),
    showPrivacyOptionsForm: /** @type {jest.Mock} */ (AdsConsent.showPrivacyOptionsForm),
    loadAndShowConsentFormIfRequired: /** @type {jest.Mock} */ (AdsConsent.loadAndShowConsentFormIfRequired),
    check: /** @type {jest.Mock} */ (check),
    request: /** @type {jest.Mock} */ (request)
};

describe('[Class] Consent', () => {
    /** @type {Consent} */
    let consent;
    /** @type {{ AddLog: jest.Mock }} */
    let logger;
    /** @type {jest.Mock} */
    let saveLocal;
    /** @type {jest.SpyInstance} */
    let alertSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        setPlatform('android');
        setDev(true);

        // Defaults: outside the EEA, consent already handled, tracking granted
        mocked.gatherConsent.mockResolvedValue(info({ privacyOptionsRequirementStatus: 'NOT_REQUIRED' }));
        mocked.requestInfoUpdate.mockResolvedValue(info({ privacyOptionsRequirementStatus: 'NOT_REQUIRED' }));
        mocked.getConsentInfo.mockResolvedValue(info({ privacyOptionsRequirementStatus: 'NOT_REQUIRED' }));
        mocked.showPrivacyOptionsForm.mockResolvedValue(info());
        mocked.loadAndShowConsentFormIfRequired.mockResolvedValue(info());
        mocked.getGdprApplies.mockResolvedValue(false);
        mocked.getPurposeConsents.mockResolvedValue('');
        mocked.getUserChoices.mockResolvedValue(ACCEPTED_CHOICES);
        mocked.check.mockResolvedValue(RESULTS.GRANTED);
        mocked.request.mockResolvedValue(RESULTS.GRANTED);

        logger = { AddLog: jest.fn() };
        saveLocal = jest.fn(async () => {});
        alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        consent = new Consent(/** @type {any} */ ({ interface: { console: logger }, SaveLocal: saveLocal }));
    });

    afterEach(() => {
        alertSpy.mockRestore();
    });

    describe('Initialize (startup)', () => {
        it('should show the form, allow personalized ads and init the SDK when an EEA user accepts', async () => {
            mocked.getGdprApplies.mockResolvedValue(true);

            const result = await consent.Initialize();

            expect(result).toBe('ok');
            expect(mocked.gatherConsent).toHaveBeenCalledTimes(1);
            expect(consent.android_consent.nonPersonalized).toBe(false);
            expect(consent.isPersonalized()).toBe(true);
            expect(consent.canRequestAds).toBe(true);
            expect(mockInitialize).toHaveBeenCalledTimes(1);
            expect(mocked.gatherConsent.mock.invocationCallOrder[0]).toBeLessThan(
                mockInitialize.mock.invocationCallOrder[0]
            );
            expect(saveLocal).toHaveBeenCalledTimes(1);
        });

        it('should force non personalized ads when an EEA user declines', async () => {
            mocked.getGdprApplies.mockResolvedValue(true);
            mocked.getUserChoices.mockResolvedValue({
                storeAndAccessInformationOnDevice: true,
                selectPersonalisedAds: false
            });

            await consent.Initialize();

            expect(consent.android_consent.nonPersonalized).toBe(true);
            expect(consent.isPersonalized()).toBe(false);
            // Non personalized ads are still allowed
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        it('should allow personalized ads without any form outside the GDPR area', async () => {
            const result = await consent.Initialize();

            expect(result).toBe('not-needed');
            expect(consent.android_consent.nonPersonalized).toBe(false);
            expect(mocked.getUserChoices).not.toHaveBeenCalled();
            expect(mockInitialize).toHaveBeenCalledTimes(1);
        });

        it('should keep the previous choices and still init the SDK when the consent request fails', async () => {
            consent.Load({ android_consent: { nonPersonalized: false, version: '1.0.0' } });
            mocked.gatherConsent.mockRejectedValue(new Error('network'));

            const result = await consent.Initialize();

            expect(result).toBe('error');
            expect(consent.android_consent).toEqual({ nonPersonalized: false, version: '1.0.0' });
            // canRequestAds comes from the previous session (getConsentInfo)
            expect(mockInitialize).toHaveBeenCalledTimes(1);
            expect(consent.loading).toBe(false);
        });

        it('should not init the SDK nor ask for tracking while ad requests are not allowed', async () => {
            setPlatform('ios');
            mocked.gatherConsent.mockRejectedValue(new Error('network'));
            mocked.getConsentInfo.mockResolvedValue(info({ status: 'REQUIRED', canRequestAds: false }));

            await consent.Initialize();

            expect(consent.canRequestAds).toBe(false);
            expect(mockInitialize).not.toHaveBeenCalled();
            expect(mocked.request).not.toHaveBeenCalled();
        });

        it('should force the EEA geography in development builds only', async () => {
            await consent.Initialize();
            expect(mocked.gatherConsent).toHaveBeenLastCalledWith({ debugGeography: 1, testDeviceIdentifiers: [] });

            setDev(false);
            await consent.Initialize();
            expect(mocked.gatherConsent).toHaveBeenLastCalledWith({});
        });

        it('should return loading while another call is running', async () => {
            const first = consent.Initialize();
            const second = await consent.Initialize();

            expect(second).toBe('loading');
            expect(await first).toBe('not-needed');
        });
    });

    describe('RequestTracking (iOS ATT)', () => {
        beforeEach(() => setPlatform('ios'));

        it('should prompt once and enable tracking when the user grants it', async () => {
            mocked.check.mockResolvedValue(RESULTS.DENIED);
            mocked.request.mockResolvedValue(RESULTS.GRANTED);

            const result = await consent.Initialize();

            expect(result).toBe('not-needed');
            expect(mocked.request).toHaveBeenCalledTimes(1);
            expect(consent.ios_tracking.enabled).toBe(true);
            expect(consent.isPersonalized()).toBe(true);
            expect(alertSpy).not.toHaveBeenCalled();
        });

        it('should not prompt again once the user refused', async () => {
            mocked.check.mockResolvedValue(RESULTS.BLOCKED);

            await consent.Initialize();

            expect(mocked.request).not.toHaveBeenCalled();
            expect(consent.ios_tracking.enabled).toBe(false);
            expect(consent.isPersonalized()).toBe(false);
            expect(alertSpy).not.toHaveBeenCalled();
        });

        it('should not prompt when GDPR applies and purpose 1 was refused', async () => {
            mocked.getGdprApplies.mockResolvedValue(true);
            mocked.getPurposeConsents.mockResolvedValue('0111');
            mocked.check.mockResolvedValue(RESULTS.DENIED);

            await consent.Initialize();

            expect(mocked.request).not.toHaveBeenCalled();
            expect(consent.ios_tracking.enabled).toBe(false);
        });

        it('should prompt when GDPR applies and purpose 1 was accepted', async () => {
            mocked.getGdprApplies.mockResolvedValue(true);
            mocked.getPurposeConsents.mockResolvedValue('1111');
            mocked.check.mockResolvedValue(RESULTS.DENIED);

            await consent.Initialize();

            expect(mocked.request).toHaveBeenCalledTimes(1);
            expect(consent.ios_tracking.enabled).toBe(true);
        });

        it('should refuse personalized ads on iOS when GDPR choices deny them, even with tracking granted', async () => {
            mocked.getGdprApplies.mockResolvedValue(true);
            mocked.getPurposeConsents.mockResolvedValue('1111');
            mocked.getUserChoices.mockResolvedValue({
                storeAndAccessInformationOnDevice: true,
                selectPersonalisedAds: false
            });

            await consent.Initialize();

            expect(consent.ios_tracking.enabled).toBe(true);
            expect(consent.isPersonalized()).toBe(false);
        });

        it('should report unavailable on iOS versions without ATT', async () => {
            mocked.check.mockResolvedValue(RESULTS.UNAVAILABLE);

            expect(await consent.RequestTracking()).toBe('not-available');
            expect(mocked.request).not.toHaveBeenCalled();
            expect(consent.ios_tracking.enabled).toBe(false);
        });
    });

    describe('OpenPrivacyOptions (settings button)', () => {
        it('should open the privacy options form when Google requires it', async () => {
            mocked.requestInfoUpdate.mockResolvedValue(info({ privacyOptionsRequirementStatus: 'REQUIRED' }));
            mocked.getGdprApplies.mockResolvedValue(true);

            const result = await consent.OpenPrivacyOptions();

            expect(result).toBe('ok');
            expect(mocked.showPrivacyOptionsForm).toHaveBeenCalledTimes(1);
            expect(consent.privacyOptionsRequired).toBe(true);
            expect(consent.android_consent.nonPersonalized).toBe(false);
            expect(saveLocal).toHaveBeenCalledTimes(1);
        });

        it('should show the initial form when it was never completed', async () => {
            mocked.requestInfoUpdate.mockResolvedValue(
                info({ status: 'REQUIRED', canRequestAds: false, privacyOptionsRequirementStatus: 'UNKNOWN' })
            );

            const result = await consent.OpenPrivacyOptions();

            expect(result).toBe('ok');
            expect(mocked.loadAndShowConsentFormIfRequired).toHaveBeenCalledTimes(1);
            expect(mocked.showPrivacyOptionsForm).not.toHaveBeenCalled();
            expect(consent.canRequestAds).toBe(true);
        });

        it('should report not available outside the GDPR area on Android', async () => {
            const result = await consent.OpenPrivacyOptions();

            expect(result).toBe('not-available');
            expect(mocked.showPrivacyOptionsForm).not.toHaveBeenCalled();
            expect(mocked.loadAndShowConsentFormIfRequired).not.toHaveBeenCalled();
        });

        it('should send the iOS user to the system settings once tracking was refused', async () => {
            setPlatform('ios');
            mocked.check.mockResolvedValue(RESULTS.BLOCKED);

            const result = await consent.OpenPrivacyOptions();

            expect(result).toBe('ok');
            expect(alertSpy).toHaveBeenCalledTimes(1);
            expect(mocked.request).not.toHaveBeenCalled();
        });

        it('should prompt for tracking on iOS when it was never asked', async () => {
            setPlatform('ios');
            mocked.check.mockResolvedValue(RESULTS.DENIED);
            mocked.request.mockResolvedValue(RESULTS.GRANTED);

            const result = await consent.OpenPrivacyOptions();

            expect(result).toBe('ok');
            expect(mocked.request).toHaveBeenCalledTimes(1);
            expect(consent.ios_tracking.enabled).toBe(true);
            expect(alertSpy).not.toHaveBeenCalled();
        });

        it('should return error and release the lock when the SDK throws', async () => {
            mocked.requestInfoUpdate.mockRejectedValue(new Error('boom'));

            expect(await consent.OpenPrivacyOptions()).toBe('error');
            expect(consent.loading).toBe(false);
        });
    });

    describe('Save / Load', () => {
        it('should persist both choices with the unchanged shape', () => {
            consent.Load({
                android_consent: { nonPersonalized: false, version: '1.2.3' },
                ios_tracking: { enabled: true, version: '1.2.3' }
            });

            expect(consent.Save()).toEqual({
                android_consent: { nonPersonalized: false, version: '1.2.3' },
                ios_tracking: { enabled: true, version: '1.2.3' }
            });
        });
    });
});
