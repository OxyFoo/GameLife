import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackProfileFriend from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Page, Text, Button, Container, XPBar, Frame } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { Round } from 'Utils/Functions';
import dataManager from 'Managers/DataManager';

function DataRow({ title = '', value = ''}) {
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

class ProfileFriend extends BackProfileFriend {
    render() {
        const lang = langManager.curr['profile'];
        const { friend, xpInfo } = this.state;

        const username = friend.username;
        const title = friend.title !== 0 ? dataManager.titles.GetByID(friend.title) : null;
        const titleText = title === null ? null : dataManager.GetText(title.Name);

        return (
            <Page ref={ref => this.refPage = ref}>
                <PageHeader
                    style={{ marginBottom: 12 }}
                    onBackPress={this.Back}
                />

                {/** User Header */}
                <View style={styles.header}>
                    <View style={styles.content}>
                        <View style={styles.usernameContainer}>
                            <Text style={styles.username} color='primary'>
                                {username}
                            </Text>
                        </View>

                        {titleText !== null && (
                            <Text style={styles.title} color='secondary'>
                                {titleText}
                            </Text>
                        )}
                    </View>
                </View>

                {/** XP Bar */}
                <View style={styles.botSpace}>
                    <View style={styles.xpRow}>
                        <Text>{langManager.curr['level']['level'] + ' ' + xpInfo.lvl}</Text>
                        <Text>{Round(xpInfo.xp) + '/' + xpInfo.next}</Text>
                    </View>
                    <XPBar value={xpInfo.xp} maxValue={xpInfo.next} />
                </View>

                {/** Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Frame characters={[ this.character ]} loadingTime={300} />
                    </View>
                </View>

                {/** User Data */}
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
                        value={'[0]'}
                    />
                    <DataRow
                        title='row-activities'
                        value={'[0]'}
                    />
                    <DataRow
                        title='row-time'
                        value={'[0]'}
                    />
                </Container>

                {/** Actions */}
                <Button
                    style={styles.topSpace}
                    color='danger'
                    onPress={this.removeFriendHandler}
                >
                    [Retirer de la liste d'amis]
                </Button>
            </Page>
        );
    }
}

export default ProfileFriend;
