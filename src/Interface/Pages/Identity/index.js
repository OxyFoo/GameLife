import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import BackIdentity from './back';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import { Page, Text, XPBar, Container } from '../../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars, IdentityEditor, SkillsGroup, AchievementsGroup } from '../../Widgets';

class Identity extends BackIdentity {
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
            >
                <PageHeader
                    style={{ marginBottom: 12 }}
                    onBackPress={this.onBack}
                />

                <Animated.View style={{ opacity: headerOpacity }} pointerEvents={headerPointer}>
                    <UserHeader
                        showAge={true}
                        onPress={this.openIdentityEditor}
                    />

                    <Animated.View style={styles.botSpace}>
                        <View style={styles.xpRow}>
                            <Text>{langManager.curr['level']['level'] + ' ' + this.userXP.xpInfo.lvl}</Text>
                            <Text>{this.userXP.xpInfo.xp + '/' + this.userXP.xpInfo.next}</Text>
                        </View>
                        <XPBar value={this.userXP.xpInfo.xp} maxValue={this.userXP.xpInfo.next} />
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
                        <SkillsGroup
                            showAllButton={true}
                        />
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
                    <AchievementsGroup
                        showAllButton={true}
                    />
                </Container>

                <IdentityEditor ref={ref => this.refIdentityEditor = ref } />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    topSpace: { marginTop: 24 },
    botSpace: { marginBottom: 24 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
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

export default Identity;