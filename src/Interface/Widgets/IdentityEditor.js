import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { Text, Button } from '../Components';
import { GetAge, GetTime } from '../../Utils/Time';

class IdentityEditor extends React.PureComponent {
    state = {
        stateDTP: ''
    }

    Open = () => {
        user.interface.popup.ForceOpen('custom', this.popupRender.bind(this), undefined, true);
    }
    Close = () => {
        user.interface.popup.Close();
    }

    OpenNowifiPopup = () => {
        const title = langManager.curr['identity']['alert-nowifi-title'];
        const text = langManager.curr['identity']['alert-nowifi-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
    }

    dtpOpen = () => {
        const lang = langManager.curr['identity'];
        const info = user.informations.GetInfoToChangeBirthtime();

        // Try to change too early
        if (info.remain > 0) {
            const title = lang['alert-birthtimewait-title'];
            const text = lang['alert-birthtimewait-text'].replace('{}', info.remain);
            user.interface.popup.ForceOpen('ok', [ title, text ], this.Open, false);
            return;
        }

        // Confirmation before changing age
        const title = lang['alert-birthtimewarning-title'];
        const text = lang['alert-birthtimewarning-text'].replace('{}', info.total);
        const checkedChangeAge = () => {
            this.setState({ stateDTP: 'date' });
            this.Open();
        };
        user.interface.popup.ForceOpen('ok', [ title, text ], checkedChangeAge, false);
    }
    dtpSelect = (date) => {
        const lang = langManager.curr['identity'];
        this.dtpClose();
        const setBirthTime = (bt, time) => {
            if (bt === 'yes') user.informations.SetBirthTime(time);
            this.Open();
        }

        // Confirmation after changing age
        const time = GetTime(date);
        const age = GetAge(time);
        const title = lang['alert-birthconfirm-title'];
        const text = lang['alert-birthconfirm-text'].replace('{}', age);
        user.interface.popup.ForceOpen('yesno', [ title, text ], (bt) => setBirthTime(bt, time), false);
    }
    dtpClose = () => {
        this.setState({ stateDTP: '' });
    }

    openUsername = () => {
        const lang = langManager.curr['identity'];
        user.interface.screenInput.Open(lang['input-username'], user.informations.username, this.onChangeUsername);
        this.Open();
    }
    onChangeUsername = async (username) => {
        const lang = langManager.curr['identity'];
        if (!username.length || username === user.informations.username) return;
        const state = await user.informations.SetUsername(username);

        if (state === 'alreadyUsed') {
            const title = lang['alert-alreadyUsed-title'];
            const text = lang['alert-alreadyUsed-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], this.openUsername);
        } else if (state === 'alreadyChanged') {
            const info = this.GetInfoToChangeUsername();
            const title = lang['alert-alreadyChanged-title'];
            const text = lang['alert-alreadyChanged-text'].replace('{}', info.remain).replace('{}', info.remain);
            user.interface.popup.ForceOpen('ok', [ title, text ], this.Open);
        } else if (state === 'incorrect') {
            const title = lang['alert-incorrect-title'];
            const text = lang['alert-incorrect-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], this.openUsername);
        } else if (state === 'error') {
            const title = lang['alert-error-title'];
            const text = lang['alert-error-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], this.openUsername);
        }
    }

    popupRender() {
        const lang = langManager.curr['identity'];

        // Username
        const usernameEdit = async () => {
            if (user.server.IsConnected()) {
                const info = user.informations.GetInfoToChangeUsername();
                if (user.informations.usernameTime !== null && info.remain > 0) {
                    // Username already changed
                    const title = lang['alert-alreadyChanged-title'];
                    const text = lang['alert-alreadyChanged-text'].replace('{}', info.remain);
                    user.interface.popup.ForceOpen('ok', [ title, text ], this.Open, false);
                    return;
                }

                // Warning to change username
                const title = lang['alert-usernamewarning-title'];
                const text = lang['alert-usernamewarning-text'].replace('{}', info.total).replace('{}', info.total);
                user.interface.popup.ForceOpen('ok', [ title, text ], this.openUsername, false);
            } else {
                this.OpenNowifiPopup();
            }
        }

        // Title
        const availableTitles = user.informations.GetUnlockTitles();
        const listTitle = lang['input-select-title'];
        const onChangeTitle = () => user.interface.screenList.Open(listTitle, availableTitles, user.informations.SetTitle);
        const titleTxt = user.informations.title === 0 ? lang['value-title-empty'] : dataManager.GetText(dataManager.titles.GetTitleByID(user.informations.title).Name);

        // Age
        const age = user.informations.GetAge();
        const ageText = age === null ? lang['value-age-empty'] : lang['value-age'].replace('{}', age);

        return (
            <View style={styles.popup}>
                <Text style={styles.popupTitle}>{lang['edit-title']}</Text>

                <View style={styles.popupRow}>
                    <Text containerStyle={styles.popupText} style={{ textAlign: 'left' }}>{user.informations.username}</Text>
                    <Button style={styles.popupButtonEdit} onPress={usernameEdit} fontSize={12} color='main1'>{lang['input-edit']}</Button>
                </View>

                <View style={styles.popupRow}>
                    <Text containerStyle={styles.popupText} style={{ textAlign: 'left' }}>{titleTxt}</Text>
                    <Button style={styles.popupButtonEdit} onPress={onChangeTitle} fontSize={12} color='main1'>{lang['input-edit']}</Button>
                </View>

                <View style={styles.popupRow}>
                    <Text containerStyle={styles.popupText} style={{ textAlign: 'left' }}>{ageText}</Text>
                    <Button style={styles.popupButtonEdit} onPress={this.dtpOpen} fontSize={12} color='main1'>{lang['input-edit']}</Button>
                </View>

                <Button style={styles.popupButtonCancel} fontSize={14} onPress={this.Close}>{lang['edit-cancel']}</Button>
            </View>
        );
    }

    render() {
        const lang = langManager.curr['identity'];
        const dtpStartDate = new Date(2000, 0, 1, 0, 0, 0, 0);
        const dtpTopDate = new Date(); dtpTopDate.setFullYear(dtpTopDate.getFullYear() - 6);
        const dtpBottomDate = new Date(); dtpBottomDate.setFullYear(dtpBottomDate.getFullYear() - 120);

        return (
            <DateTimePickerModal
                date={dtpStartDate}
                maximumDate={dtpTopDate}
                minimumDate={dtpBottomDate}
                mode={this.state.stateDTP}
                headerTextIOS={lang['input-select-age']}
                onConfirm={this.dtpSelect}
                onCancel={this.dtpClose}
                isVisible={this.state.stateDTP != ''}
            />
        );
    }
}

const styles = StyleSheet.create({
    popup: {
        paddingVertical: '5%',
        paddingHorizontal: '2%'
    },
    popupRow: {
        marginHorizontal: '5%',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    popupTitle: {
        marginTop: 12,
        marginBottom: 24,
        fontSize: 20
    },
    popupText: {
        width: '60%'
    },
    popupButtonCancel: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 0
    },
    popupButtonEdit: {
        width: '35%',
        height: 38,
        borderRadius: 8,
        paddingHorizontal: 0
    }
});

export default IdentityEditor;