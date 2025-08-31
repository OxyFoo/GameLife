import Crypto from 'crypto-js';
import { Platform } from 'react-native';
import * as AppAttest from 'react-native-ios-appattest';
import PlayIntegrity from 'react-native-google-play-integrity';

import user from 'Managers/UserManager';

import { SerializeError } from 'Utils/Types';

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
            user.interface.console?.AddLog('error', '[GetIntegrityToken] Play Integrity error', SerializeError(e));
            return 'error';
        }
    }

    // iOS - App Attest
    else if (Platform.OS === 'ios') {
        if (!AppAttest || typeof AppAttest.attestationSupported !== 'function') {
            user.interface.console?.AddLog('error', '[GetIntegrityToken] App Attest not available');
            return 'unsupported';
        }

        try {
            const supported = await AppAttest.attestationSupported();
            if (!supported) {
                user.interface.console?.AddLog('error', '[GetIntegrityToken] App Attest not supported');
                return 'unsupported';
            }
        } catch (e) {
            user.interface.console?.AddLog(
                'error',
                'App Attest support check error - Error details:',
                SerializeError(e)
            );
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
            user.interface.console?.AddLog('error', 'App Attest request error - Error details:', SerializeError(e));
            return 'error';
        }
    }

    // Other platforms - Not supported
    else {
        user.interface.console?.AddLog('error', '[GetIntegrityToken] Unsupported platform');
        return 'error';
    }
}
