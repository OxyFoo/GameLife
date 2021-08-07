import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { GLHeader, GLHistory, GLText, GLXP } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class SkillsEdition extends React.Component {
    back = () => { user.changePage('skills'); }

    render() {
        return (
            <>
                <View style={{flex: 1}}>
                    {/* Header */}
                    <GLHeader
                        title="Compétence"
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

                    {/* Gains */}
                    <View style={Style.containerGains}>
                        <View style={Style.containerGainsText}>
                            <GLText style={Style.textGain} title="Gain" />
                            <GLText style={Style.textGain2} title="(pour 60min)" />
                        </View>
                        <View style={Style.columnsGains}>
                            <View style={Style.columnGains}>
                                <GLText style={Style.textGainCarac} title="0 Sagesse" />
                                <GLText style={Style.textGainCarac} title="0 Confiance" />
                                <GLText style={Style.textGainCarac} title="0 Endurance" />
                                <GLText style={Style.textGainCarac} title="0 Dextérité" />
                            </View>
                            <View style={Style.columnGains2}>
                                <GLText style={Style.textGainCarac} title="0 Intelligence" />
                                <GLText style={Style.textGainCarac} title="0 Force" />
                                <GLText style={Style.textGainCarac} title="0 Agilité" />
                            </View>
                        </View>
                    </View>
                </View>

                <GLHistory />
            </>
        )
    }
}

const Style = StyleSheet.create({
    header: {
        padding: 24,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerBody: {
        alignItems: 'flex-end'
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
    },
    containerGains: {
    },
    containerGainsText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    textGain: {
        paddingRight: 0,
        fontSize: 28,
        color: '#55AFF0'
    },
    textGain2: {
        fontSize: 18,
        color: '#55AFF0'
    },
    columnsGains: {
        width: '80%',
        marginLeft: '10%',
        display: 'flex',
        flexDirection: 'row'
    },
    columnGains: {
        width: '50%',
        alignItems: 'flex-start'
    },
    columnGains2: {
        width: '50%',
        alignItems: 'flex-start'
    },
    textGainCarac: {
        paddingVertical: 4,
        fontSize: 18,
        color: '#55AFF0'
    }
});

export default SkillsEdition;