import * as React from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './style';
import BackProfileEditor from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

class ProfileEditor extends BackProfileEditor {
    render() {
        const lang = langManager.curr['profile'];
        const { username, title, age, stateDTP } = this.state;

        // Date Time Picker
        const dtpStartDate = new Date(2000, 0, 1, 0, 0, 0, 0);
        const dtpTopDate = new Date();
        dtpTopDate.setFullYear(dtpTopDate.getFullYear() - 6);
        const dtpBottomDate = new Date();
        dtpBottomDate.setFullYear(dtpBottomDate.getFullYear() - 120);

        return (
            <View style={styles.popup}>
                <Text style={styles.title}>{lang['edit-title']}</Text>

                <View style={styles.rowMail}>
                    <Text style={styles.textMail} color='secondary'>
                        {lang['title-mail']}
                    </Text>
                    <Text style={styles.textMail}>{user.settings.email}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.text}>{username}</Text>
                    <Button style={styles.buttonEdit} onPress={this.handleChangeUsername} fontSize={12} color='main1'>
                        {lang['input-edit']}
                    </Button>
                </View>

                <View style={styles.row}>
                    <Text style={styles.text}>{title}</Text>
                    <Button style={styles.buttonEdit} onPress={this.handleChangeTitle} fontSize={12} color='main1'>
                        {lang['input-edit']}
                    </Button>
                </View>

                <View style={styles.row}>
                    <Text style={styles.text}>{age}</Text>
                    <Button style={styles.buttonEdit} onPress={this.handleChangeBirthtime} fontSize={12} color='main1'>
                        {lang['input-edit']}
                    </Button>
                </View>

                <Button style={styles.buttonCancel} fontSize={14} onPress={this.onClosePress}>
                    {lang['edit-cancel']}
                </Button>

                <DateTimePickerModal
                    date={dtpStartDate}
                    mode={stateDTP || 'date'}
                    onConfirm={this.dtpSelect}
                    onCancel={this.dtpClose}
                    maximumDate={dtpTopDate}
                    minimumDate={dtpBottomDate}
                    isVisible={stateDTP !== ''}
                    is24Hour={true}
                />
            </View>
        );
    }
}

export { ProfileEditor };
