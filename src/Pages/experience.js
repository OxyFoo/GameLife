import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLHeader, GLText, GLXPBar } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Experience extends React.Component {
    back = () => { user.changePage('home'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Gestion XP"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={style.content}>
                    <GLText style={style.textXP} title='Level XX' />
                    <GLXPBar style={style.barXP} />

                    <GLText title='xp total' value='xx' />
                    <GLText title='xp / jour' value='xx' style={style.textBottom} />

                    <GLText title='xp de la semaine' value='xx' />
                    <GLText title='xp du mois' value='xx' />
                    <GLText title="xp de l'année" value='xx' style={style.textBottom} />

                    <GLText title='xp avant lvl 10' value='xx' />
                    <GLText title='xp avant lvl 100' value='xx' style={style.textBottom} />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        paddingTop: 24
    },
    textXP: {
        color: '#5AB4F0',
        fontSize: 36,
        marginBottom: 12
    },
    barXP: {
        marginBottom: 64
    },
    textBottom: {
        marginBottom: 24
    }
});

export default Experience;