import * as React from 'react';
import { StyleSheet, Image, View } from 'react-native';

const logoDir = '../../../ressources/logo/';
const logo = require(logoDir + 'loading.png');

function GLLoading(props) {
    return (
        <View style={styles.content}>
            <Image style={styles.image} source={logo} />
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    }
});

export default GLLoading;