import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {object} BannerProps
 * @property {string} id Used to call onPress with id
 * @property {string} title
 * @property {(id: string) => void} [onPress]
 */

/** @type {BannerProps} */
const BannerProps = {
    id: '',
    title: '',
    onPress: undefined
};

class Banner extends React.Component {
    onPress = () => {
        const { id, onPress } = this.props;
        onPress?.(id);
    };

    render() {
        const { id, title, onPress } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>

                {id !== '' && !!onPress && (
                    <Button style={styles.helpButton} appearance='uniform' color='transparent' onPress={this.onPress}>
                        <Icon icon='info-circle-outline' color='main1' size={28} />
                    </Button>
                )}
            </View>
        );
    }
}

Banner.prototype.props = BannerProps;
Banner.defaultProps = BannerProps;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    helpButton: {
        width: 'auto',
        aspectRatio: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4
    }
});

export default Banner;
