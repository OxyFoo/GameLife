import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import BackProfile from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import StartHelp from './help';
import EditorAvatar from './editorAvatar';
import EditorProfile from './editorProfile';
import { Round } from 'Utils/Functions';
import { Page, Text, XPBar, Container } from 'Interface/Components';
import { UserHeader, PageHeader, StatsBars, SkillsGroup, AchievementsGroup } from 'Interface/Widgets';

class Profile extends BackProfile {
    DataRow({ title = '', value = ''}) {
        const lang = langManager.curr['profile'];
        const rowStyle = [ styles.tableRow, { borderColor: themeManager.GetColor('main1') } ];
        const cellStyle = [ styles.cell, { borderColor: themeManager.GetColor('main1') } ];
        return (
            <View style={rowStyle}>
                <Text
                    style={styles.rowText}
                    containerStyle={cellStyle}
                >
                    {lang[title]}
                </Text>

                <Text
                    style={styles.rowText}
                    containerStyle={[cellStyle, { borderRightWidth: 0 }]}
                >
                    {value}
                </Text>
            </View>
        );
    }

    render() {
        const { DataRow } = this;
        const { editorOpened, xpInfo } = this.state;
        const lang = langManager.curr['profile'];
        const langDates = langManager.curr['dates']['names'];
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const animAvatar = this.refAvatar?.state.editorAnim.interpolate(interReverse) || 1;
        const headerOpacity = { opacity: animAvatar };
        const headerPointer = this.refAvatar === null ? 'auto' : (this.state.editorOpened ? 'none' : 'auto');

        return (
            <Page
                ref={ref => this.refPage = ref}
                scrollable={!editorOpened}
                canScrollOver={false}
            >
                <PageHeader
                    style={{ marginBottom: 12 }}
                    onBackPress={this.onBack}
                    onHelpPress={StartHelp.bind(this)}
                />

                <Animated.View style={headerOpacity} pointerEvents={headerPointer}>
                    <UserHeader
                        ref={ref => this.refTuto1 = ref}
                        editorMode={true}
                        onPress={this.openProfileEditor}
                    />
                </Animated.View>

                <Animated.View style={[styles.botSpace, headerOpacity]}>
                    <View style={styles.xpRow}>
                        <Text>{langManager.curr['level']['level'] + ' ' + xpInfo.lvl}</Text>
                        <Text>{Round(xpInfo.xp) + '/' + xpInfo.next}</Text>
                    </View>
                    <XPBar value={xpInfo.xp} maxValue={xpInfo.next} />
                </Animated.View>

                <EditorAvatar
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
                    <DataRow
                        title='row-since'
                        value={this.playTime + ' ' + (this.playTime <= 1 ? langDates['day'] : langDates['days'])}
                    />
                    <DataRow
                        title='row-activities'
                        value={this.totalActivityLength.toString()}
                    />
                    <DataRow
                        title='row-time'
                        value={this.totalActivityTime.toString()}
                    />
                </Container>

                <View style={{ paddingHorizontal: 12 }}>
                    <Container
                        style={styles.topSpace}
                        text={lang['container-stats-title']}
                        type='rollable'
                        opened={false}
                        color='main3'
                        rippleColor='white'
                    >
                        <StatsBars data={user.stats} />
                    </Container>

                    <Container
                        key={'profile-skills-' + this.state.xpInfo.totalXP}
                        style={styles.topSpace}
                        text={lang['container-skills-title']}
                        type='rollable'
                        opened={this.state.skillsOpened}
                        onChangeState={this.onChangeStateSkills}
                        color='main3'
                        rippleColor='white'
                    >
                        <SkillsGroup />
                    </Container>
                </View>

                <Container
                    style={[styles.topSpace, styles.botSpace]}
                    text={lang['container-achievements-title']}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    <AchievementsGroup />
                </Container>

                <EditorProfile ref={ref => this.refProfileEditor = ref } />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    topSpace: { marginTop: 24 },
    botSpace: { marginBottom: 24 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
    rowText: {
        fontSize: 14,
        textAlign: 'left'
    },
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
    }
});

export default Profile;
