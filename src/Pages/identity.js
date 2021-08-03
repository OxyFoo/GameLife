import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLHeader, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Identity extends React.Component {
    back = () => { user.changePage('home'); }
    valid = () => {}

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Identité"
                    leftIcon='back'
                    onPressLeft={this.back}
                    rightIcon='check'
                    onPressRight={this.valid}
                />

                {/* Content */}
                <View style={style.content}>
                    <GLText style={style.text} title='Nom :' />
                    <GLText style={style.text} title='Prénom :' />
                    <GLText style={style.text} title='Age :' />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        padding: 24
    },
    text: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: 36,
        marginBottom: 12
    }
});

export default Identity;