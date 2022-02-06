import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import BackIdentity from '../PageBack/Identity';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, Button, XPBar, Container, Icon } from '../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars } from '../Widgets';
import { GetTime } from '../../Functions/Time';

class Identity extends BackIdentity {
    openNowifiPopup() {
        const title = langManager.curr['identity']['alert-nowifi-title'];
        const text = langManager.curr['identity']['alert-nowifi-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
    }
    openPopupEdit = () => user.interface.popup.ForceOpen('custom', this.renderPopupEdit, undefined, true);

    /**
     * Popup to edit user infos
     */
    renderPopupEdit = () => {
        const lang = langManager.curr['identity'];
        const close = () => user.interface.popup.Close();

        // Username
        const usernameEdit = async () => {
            if (user.server.IsConnected()) {
                const info = user.informations.GetInfoToChangeUsername();
                if (user.informations.usernameTime !== null && info.remain > 0) {
                    // Username already changed
                    const title = lang['alert-alreadyChanged-title'];
                    const text = lang['alert-alreadyChanged-text'].replace('{}', info.remain);
                    user.interface.popup.ForceOpen('ok', [ title, text ], this.openPopupEdit, false);
                    return;
                }

                // Warning to change username
                const openChangeUsername = () => {
                    user.interface.screenInput.Open(lang['input-username'], user.informations.username, user.informations.SetUsername);
                    this.openPopupEdit();
                }
                const title = lang['alert-usernamewarning-title'];
                const text = lang['alert-usernamewarning-text'].replace('{}', info.total).replace('{}', info.total);
                user.interface.popup.ForceOpen('ok', [ title, text ], openChangeUsername, false);
            } else {
                this.openNowifiPopup();
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

        // Age edition (Date Picker)
        const dtpStartDate = new Date(2000, 0, 1, 0, 0, 0, 0);
        const dtpTopDate = new Date(); dtpTopDate.setFullYear(dtpTopDate.getFullYear() - 6);
        const dtpBottomDate = new Date(); dtpBottomDate.setFullYear(dtpBottomDate.getFullYear() - 120);

        const onChangeAge = (date) => { user.informations.SetBirthTime(GetTime(date)); hideDTP(); };
        const showDTP = () => this.setState({ stateDTP: 'date' });
        const hideDTP = () => this.setState({ stateDTP: '' });
        const checkChangeAge = () => {
            const info = user.informations.GetInfoToChangeBirthtime();
            if (info.remain > 0) {
                const title = lang['alert-birthtimewait-title'];
                const text = lang['alert-birthtimewait-text'].replace('{}', info.remain);
                user.interface.popup.ForceOpen('ok', [ title, text ], this.openPopupEdit, false);
                return;
            }
            const title = lang['alert-birthtimewarning-title'];
            const text = lang['alert-birthtimewarning-text'].replace('{}', info.total);
            const checkedChangeAge = () => { showDTP(); this.openPopupEdit(); };
            user.interface.popup.ForceOpen('ok', [ title, text ], checkedChangeAge, false);
        };

        return (
            <>
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
                        <Button style={styles.popupButtonEdit} onPress={checkChangeAge} fontSize={12} color='main1'>{lang['input-edit']}</Button>
                    </View>

                    <Button style={styles.popupButtonCancel} fontSize={14} onPress={close}>{lang['edit-cancel']}</Button>
                </View>

                <DateTimePickerModal
                    date={dtpStartDate}
                    maximumDate={dtpTopDate}
                    minimumDate={dtpBottomDate}
                    mode={this.state.stateDTP}
                    headerTextIOS={lang['input-select-age']}
                    onConfirm={onChangeAge}
                    onCancel={hideDTP}
                    isVisible={this.state.stateDTP != ''}
                />
            </>
        );
    }

    renderSkill = ({ item: { ID, Name, Logo } }) => {
        const onPress = () => user.interface.ChangePage('skill', { skillID: ID });
        return (
            <TouchableOpacity style={styles.skill} onPress={onPress} activeOpacity={.6}>
                <View style={styles.skillImage}>
                    <Icon xml={Logo} size={52} color='main1' />
                </View>
                <Text fontSize={12}>{Name}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const lang = langManager.curr['identity'];
        const langDates = langManager.curr['dates']['names'];
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const headerOpacity = this.refAvatar === null ? 1 : this.refAvatar.state.editorAnim.interpolate(interReverse);
        const headerPointer = this.refAvatar === null ? 'auto' : (this.state.editorOpened ? 'none' : 'auto');

        const rowStyle = [styles.tableRow, { borderColor: themeManager.GetColor('main1') }];
        const cellStyle = [styles.cell, { borderColor: themeManager.GetColor('main1') }];
        const row = (title, value) => (
            <View style={rowStyle}>
                <Text fontSize={14} containerStyle={cellStyle} style={{ textAlign: 'left' }}>{lang[title]}</Text>
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
                        onPress={this.openPopupEdit}
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
                    text={lang['row-title']}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    {row('row-since', this.playTime + ' ' + (this.playTime <= 1 ? langDates['day'] : langDates['days']))}
                    {row('row-activities', this.totalActivityLength)}
                    {row('row-time', this.totalActivityTime)}
                </Container>

                <View style={{ paddingHorizontal: '5%' }}>
                    <Container
                        style={styles.topSpace}
                        text={lang['container-stats-title']}
                        type='rollable'
                        opened={false}
                        color='backgroundCard'
                    >
                        <StatsBars data={user.stats} />
                    </Container>

                    <Container
                        style={styles.topSpace}
                        text={lang['container-skills-title']}
                        type='rollable'
                        opened={false}
                        color='backgroundCard'
                    >
                        <FlatList
                            data={this.skills}
                            renderItem={this.renderSkill}
                            keyExtractor={(item, index) => 'skill-' + index}
                            numColumns={3}
                        />
                        <Button style={styles.btnSmall} onPress={this.openSkills}>{lang['conatiner-skills-all']}</Button>
                    </Container>
                </View>

                <Container
                    style={styles.topSpace}
                    text={lang['container-achievements-title']}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    {/* TODO - Show last achievements */}
                    <Button
                        style={styles.achievementButton}
                        onPress={this.openAchievements}
                        color='main2'
                        fontSize={14}
                    >
                        {lang['container-achievements-all']}
                    </Button>
                </Container>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    xp: { marginBottom: 24 },
    xpRow: { flexDirection: 'row' },
    topSpace: { marginTop: 24 },
    tableRow: {
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
    achievementButton: {
        width: '60%',
        height: 48,
        marginLeft: '20%'
    },
    
    skill: {
        width: '33%',
        alignItems: 'center'
    },
    skillImage: {
        width: '60%',
        aspectRatio: 1,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4
    },

    btnSmall: {
        height: 46,
        marginTop: 24,
        marginHorizontal: '20%',
        borderRadius: 8
    },

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

export default Identity;