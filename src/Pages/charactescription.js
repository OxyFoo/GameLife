import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLHeader, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class Charactescription extends React.Component {
    back = () => { user.changePage('characteristics'); }

    render() {
        const key = this.props.args[0];
        const name = langManager.currentLangage['caracsName'][key];
        const description = langManager.currentLangage['caracsDescription'][key];

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
                    <GLText style={style.text} onPress={this.open} title={name} />

                    <View style={style.containerDescription}>
                        <GLText style={style.text} onPress={this.open} title='Description :' />
                        <GLText style={style.description} onPress={this.open} title={description} />
                    </View>
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
        fontSize: 36,
        color: '#55AFF0'
    },
    containerDescription: {
        padding: 12,
        margin: 12,
        backgroundColor: '#02303F'
    },
    description: {
        fontSize: 22,
        textAlign: 'justify',
        color: '#55AFF0'
    }
});

export default Charactescription;