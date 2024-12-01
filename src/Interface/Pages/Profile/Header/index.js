import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import HeaderBack from './back';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Text, Icon, Button } from 'Interface/Components';

class Header extends HeaderBack {
    render() {
        const { style } = this.props;
        const { username, titleID } = this.state;

        const title = dataManager.titles.GetByID(titleID);
        const titleText = title === null ? '' : langManager.GetText(title.Name);

        return (
            <View style={[styles.container, style]}>
                <View style={styles.userHeader}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>
                            {username}
                        </Text>
                    </View>

                    {titleText !== '' && (
                        <Text style={styles.title} color='main1'>
                            {titleText}
                        </Text>
                    )}
                </View>

                <View style={styles.buttons}>
                    <Button
                        style={styles.button}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.openEditProfile}
                    >
                        <Icon icon='edit-outline' color='gradient' size={28} />
                    </Button>
                </View>
            </View>
        );
    }
}

export { Header };
