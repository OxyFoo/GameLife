import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { GLHeader, GLInput, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Activity extends React.Component {
    back = () => { user.changePage('calendar'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Activité"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={style.content}>
                    <View>
                        <GLInput name='Catégorie' />
                        <GLInput name='Activité' />
                    </View>

                    <View>
                        <GLText style={style.row} styleText={style.text} title='Heure de départ' value='xxh xxm' />
                        <GLText style={style.row} styleText={style.text} title="Durée de l'activité" value='xxh xxm' />
                    </View>

                    <View>
                        <GLText style={style.row} styleText={style.text} title="Gain d'expérience" value='xx xp' />
                        <GLText style={style.text} title='Gain de caractéristiques' />
                        <View style={style.containerCarac}>
                            <GLText style={style.carac} title='XX    Sagesse' />
                            <GLText style={style.carac} title='XX    Intelligence' />
                            <GLText style={style.carac} title='XX    Confiance en soi' />
                            <GLText style={style.carac} title='XX    Force' />
                            <GLText style={style.carac} title='XX    Endurance' />
                            <GLText style={style.carac} title='XX    Dextérité' />
                            <GLText style={style.carac} title='XX    Agilité' />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        height: '90%',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 24
    },
    row: {
        paddingHorizontal: 0
    },
    text: {
        color: '#5AB4F0',
        fontSize: 24
    },
    containerCarac: {
        width: '70%',
        marginLeft: '15%'
    },
    carac: {
        padding: 0,
        color: '#5AB4F0',
        fontSize: 24,
        textAlign: 'left'
    }
});

export default Activity;