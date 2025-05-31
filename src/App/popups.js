import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { OpenStore } from 'Utils/Store';

/** @deprecated */
export function GoToErrorPage() {
    const lang = langManager.curr['login'];
    user.interface.ChangePage('display', {
        args: {
            icon: 'close-filled',
            text: lang['error-connection'],
            button: 'Retry',
            action: () => {
                user.interface.ChangePage('loading', { storeInHistory: false });
            }
        },
        storeInHistory: false
    });
}

/** @param {string} version */
export function showUpdatePopup(version) {
    const lang = langManager.curr['home'];

    user.interface.popup?.OpenT({
        type: 'ok',
        data: {
            title: lang['alert-update-title'],
            message: lang['alert-update-message'].replace('{}', version)
        },
        callback: () => {
            OpenStore().then(RNExitApp.exitApp);
        },
        cancelable: false
    });
}

export function showMaintenancePopup() {
    const lang = langManager.curr['home'];

    return new Promise((resolve) => {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-maintenance-title'],
                message: lang['alert-maintenance-message']
            },
            callback: resolve
        });
    });
}

/**
 * @description Show downgrade popup
 */
export async function showDowndatePopup() {
    const lang = langManager.curr['home'];

    return new Promise((resolve) => {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-newversion-title'],
                message: lang['alert-newversion-message']
            },
            callback: resolve
        });
    });
}

/**
 * @description Show a deleted account popup and redirect to the login page
 */
export function showDeletedAccountPopup() {
    const lang = langManager.curr['login'];
    user.interface.popup?.OpenT({
        type: 'ok',
        data: {
            title: lang['alert-deletedaccount-title'],
            message: lang['alert-deletedaccount-message']
        },
        callback: async () => {
            await user.Clear();
            user.interface.ChangePage('login', { storeInHistory: false });
        },
        cancelable: false
    });
}

/**
 * @description Show an error popup and redirect to the login page
 * @param {string} loggedState Error state
 */
export function showErrorPopup(loggedState = 'unknown') {
    const lang = langManager.curr['login'];

    user.interface.popup?.OpenT({
        type: 'ok',
        data: {
            title: lang['alert-error-title'],
            message: lang['alert-error-message'].replace('{}', loggedState)
        },
        callback: async () => {
            await user.Clear();
            user.interface.ChangePage('login', { storeInHistory: false });
        },
        cancelable: false
    });
}
