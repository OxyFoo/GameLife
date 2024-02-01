import * as React from 'react';
import { FlatList, View } from 'react-native';

import styles from './style';
import BackMultiplayerPanel from './back';

import { Character, Container, Frame, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/Friend').Friend} Friend
 * @typedef {import('react-native').ListRenderItem<Friend>} ListRenderFriend
 */

class MultiplayerPanel extends BackMultiplayerPanel {
    render() {
        return (
            <Container
                style={this.props.style}
                styleContainer={styles.container}
                type='static'
                icon='social'
                text={'[Multiplayer]'}
            >
                <FlatList
                    ref={ref => this.refFlatlist = ref}
                    data={this.state.friends}
                    keyExtractor={(item, index) => 'multi-player-' + item.accountID}
                    renderItem={this.renderItem}
                />
            </Container>
        );
    }

    /** @type {ListRenderFriend} */
    renderItem = ({ item, index }) => {
        const frameSize = { x: 200, y: 0, width: 500, height: 450 };

        const character = new Character(
            'character-player-' + item.accountID.toString(),
            item.avatar.Sexe,
            item.avatar.Skin,
            item.avatar.SkinColor
        );
        const stuff = [
            item.avatar.Hair,
            item.avatar.Top,
            item.avatar.Bottom,
            item.avatar.Shoes
        ];
        character.SetEquipment(stuff);

        return (
            <View style={styles.friend}>
                <Frame
                    style={styles.frame}
                    characters={[ character ]}
                    size={frameSize}
                    delayTime={0}
                    loadingTime={0}
                    bodyView={'topHalf'}
                />

                <Text>{item.username}</Text>
            </View>
        );
    }
}

export default MultiplayerPanel;
