import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import GLText from '../Components/GLText';
import user from '../Managers/UserManager';

class Home extends React.Component {
    animTest = () => {
        user.changePage('animTest');
    }

    render() {
        return (
            <View style={{flex: 1}} onTouchStart={this.animTest}>
                {/* Header */}
                <GLText title="GAME LIFE" style={Style.header} />
                <View style={Style.separator}></View>

                {/* Content */}
                <View style={Style.content}>
                    <GLText title="prenom nom" style={Style.name} />
                    {/* Level */}
                    <View style={Style.containerLevels}>
                        <View style={Style.containerLevel}>
                            <GLText title="Level" style={Style.levelTitle} />
                            <GLText title="XX" style={Style.level} />
                        </View>
                        <View style={Style.containerXP}>
                            <GLText title="xp total XXXXX" style={Style.levelXP} />
                            <GLText title="average xp / day XXXXX" style={Style.levelXP} />
                        </View>
                    </View>

                    {/* XP */}
                    <View>
                        <GLText title="XX / YY XP" style={Style.textXP} />
                    </View>

                    {/* Calendar + caracs */}
                    <View style={Style.main}>
                        {/* Calendar */}
                        <View style={Style.containerCalendar}></View>

                        {/* Caracs */}
                        <View style={Style.containerCaracs}>
                            <GLText title="Caractéristiques" style={Style.textTitleCarac} />
                            <GLText title="Sagesse" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                            <GLText title="Intelligence" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                            <GLText title="Confiance" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                            <GLText title="Force" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                            <GLText title="Endurance" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                            <GLText title="Agilité" style={Style.textCarac} />
                            <GLText title="XX" style={Style.textCaracValue} />
                        </View>
                    </View>

                    {/* Comp */}
                    <GLText title="Compétences" style={Style.compTitle} />
                    <View style={Style.containerComp}>
                        <View style={Style.comp} />
                        <View style={Style.comp} />
                        <View style={Style.comp} />
                        <View style={Style.comp} />
                        <View style={Style.comp} />
                    </View>
                </View>
            </View>
        )
    }
}

const Style = StyleSheet.create({
    header: {
        width: '100%',
        color: '#5AB4F0',
        padding: 14,
        fontSize: 38,
        backgroundColor: '#012D3B'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#FFFFFF'
    },
    content: {
        flex: 1
    },
    name: {
        color: '#5AB4F0',
        fontSize: 36,
        marginTop: 12
    },
    containerLevels: {
        paddingHorizontal: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerLevel: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    levelTitle: {
        color: '#55AFF0',
        padding: 0,
        paddingBottom: 6,
        fontSize: 28
    },
    level: {
        color: '#55AFF0',
        padding: 6,
        fontSize: 38
    },
    containerXP: {
        alignItems: 'flex-end'
    },
    levelXP: {
        color: '#CAE6F4',
        fontSize: 12,
        padding: 2
    },
    textXP: {
        textAlign: 'right',
        padding: 0,
        paddingTop: 6,
        paddingBottom: 2,
        paddingRight: 8,
        marginVertical: 12,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    main: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerCalendar: {
        width: '40%',
        borderWidth: 2,
        borderColor: '#888888'
    },
    containerCaracs: {
        width: '60%'
    },
    textTitleCarac: {
        color: '#3E99E7',
        fontSize: 20,
        padding: 0
    },
    textCarac: {
        color: '#5ABEFA',
        fontSize: 18,
        padding: 0,
        marginTop: 8
    },
    textCaracValue: {
        color: '#5ABEFA',
        fontSize: 18,
        padding: 0
    },
    compTitle: {
        color: '#5ABEFA',
        fontSize: 28,
        padding: 24
    },
    containerComp: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    comp: {
        width: 48,
        height: 48,
        backgroundColor: 'red'
    }
});

export default Home;