import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Button, Icon, Text } from 'Interface/Components';

const BannerProps = {
    /** @type {string} */
    children: ''
};

class Banner extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <Button style={styles.banner}>
                <LinearGradient
                    style={styles.gradient}
                    colors={['#B839FE50', '#8A3DFE50']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.title}>
                        {children}
                    </Text>

                    <View style={styles.help}>
                        <Icon icon='info' size={24} />
                    </View>
                </LinearGradient>
            </Button>
        );
    }
}

Banner.prototype.props = BannerProps;
Banner.defaultProps = BannerProps;

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        height: 50,
        marginBottom: 24,
        paddingHorizontal: 0,
        borderRadius: 4
    },
    gradient: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    help: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 12,
        justifyContent: 'center'
    }
});

export default Banner;