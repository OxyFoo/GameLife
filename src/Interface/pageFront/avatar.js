import * as React from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';

import BackAvatar from '../pageBack/avatar';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, XPBar, Container } from '../Components';
import { UserHeader, PageHeader, AvatarEditor, StatsBars } from '../Widgets';

class Avatar extends BackAvatar {
    render() {
        const interReverse = { inputRange: [0, 1], outputRange: [1, 0] };
        const opacity = this.refAvatar === null ? 1 : this.refAvatar.state.editorAnim.interpolate(interReverse);

        return (
            <Page
                ref={ref => this.refPage = ref}
                scrollable={!this.state.editorOpened}
                canScrollOver={false}
                bottomOffset={0}
            >
                <Animated.View style={{ opacity: opacity }} >
                    <PageHeader style={{ marginBottom: 0 }} />

                    <UserHeader />

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
                    text={'TITLE 0'}
                    type='rollable'
                    opened={true}
                    color='main3'
                    rippleColor='white'
                >
                    <StatsBars data={user.stats} />
                </Container>

                <Container
                    style={styles.topSpace}
                    text={'TITLE 1'}
                    type='rollable'
                    opened={false}
                    color='main3'
                    rippleColor='white'
                >
                    <StatsBars data={user.stats} />
                </Container>

                <Container
                    style={styles.topSpace}
                    text={'TITLE 2'}
                    type='rollable'
                    opened={false}
                    color='main3'
                    //rippleColor='white'
                >
                    {/* TODO - Show best skills */}
                </Container>

                <Container
                    style={styles.topSpace}
                    text={'TITLE 3'}
                    type='rollable'
                    opened={false}
                    color='main3'
                    //rippleColor='white'
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
    topSpace: { marginTop: 24 }
});

export default Avatar;