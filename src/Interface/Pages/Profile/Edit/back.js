import * as React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetAge, GetGlobalTime } from 'Utils/Time';

/**
 * @typedef {import('react-native-modal-datetime-picker').default} DateTimePickerModal
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
            callback: this.openChangeUsernamePopup,
            priority: true
        });
    };

    handleChangeTitle = () => {
        const lang = langManager.curr['profile'];

        const emptyTitle = { id: 0, value: lang['input-title-none'] };
        const userTitles = user.inventory
            .GetTitles()
            .map((title) => ({ id: title.ID, value: langManager.GetText(title.Name) }));
        const availableTitles = [emptyTitle, ...userTitles];

        if (!userTitles.length) {
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

        user.interface.screenList?.Open(lang['input-select-title'], availableTitles, (id) => {
            user.informations.SetTitle(id);

            const title = dataManager.titles.GetByID(id);
            if (title === null) return;

            const newTitle = langManager.GetText(title.Name);
            this.setState({ title: newTitle });
        });
    };

    dtpOpen = () => {
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
        const title = lang['alert-birthtimewarning-title'];
        const message = lang['alert-birthtimewarning-message'].replace('{}', info.total.toString());
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message },
            callback: () => {
                this.setState({ stateDTP: 'date' });
            },
            priority: true
        });
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

    openChangeUsernamePopup = () => {
        const lang = langManager.curr['profile'];
        user.interface.screenInput?.Open({
            label: lang['input-username'],
            initialText: user.informations.username.Get(),
            callback: this.onChangeUsername
        });
    };

    /** @param {string | null} username */
    onChangeUsername = async (username) => {
        const lang = langManager.curr['profile'];

        if (username === null) return;

        if (!username.length || username === user.informations.username.Get()) return;
        const state = await user.informations.SetUsername(username);

        if (state === 'ok') {
            this.setState({ username });
        } else if (state === 'usernameIsAlreadyUsed') {
            const title = lang['alert-alreadyUsed-title'];
            const message = lang['alert-alreadyUsed-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: this.openChangeUsernamePopup,
                priority: true
            });
        } else if (state === 'usernameIsAlreadyChanged') {
            const info = user.informations.GetInfoToChangeUsername();
            const title = lang['alert-alreadyChanged-title'];
            const message = lang['alert-alreadyChanged-message'].replace('{}', info.remain.toString());
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                priority: true
            });
        } else if (state === 'invalidUsername') {
            const title = lang['alert-incorrect-title'];
            const message = lang['alert-incorrect-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: this.openChangeUsernamePopup,
                priority: true
            });
        } else if (state === 'error') {
            const title = lang['alert-error-title'];
            const message = lang['alert-error-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: this.openChangeUsernamePopup,
                priority: true
            });
        }
    };

    onClosePress = () => {
        user.interface.popup?.Close();
    };
}

export default BackProfileEditor;
