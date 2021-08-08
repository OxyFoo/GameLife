import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { GLHeader, GLHistory, GLText, GLXP } from '../Components/GL-Components';
import langManager from '../Managers/LangManager';
import user from '../Managers/UserManager';

class SkillsEdition extends React.Component {
    constructor(props) {
        super(props);

        const skill = this.props.args;

        this.title = skill.title;
        this.cat = skill.cat;

        const caracs = skill.caracs;
        this.data = [];
        for (let key in caracs) {
            const newData = { key: key, value: caracs[key] };
            this.data.push(newData);
        }
    }
    back = () => { user.changePage('skills'); }

    skillElement = ({item}) => {
        return (
            <GLText style={Style.textGainCarac} title={item.value + ' ' + langManager.currentLangage['caracsName'][item.key]} />
        )
    }

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
                            <GLText style={Style.titleHeader} title={this.title} />
                            <GLText style={Style.textHeader} title={'Catérogie : ' + this.cat} />
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
                            <FlatList
                                data={this.data}
                                keyExtractor={(item, i) => 'skill_' + i}
                                renderItem={this.skillElement}
                            />
                        </View>
                    </View>
                </View>

            {/*<GLHistory />*/}
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