import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import ZapGPTBack from './back';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Text, InputText, Button, Separator } from 'Interface/Components';
import { GetFullDate } from 'Utils/Date';
import { GetDate, TimeToFormatString } from 'Utils/Time';
import { renderNoRemaining, renderNotBuyed, renderNotConnected } from './render';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('react-native').ListRenderItemInfo<Activity>} ListRenderItemInfo
 */

class ZapGPT extends ZapGPTBack {
    render() {
        const lang = langManager.curr['zap-gpt'];
        const { data, tcpState, text, loading, error } = this.state;
        const { zapGPT } = user.informations;

        // Show data validation
        if (data !== null) {
            return this.renderData();
        }

        // Not connected
        if (tcpState !== 'connected') {
            return renderNotConnected();
        }

        // Not buyed
        if (user.informations.purchasedCount < 1) {
            return renderNotBuyed(this.props.onChangePage);
        }

        // Not attempts
        if (zapGPT.remaining <= 0) {
            return renderNoRemaining();
        }

        const placeholder = ` (${zapGPT.remaining}/${zapGPT.total} ${lang['remaining-text']})`;
        return (
            <View style={styles.panel}>
                <Text style={styles.title} fontSize={24}>
                    {lang['title1']}
                </Text>

                <View style={styles.texts}>
                    {lang['instructions'].map((_text, index) => (
                        <Text key={`instruction-${index}`} style={styles.text}>
                            {_text}
                        </Text>
                    ))}
                </View>

                {/* InputText */}
                <View style={styles.input}>
                    <InputText
                        label={lang['input-label'] + placeholder}
                        value={text}
                        onChangeText={this.onChangeText}
                        maxLength={1024}
                        enabled={!loading}
                    />
                    {error !== null && <Text color='error'>{error}</Text>}
                </View>

                {/* Buttons */}
                <View style={styles.buttons}>
                    <Button
                        style={styles.buttonAsk}
                        color='main1'
                        icon='check'
                        onPress={this.ZapGPThandler}
                        loading={loading}
                    />
                </View>
            </View>
        );
    }

    renderData() {
        const lang = langManager.curr['zap-gpt'];
        const { data } = this.state;

        return (
            <View style={styles.panel}>
                <Text style={styles.title} fontSize={24}>
                    {lang['title2']}
                </Text>

                <View style={styles.flatlistView}>
                    <FlatList
                        data={data}
                        renderItem={this.renderActivity}
                        keyExtractor={(item, index) => `${item.startTime}-${item.skillID}-${item.duration}-${index}`}
                        ItemSeparatorComponent={() => <Separator style={styles.separator} />}
                    />
                </View>

                <View style={styles.buttons2}>
                    <Button style={styles.buttonBack} color='danger' icon='cross' onPress={this.Reset} />
                    <Button style={styles.buttonRetry} color='backgroundDark' icon='retry' onPress={this.Retry} />
                    <Button style={styles.buttonValidate} color='success' icon='check' onPress={this.Validate} />
                </View>
            </View>
        );
    }

    /** @param {ListRenderItemInfo} param0 */
    renderActivity = ({ item, index }) => {
        const lang = langManager.curr['dates']['names'];

        const skill = dataManager.skills.GetByID(item.skillID);
        if (skill === null) {
            return null;
        }

        const skillName = langManager.GetText(skill.Name) || item.skillID.toString();
        const skillDate = GetFullDate(GetDate(item.startTime));
        const skillStart = TimeToFormatString(item.startTime + item.timezone * 3600);
        const skillDuration = TimeToFormatString(item.duration * 60);
        const onRemove = () => this.RemoveActivity(index);

        return (
            <View style={styles.item}>
                <View style={styles.itemText}>
                    <Text>{skillName}</Text>
                    <Text>{skillDate}</Text>
                    <Text>{`${lang['start-time']}: ${skillStart}, ${lang['duration']}: ${skillDuration}`}</Text>
                </View>

                <Button style={styles.itemRemove} color='danger' icon='trash' iconSize={16} onPress={onRemove} />
            </View>
        );
    };
}

export default ZapGPT;
