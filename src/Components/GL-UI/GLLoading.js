import * as React from 'react';
import { StyleSheet, Image, View } from 'react-native';

const logoDir = '../../../ressources/logo/';
const logo = require(logoDir + 'loading.png');

function GLLoading(props) {
    return (
        <View style={Style.content}>
            <Image style={Style.image} source={logo} />
        </View>
    )
}

const Style = StyleSheet.create({
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