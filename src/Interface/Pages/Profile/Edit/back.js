import * as React from 'react';

import TitlesView from './titles';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetAge, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native-modal-datetime-picker').default} DateTimePickerModal
 *
 * @typedef {object} TitleItem
 * @property {number} id
 * @property {string} text
 */

class BackProfileEditor extends React.PureComponent {
    state = {
        username: user.informations.username.Get(),
        title: langManager.curr['profile']['value-title-empty'],
        age: langManager.curr['profile']['value-age-empty'],

        /** @type {'' | 'date' | 'time' | 'datetime'} */
        stateDTP: ''
    };

    /** @param {any} props */
    constructor(props) {
        super(props);

        const titleID = user.informations.title.Get();
        if (titleID !== 0) {
            const title = dataManager.titles.GetByID(titleID);
            if (title !== null) {
                this.state.title = langManager.GetText(title.Name);
            }
        }

        const age = user.informations.GetAge();
        if (age !== null) {
            this.state.age = langManager.curr['profile']['value-age'].replace('{}', age.toString());
        }
    }

    OpenNowifiPopup = () => {
        const lang = langManager.curr['profile'];

        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-nowifi-title'],
                message: lang['alert-nowifi-message']
            },
            priority: true
        });
    };

    handleChangeUsername = async () => {
        const lang = langManager.curr['profile'];

        if (!user.server2.IsAuthenticated()) {
            this.OpenNowifiPopup();
            return;
        }

        const info = user.informations.GetInfoToChangeUsername();
        if (user.informations.usernameTime !== null && info.remain > 0) {
            // Username already changed
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-alreadyChanged-title'],
                    message: lang['alert-alreadyChanged-message'].replace('{}', info.remain.toString())
                },
                priority: true
            });
            return;
        }

        // Warning to change username
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-usernamewarning-title'],
                message: lang['alert-usernamewarning-message'].replace('{}', info.total.toString())
            },
            callback: this.openUsernamePopup,
            priority: true
        });
    };

    handleChangeTitle = () => {
        const lang = langManager.curr['profile'];

        /** @type {TitleItem[]} */
        const userTitlesItems = [
            // Option to unselect title
            {
                id: 0,
                text: lang['input-title-none']
            },

            // User titles
            ...user.inventory.GetTitles().map((title) => ({
                id: title.ID,
                text: langManager.GetText(title.Name)
            }))
        ];

        if (userTitlesItems.length <= 1) {
            // No titles available
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-emptytitle-title'],
                    message: lang['alert-emptytitle-message']
                },
                priority: true
            });
            return;
        }

        user.interface.bottomPanel?.Open({
            content: <TitlesView items={userTitlesItems} onTitleSelected={this.setTitle} />,
            maxPosY: user.interface.size.height * 0.6,
            zIndex: 100
        });
    };

    handleChangeBirthtime = () => {
        const lang = langManager.curr['profile'];
        const info = user.informations.GetInfoToChangeBirthtime();

        // Try to change too early
        if (info.remain > 0) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-birthtimewait-title'],
                    message: lang['alert-birthtimewait-message'].replace('{}', info.remain.toString())
                },
                priority: true
            });
            return;
        }

        // Confirmation before changing age
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-birthtimewarning-title'],
                message: lang['alert-birthtimewarning-message'].replace('{}', info.total.toString())
            },
            callback: this.dtpOpen,
            priority: true
        });
    };

    dtpOpen = () => {
        this.setState({ stateDTP: 'date' });
    };

    /** @type {DateTimePickerModal['props']['onConfirm']} */
    dtpSelect = (date) => {
        const lang = langManager.curr['profile'];
        this.dtpClose();

        // Confirmation after changing age
        const time = GetGlobalTime(date);
        const age = GetAge(time);
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-birthconfirm-title'],
                message: lang['alert-birthconfirm-message'].replace('{}', age.toString())
            },
            callback: (bt) => {
                if (bt === 'yes') {
                    user.informations.SetBirthTime(time);

                    const newAge = user.informations.GetAge();
                    if (newAge !== null) {
                        this.setState({
                            age: lang['value-age'].replace('{}', newAge.toString())
                        });
                    }
                }
            },
            priority: true
        });
    };

    dtpClose = () => {
        this.setState({ stateDTP: '' });
    };

    openUsernamePopup = () => {
        const lang = langManager.curr['profile'];
        user.interface.screenInput?.Open({
            label: lang['input-username'],
            initialText: user.informations.username.Get(),
            callback: this.onChangeUsername
        });
    };

    /**
     * @param {string | null} username
     * @param {boolean} [confirmed]
     */
    onChangeUsername = async (username, confirmed = false) => {
        const lang = langManager.curr['profile'];

        if (username === null) return;

        if (!username.length || username === user.informations.username.Get()) return;
        const state = await user.informations.SetUsername(username, confirmed);

        // Manage errors
        if (state === 'usernameIsAlreadyUsed') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-alreadyUsed-title'],
                    message: lang['alert-alreadyUsed-message']
                },
                callback: this.openUsernamePopup,
                priority: true
            });
            return;
        } else if (state === 'usernameIsAlreadyChanged') {
            const info = user.informations.GetInfoToChangeUsername();
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-alreadyChanged-title'],
                    message: lang['alert-alreadyChanged-message'].replace('{}', info.remain.toString())
                },
                priority: true
            });
            return;
        } else if (state === 'invalidUsername') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-incorrect-title'],
                    message: lang['alert-incorrect-message']
                },
                callback: this.openUsernamePopup,
                priority: true
            });
            return;
        } else if (state === 'okButNotConfirmed') {
            user.interface.popup?.OpenT({
                type: 'yesno',
                data: {
                    title: lang['alert-username-needconfirmation-title'],
                    message: lang['alert-username-needconfirmation-message'].replace('{}', username)
                },
                callback: (bt) => {
                    if (bt === 'yes') {
                        this.onChangeUsername(username, true);
                    }
                },
                priority: true
            });
            return;
        } else if (state === 'error' || state !== 'ok') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-error-title'],
                    message: lang['alert-error-message']
                },
                callback: this.openUsernamePopup,
                priority: true
            });
            return;
        }

        // Username changed
        this.setState({ username });
    };

    /** @param {number} id */
    setTitle = (id) => {
        const lang = langManager.curr['profile'];

        // Close bottom panel
        user.interface.bottomPanel?.Close();

        // Unselect title
        if (id === 0) {
            user.informations.SetTitle(0);
            this.setState({
                title: lang['value-title-empty']
            });
            return;
        }

        // Select title
        const title = dataManager.titles.GetByID(id);

        // Title not found
        if (title === null) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-titleerror-title'],
                    message: lang['alert-titleerror-message'].replace('{}', `ID: ${id}`)
                },
                priority: true
            });
            user.interface.console?.AddLog('error', `Title not found: ID ${id}`);
            return;
        }

        // Set title
        user.informations.SetTitle(id);
        this.setState({
            title: langManager.GetText(title.Name)
        });
    };

    onClosePress = () => {
        user.interface.popup?.Close();
    };
}

export default BackProfileEditor;
