import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import BackShop from '../pageBack/shop';
import { GLHeader, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class Shop extends BackShop {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['shop']['page-title']}
                    leftIcon="back"
                    onPressLeft={user.interface.backPage}
                />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.wait} title={langManager.curr['shop']['wait']} />
                </View>

                {/* PUB - Banner */}
                <View style={styles.banner}>
                </View>
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: "5%"
    },

    wait: {
        padding: '5%',
        fontSize: ww * 75 / 1000 , 
    },

    banner: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default Shop;