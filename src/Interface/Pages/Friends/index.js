import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';

import styles from './style';
import BackFriends from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Gradient } from 'Interface/Primitives';
import { Button, InputText, Text, UserOnlineElement } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Friends extends BackFriends {
    render() {
        const lang = langManager.curr['friends'];
        const { friends, waitingFriends, blockedFriends, search, sortIndex, ascending } = this.state;

        return (
            <View style={styles.page}>
                <ScrollView style={styles.scrollview}>
                    <PageHeader title={lang['title']} onBackPress={this.onBack} />

                    <InputText
                        label={lang['button-search']}
                        icon='rounded-magnifer-outline'
                        value={search}
                        onChangeText={this.onSearchChange}
                    />

                    <View style={styles.buttonRow}>
                        {/** Sort button */}
                        <Button
                            style={styles.buttonFilter}
                            appearance='uniform'
                            color='transparent'
                            fontColor='secondary'
                            onPress={this.onSortPress}
                        >
                            {`${lang['button-sort']} ${lang['sort-list'][sortIndex]}`}
                        </Button>

                        {/** Ascending button */}
                        <Button
                            style={styles.buttonAscending}
                            appearance='uniform'
                            color='transparent'
                            fontColor='gradient'
                            icon='filter-outline'
                            iconAngle={ascending ? 180 : 0}
                            onPress={this.onAscendingPress}
                        />
                    </View>

                    <Text style={styles.title} color='secondary'>
                        {lang['title-friends']}
                    </Text>

                    {/** Friends */}
                    <FlatList
                        style={styles.friendsList}
                        data={friends}
                        keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                        renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                        scrollEnabled={false}
                    />

                    {/** Waiting friends */}
                    {waitingFriends.length > 0 && (
                        <Text style={styles.title} color='secondary'>
                            {lang['title-waiting-friends']}
                        </Text>
                    )}

                    <FlatList
                        style={styles.friendsList}
                        data={waitingFriends}
                        keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                        renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                        scrollEnabled={false}
                    />

                    {/** Blocked friends */}
                    {blockedFriends.length > 0 && (
                        <Text style={styles.title} color='secondary'>
                            {lang['title-blocked-friends']}
                        </Text>
                    )}

                    <FlatList
                        style={styles.friendsList}
                        data={blockedFriends}
                        keyExtractor={(item) => `${item.accountID}-${item.friendshipState}`}
                        renderItem={({ item }) => <UserOnlineElement style={styles.friend} friend={item} />}
                        scrollEnabled={false}
                    />
                </ScrollView>

                <Gradient
                    style={styles.addFriendButtonContainer}
                    angle={140}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.12 })
                    ]}
                >
                    <Button
                        style={styles.addFriendButton}
                        icon='add'
                        appearance='uniform'
                        color='transparent'
                        fontColor='gradient'
                        onPress={this.onAddFriendPress}
                    />
                </Gradient>
            </View>
        );
    }
}

export default Friends;
