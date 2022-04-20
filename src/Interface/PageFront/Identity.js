import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';

import BackIdentity from '../PageBack/Identity';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, Button, XPBar, Container, Icon, Separator } from '../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars, IdentityEditor } from '../Widgets';

class Identity extends BackIdentity {
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

    renderAchievement = ({ item }) => {
        const Title = dataManager.GetText(item.Name);
        return (
            <TouchableOpacity onPress={() => this.onAchievementPress(item.ID)} activeOpacity={.6}>
                <Text style={{ marginVertical: 12 }} fontSize={16}>{Title}</Text>
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

        const onIdentityEditor = () => {
            if (this.refIdentityEditor !== null) {
                this.refIdentityEditor.Open();
            }
        }

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
                        onPress={onIdentityEditor}
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

                <View style={{ paddingHorizontal: 12 }}>
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
                        <Button
                            style={styles.btnSmall}
                            onPress={this.openSkills}
                        >
                            {lang['conatiner-skills-all']}
                        </Button>
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
                    <FlatList
                        data={this.lastAchievements}
                        renderItem={this.renderAchievement}
                        keyExtractor={(item, index) => 'skill-' + index}
                        ItemSeparatorComponent={() => (
                            <Separator.Horizontal style={{ height: .4 }} color='main1' />
                        )}
                    />
                    <Button
                        style={styles.btnSmall}
                        onPress={this.openAchievements}
                    >
                        {lang['container-achievements-all']}
                    </Button>
                </Container>

                <IdentityEditor ref={ref => { if (ref !== null) this.refIdentityEditor = ref }} />
            </Page>
        );
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
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRightWidth: .4
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
        marginHorizontal: 24,
        borderRadius: 8
    }
});

export default Identity;