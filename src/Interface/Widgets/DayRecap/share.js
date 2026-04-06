import { Platform, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import langManager from 'Managers/LangManager';

/**
 * @typedef {import('react-native-view-shot').default} ViewShot
 * @typedef {import('react-native-share').ShareOptions} ShareOptions
 * @typedef {import('react-native-share').ShareSingleOptions} ShareSingleOptions
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
        const langPerm = langManager.curr['calendar']?.['recap']?.['permission-stockage'] || {};
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: langPerm['title'] || 'Permission required',
            message: langPerm['message'] || 'GameLife needs access to the gallery to save the daily recap.',
            buttonNeutral: langPerm['button-neutral'] || 'Later',
            buttonNegative: langPerm['button-negative'] || 'Cancel',
            buttonPositive: langPerm['button-positive'] || 'OK'
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (_err) {
        return false;
    }
};

/**
 * Save the recap image to the device gallery
 * @param {React.RefObject<ViewShot | null>} viewShotRef
 * @param {(capturing: boolean) => void} setCapturing
 * @returns {Promise<boolean>} True if saved successfully, false otherwise
 */
export const saveToGallery = async (viewShotRef, setCapturing) => {
    const hasPermission = await requestSavePermission();
    if (!hasPermission) {
        return false;
    }

    try {
        const uri = await captureImage(viewShotRef, setCapturing);
        if (!uri) {
            return false;
        }

        // Ensure proper file:// prefix for iOS
        const fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;

        // Add small delay to ensure the file is fully written
        await new Promise((resolve) => setTimeout(resolve, 100));

        await CameraRoll.save(fileUri, { type: 'photo' });
        return true;
    } catch (_error) {
        return false;
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

        /** @type {ShareOptions} */
        const shareOptions = {
            url: uri,
            type: 'image/png',
            failOnCancel: false
        };

        if (target === 'instagram-stories') {
            // Share to Instagram Stories
            await Share.shareSingle(
                /** @type {ShareSingleOptions} */ ({
                    ...shareOptions,
                    social: Share.Social.INSTAGRAM_STORIES,
                    backgroundBottomColor: '#1a1a2e',
                    backgroundTopColor: '#16213e'
                })
            );
        } else if (target === 'instagram') {
            // Share to Instagram Feed
            await Share.shareSingle(
                /** @type {ShareSingleOptions} */ ({
                    ...shareOptions,
                    social: Share.Social.INSTAGRAM
                })
            );
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
    } finally {
        setSharing(false);
    }
};
