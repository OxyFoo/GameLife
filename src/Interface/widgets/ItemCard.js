import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { Button, Text } from '../Components';

const AvatarCardProps = {
}

class ItemCard extends React.Component {
    render() {
        const background = { backgroundColor: themeManager.getColor('backgroundCard') };

        return (
            <Button style={styles.card} color='backgroundCard' rippleColor='white'>Test</Button>
        );
        return (
            <View style={[styles.card, background]}>
                <Text>Test</Text>
            </View>
        );
    }
}

ItemCard.prototype.props = AvatarCardProps;
ItemCard.defaultProps = AvatarCardProps;

const styles = StyleSheet.create({
    card: {
        width: '30%',
        height: 'auto',
        aspectRatio: 1,
        borderRadius: 8,
        paddingHorizontal: 0
    }
});

export default ItemCard;