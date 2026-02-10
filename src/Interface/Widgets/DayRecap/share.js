import { Platform, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native-view-shot').default} ViewShot
 */

/**
 * Capture the view as an image
 * @param {React.RefObject<ViewShot | null>} viewShotRef
 * @param {(capturing: boolean) => void} setCapturing
 * @returns {Promise<string | null>} URI of the captured image
 */
export const captureImage = async (viewShotRef, setCapturing) => {
    const viewShot = viewShotRef.current;
    if (!viewShot || typeof viewShot.capture !== 'function') {
        return null;
    }

    try {
        setCapturing(true);

        const uri = await viewShot.capture();
        return uri;
    } catch (error) {
        console.error('[DayRecap] Capture error:', error);
        return null;
    } finally {
        setCapturing(false);
    }
};

/**
 * Request permission to save to gallery (Android only)
 * @returns {Promise<boolean>}
 */
export const requestSavePermission = async () => {
    if (Platform.OS !== 'android') {
        return true;
    }

    // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE for media
    if (Platform.Version >= 33) {
        return true;
    }

    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: 'Permission requise',
            message: "GameLife a besoin d'accéder à votre galerie pour sauvegarder l'image",
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK'
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.error('[DayRecap] Permission error:', err);
        return false;
    }
};

/**
 * Save the recap image to the device gallery
 * @param {React.RefObject<ViewShot | null>} viewShotRef
 * @param {(capturing: boolean) => void} setCapturing
 * @param {(saving: boolean) => void} setSaving
 */
export const saveToGallery = async (viewShotRef, setCapturing, setSaving) => {
    const langRecap = langManager.curr['calendar']?.['recap'] || {};

    const hasPermission = await requestSavePermission();
    if (!hasPermission) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langRecap['permission-denied-title'] || 'Permission denied',
                message: langRecap['permission-denied-message'] || 'Cannot save without permission'
            }
        });
        return;
    }

    setSaving(true);

    try {
        const uri = await captureImage(viewShotRef, setCapturing);
        if (!uri) {
            throw new Error('Failed to capture image');
        }

        await CameraRoll.save(uri, { type: 'photo', album: 'GameLife' });

        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langRecap['saved-title'] || 'Saved!',
                message: langRecap['saved-message'] || 'Image has been saved to your gallery'
            }
        });
    } catch (error) {
        console.error('[DayRecap] Save error:', error);
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langRecap['error-title'] || 'Error',
                message: langRecap['error-message'] || 'Failed to save image'
            }
        });
    } finally {
        setSaving(false);
    }
};

/**
 * Share the recap image to social media or other apps
 * @param {React.RefObject<ViewShot | null>} viewShotRef
 * @param {(capturing: boolean) => void} setCapturing
 * @param {(sharing: boolean) => void} setSharing
 * @param {'instagram' | 'instagram-stories' | 'general'} [target='general']
 */
export const shareImage = async (viewShotRef, setCapturing, setSharing, target = 'general') => {
    setSharing(true);

    try {
        const uri = await captureImage(viewShotRef, setCapturing);
        if (!uri) {
            throw new Error('Failed to capture image');
        }

        /** @type {import('react-native-share').ShareOptions} */
        const shareOptions = {
            url: uri,
            type: 'image/png',
            failOnCancel: false
        };

        if (target === 'instagram-stories') {
            // Share to Instagram Stories
            await Share.shareSingle({
                ...shareOptions,
                social: /** @type {any} */ (Share.Social.INSTAGRAM_STORIES),
                backgroundBottomColor: '#1a1a2e',
                backgroundTopColor: '#16213e'
            });
        } else if (target === 'instagram') {
            // Share to Instagram Feed
            await Share.shareSingle({
                ...shareOptions,
                social: /** @type {any} */ (Share.Social.INSTAGRAM)
            });
        } else {
            // General share sheet
            await Share.open(shareOptions);
        }
    } catch (error) {
        // User cancelled - not an error
        const err = /** @type {Error | null} */ (error);
        if (err?.message?.includes('cancel')) {
            return;
        }
        console.error('[DayRecap] Share error:', error);
    } finally {
        setSharing(false);
    }
};
