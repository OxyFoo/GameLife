import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import BackIdentity from '../PageBack/Identity';
import user from '../../Managers/UserManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, XPBar, Container } from '../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars } from '../Widgets';

class Identity extends BackIdentity {
    render() {
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const headerOpacity = this.refAvatar === null ? 1 : this.refAvatar.state.editorAnim.interpolate(interReverse);
        const headerPointer = this.refAvatar === null ? 'auto' : (this.refAvatar.state.editorOpened ? 'auto' : 'none');

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
                    <UserHeader showAge={true} editable={true} />

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
    }
});

export default Identity;