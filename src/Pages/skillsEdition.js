import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { GLHeader, GLText, GLXP } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class SkillsEdition extends React.Component {
    back = () => { user.changePage('skills'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Compétences"
                    leftIcon='back'
                    onPressLeft={this.back}
                    rightIcon='check'
                />

                <View style={Style.header}>
                    <View style={Style.icon} />
                    <View style={Style.headerBody}>
                        <GLText style={Style.titleHeader} title='?????' />
                        <GLText style={Style.textHeader} title='Catérogie : ???' />
                    </View>
                </View>

                <GLXP /> 
            </View>
        )
    }
}

const Style = StyleSheet.create({
    header: {
        padding: 24,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    icon: {
        width: 72,
        height: 72,
        backgroundColor: 'red'
    },
    titleHeader: {
        fontSize: 36,
        paddingTop: 6,
        paddingBottom: 0,
        color: '#5AB4F0'
    },
    textHeader: {
        fontSize: 20,
        paddingVertical: 6,
        color: '#5AB4F0'
    }
});

export default SkillsEdition;