import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import user from '../Managers/UserManager';
import { GLHeader, GLText, GLXP } from '../Components/GL-Components';

class Home extends React.Component {
    openSkills     = () => { user.changePage('skills'); }
    openCalendar   = () => { user.changePage('calendar'); }
    openIdentity   = () => { user.changePage('identity'); }
    openSettings   = () => { user.changePage('settings'); }
    openExperience = () => { user.changePage('experience') }
    openCharacteristics = () => { user.changePage('characteristics') }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="GAME LIFE"
                    rightIcon='gear'
                    onPressRight={this.openSettings}
                />

                {/* Content */}
                <View style={Style.content}>
                    <GLText title={user.pseudo} style={Style.name} onPress={this.openIdentity} />

                    {/* Level */}
                    <GLXP onPress={this.openExperience} />

                    {/* Calendar + caracs */}
                    <View style={Style.main}>
                        {/* Calendar */}
                        <TouchableOpacity onPress={this.openCalendar} activeOpacity={.5} style={Style.containerCalendar}/>
                        {/*<View style={Style.containerCalendar}></View>*/}

                        {/* Caracs */}
                        <TouchableOpacity style={Style.containerCaracs} activeOpacity={.5} onPress={this.openCharacteristics}>
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
                        </TouchableOpacity>
                    </View>

                    {/* Comp */}
                    <TouchableOpacity activeOpacity={.5} onPress={this.openSkills}>
                        <GLText title="Compétences" style={Style.compTitle} />
                        <View style={Style.containerComp}>
                            <View style={Style.comp} />
                            <View style={Style.comp} />
                            <View style={Style.comp} />
                            <View style={Style.comp} />
                            <View style={Style.comp} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const Style = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    name: {
        color: '#5AB4F0',
        fontSize: 36,
        marginTop: 12,
        padding: 0
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
        padding: 12
    },
    containerComp: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 24
    },
    comp: {
        width: 48,
        height: 48,
        borderColor: 'red',
        borderWidth: 2
    }
});

export default Home;