import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLHeader, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Characteristics extends React.Component {
    open = () => { user.changePage('charactescription'); }
    back = () => { user.changePage('home'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Caracs"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={style.content}>
                    <GLText style={style.text} onPress={this.open} title='X1   Sagesse' />
                    <GLText style={style.text} onPress={this.open} title='X2   Intelligence' />
                    <GLText style={style.text} onPress={this.open} title='X1   Confience en soi' />
                    <GLText style={style.text} onPress={this.open} title='X1   Force' />
                    <GLText style={style.text} onPress={this.open} title='X1   Endurance' />
                    <GLText style={style.text} onPress={this.open} title='X1   Agilité' />
                    <GLText style={style.text} onPress={this.open} title='X1   Dextérité' />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '90%',
        paddingHorizontal: 24,

        display: 'flex',
        justifyContent: 'space-evenly'
    },
    text: {
        textAlign: 'left',
        fontSize: 34,
        color: '#55AFF0'
    }
});

export default Characteristics;