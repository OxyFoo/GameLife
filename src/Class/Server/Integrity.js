import Crypto from 'crypto-js';
import { Platform } from 'react-native';
import AppAttest from 'react-native-ios-appattest';
import PlayIntegrity from 'react-native-google-play-integrity';

import user from 'Managers/UserManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types').IntegrityToken} IntegrityToken
 */

/**
 * Request integrity proof from device using Play Integrity API (Android) or App Attest (iOS).
 * @param {string} challenge Challenge to sign, used to generate the integrity token.
 * @returns {Promise<IntegrityToken | 'unsupported' | 'error'>}
 */
export async function GetIntegrityToken(challenge) {
    // Android - Play Integrity API
    if (Platform.OS === 'android') {
        const available = await PlayIntegrity.isPlayIntegrityAvailable();
        if (!available) {
            return 'unsupported';
        }

        try {
            // Classic request
            const nonce = challenge.slice(0, 32); // Use first 16 bytes of challenge as nonce
            const integrityToken = await PlayIntegrity.requestIntegrityToken(nonce);

            return {
                token: integrityToken,
                type: 'playIntegrity'
            };
        } catch (e) {
            console.error('[GetIntegrityToken] Play Integrity error', e);
            return 'error';
        }
    }

    // iOS - App Attest
    else if (Platform.OS === 'ios') {
        try {
            const supported = await AppAttest.attestationSupported();
            if (!supported) {
                return 'unsupported';
            }
        } catch (e) {
            user.interface.console?.AddLog('error', 'App Attest support check error - Error details:', {
                error: e
            });
            return 'unsupported';
        }

        // Generate or reuse key
        const keyId = await AppAttest.generateKeys();
        const hash = Crypto.SHA256(challenge).toString(Crypto.enc.Base64);

        try {
            // Request attestation
            const attestationObject = await AppAttest.attestKeys(keyId, hash);

            return {
                token: attestationObject,
                type: 'appAttest'
            };
        } catch (e) {
            user.interface.console?.AddLog('error', 'App Attest request error - Error details:', {
                error: e
            });
            return 'error';
        }
    }

    // Other platforms - Not supported
    else {
        return 'error';
    }
}
