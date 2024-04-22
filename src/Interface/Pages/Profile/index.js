import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import BackProfile from './back';
import StartHelp from './help';
import EditorAvatar from './editorAvatar';
import EditorProfile from './editorProfile';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Round } from 'Utils/Functions';
import { Page } from 'Interface/Global';
import { Text, XPBar, Container, KPI, Button } from 'Interface/Components';
import { UserHeader, PageHeader, AchievementsGroup } from 'Interface/Widgets';

class Profile extends BackProfile {
    render() {
        const { editorOpened, xpInfo } = this.state;
        const lang = langManager.curr['profile'];
        const langDates = langManager.curr['dates']['names'];
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const animAvatar = this.refAvatar?.state.editorAnim.interpolate(interReverse) || 1;
        const headerOpacity = { opacity: animAvatar };
        const headerPointer = this.refAvatar === null ? 'auto' : (this.state.editorOpened ? 'none' : 'auto');
        const backgroundKpi = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <Page
                ref={this.refPage}
                scrollable={!editorOpened}
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
                    onChangeState={opened => this.setState({ editorOpened: opened })}
                />

                <View style={styles.kpiContainer}>
                    <KPI
                        title={lang['row-since']}
                        value={this.state.playedDays}
                        unit={langDates['day-min']}
                        style={[styles.kpiProfile, backgroundKpi]} />
                    <KPI
                        title={lang['row-activities']}
                        value={this.state.totalActivityLength}
                        style={[styles.kpiProfile, backgroundKpi]} />
                    <KPI
                        title={lang['row-time']}
                        value={this.state.totalActivityTime}
                        unit={langDates['hours-min']}
                        style={[styles.kpiProfile, backgroundKpi]}/>
                </View>

                <Container
                    style={styles.topSpace}
                    text={lang['container-achievements-title']}
                    type='static'
                    opened={true}
                    color='main1'
                    backgroundColor='backgroundCard'
                >
                    <AchievementsGroup />
                </Container>

                <Button
                    style={styles.topSpace}
                    color='backgroundCard'
                    rippleColor='white'
                    borderRadius={8}
                    icon='setting'
                    onPress={this.openSettings}
                >
                    {lang['btn-settings']}
                </Button>

                <EditorProfile ref={ref => this.refProfileEditor = ref} />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    topSpace: { marginTop: 16 },
    botSpace: { marginBottom: 24 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    kpiProfile: {
        paddingHorizontal: 2
    }
});

export default Profile;
