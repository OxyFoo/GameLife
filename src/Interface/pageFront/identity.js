import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import BackIdentity from '../PageBack/Identity';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, XPBar, Container, Input, ComboBox, Button } from '../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars } from '../Widgets';
import { GetAge, GetTime } from '../../Functions/Time';

class Identity extends BackIdentity {
    onAvatarPress = () => {
        user.interface.popup.Open('custom', this.renderPopupEdit, undefined, false, true);
    }

    onChangeDateTimePicker = (date) => {
        const YYYY = date.getFullYear();
        const MM = twoDigit(date.getMonth() + 1);
        const DD = twoDigit(date.getDate());
        const selectedDate = [ YYYY, MM, DD ].join('/');
        const age = this.calculateAge(selectedDate);
        
        if (age > 0) {
            this.hideDTP();
            this.setState({ birth: selectedDate });
        }
    }

    /**
     * Popup to edit user infos
     */
    renderPopupEdit = () => {
        const lang = langManager.curr['identity'];
        const [ input, setInput ] = React.useState(user.username);
        const [ title, setTitle ] = React.useState(user.title);
        const [ stateDTP, setStateDTP ] = React.useState('');
        const close = () => user.interface.popup.Close();

        // Title
        const availableTitles = dataManager.titles.titles.map(title => ({ id: title.ID, value: dataManager.GetText(title.Name) }));
        const onChangeTitle = (title) => setTitle(title !== null ? title.id : 0);
        const titleTxt = title === 0 ? '' : dataManager.GetText(dataManager.titles.GetTitleByID(title).Name)

        // Age
        const age = GetAge(user.birthTime);
        const ageText = age === null ? lang['value-age-empty'] : lang['value-age'].replace('{}', age);

        // Age edit
        const dtpStartDate = new Date(2000, 0, 1, 0, 0, 0, 0);
        const onChangeAge = (date) => { user.birthTime = GetTime(date); hideDTP(); };
        const showDTP = () => setStateDTP('date');
        const hideDTP = () => setStateDTP('');

        return (
            <>
                <View style={{ padding: '5%' }}>
                    <Text style={{ marginBottom: 24 }}>{lang['edit-title']}</Text>

                    <ComboBox
                        style={{ marginBottom: 24 }}
                        title={title === 0 ? lang['value-title-empty'] : lang['input-title']}
                        selectedValue={titleTxt}
                        data={availableTitles}
                        onSelect={onChangeTitle}
                        ignoreWarning={true}
                    />

                    <Input
                        style={{ marginBottom: 24 }}
                        label={lang['input-username']}
                        text={input}
                        onChangeText={setInput}
                    />

                    <View style={styles.popupInput}>
                        <Text containerStyle={{ width: '60%' }} style={{ textAlign: 'left' }}>{ageText}</Text>
                        <Button style={styles.popupButtonBirth} onPress={showDTP} fontSize={12} color='main1'>{lang['input-age']}</Button>
                    </View>

                    <View style={styles.popupButtons}>
                        <Button style={styles.popupButtonCancel} fontSize={14} onPress={close}>{lang['edit-cancel']}</Button>
                        <Button style={styles.popupButtonSave} fontSize={14} color='main1'>{lang['edit-save']}</Button>
                    </View>
                </View>

                <DateTimePickerModal
                    date={dtpStartDate}
                    mode={stateDTP}
                    headerTextIOS={lang['input-select-age']}
                    onConfirm={onChangeAge}
                    onCancel={hideDTP}
                    isVisible={stateDTP != ''}
                />
            </>
        );
    }

    render() {
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const headerOpacity = this.refAvatar === null ? 1 : this.refAvatar.state.editorAnim.interpolate(interReverse);
        const headerPointer = this.refAvatar === null ? 'auto' : (this.state.editorOpened ? 'none' : 'auto');

        const rowStyle = [styles.row, { borderColor: themeManager.GetColor('main1') }];
        const cellStyle = [styles.cell, { borderColor: themeManager.GetColor('main1') }];
        const row = (title, value) => (
            <View style={rowStyle}>
                <Text fontSize={14} containerStyle={cellStyle} style={{ textAlign: 'left' }}>{title}</Text>
                <Text fontSize={14} containerStyle={[cellStyle, { borderRightWidth: 0 }]} style={{ textAlign: 'left' }}>{value}</Text>
            </View>
        );

        return (
            <Page
                ref={ref => this.refPage = ref}
                scrollable={!this.state.editorOpened}
                canScrollOver={false}
                bottomOffset={0}
            >
                <PageHeader
                    style={{ marginBottom: 0 }}
                    onBackPress={this.onBack}
                />

                <Animated.View style={{ opacity: headerOpacity }} pointerEvents={headerPointer}>
                    <UserHeader
                        showAge={true}
                        onPress={this.onAvatarPress}
                    />

                    <Animated.View style={styles.xp}>
                        <View style={styles.xpRow}>
                            <Text>LVL X</Text>
                            <Text>BLABLA</Text>
                        </View>
                        <XPBar value={8} maxValue={10} />
                    </Animated.View>
                </Animated.View>

                <AvatarEditor
                    ref={ref => this.refAvatar = ref}
                    refParent={this}
                    onChangeState={opened => this.setState({ editorOpened: opened }) }
                />

                <Container
                    style={styles.topSpace}
                    styleContainer={{ padding: 0 }}
                    text={'TITLE 0'}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    {row('DEPUIS', this.playTime)}
                    {row('ACTIVITES', this.totalActivityLength)}
                    {row('TEMPS ACTIVITES', this.totalActivityTime)}
                </Container>

                <View style={{ paddingHorizontal: '5%' }}>
                    <Container
                        style={styles.topSpace}
                        text={'TITLE 1'}
                        type='rollable'
                        opened={false}
                        color='backgroundCard'
                    >
                        <StatsBars data={user.stats} />
                    </Container>

                    <Container
                        style={styles.topSpace}
                        text={'TITLE 2'}
                        type='rollable'
                        opened={false}
                        color='backgroundCard'
                    >
                        {/* TODO - Show best skills */}
                    </Container>
                </View>

                <Container
                    style={styles.topSpace}
                    text={'TITLE 3'}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    {/* TODO - Show last achievements */}
                </Container>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    xp: { marginBottom: 24 },
    xpRow: { flexDirection: 'row' },
    topSpace: { marginTop: 24 },
    row: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        borderTopWidth: .4
    },
    cell: {
        width: '50%',
        paddingHorizontal: '5%',
        justifyContent: 'center',
        borderRightWidth: .4
    },

    popupInput: {
        width: '90%',
        marginLeft: '5%',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    popupButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    popupButtonSave: {
        width: '55%',
        height: 48,
        borderRadius: 8
    },
    popupButtonCancel: {
        width: '40%',
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 0
    },
    popupButtonBirth: {
        width: '35%',
        height: 38,
        borderRadius: 8,
        paddingHorizontal: 0
    }
});

export default Identity;