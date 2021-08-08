import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { GLHeader, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Skills extends React.Component {
    back = () => { user.changePage('home'); }
    edit = (skill) => { user.changePage('skillsEdition', skill); }

    component_skill = ({item}) => (
        <TouchableOpacity activeOpacity={.5} style={skillStyle.skill} onPress={() => { this.edit(item); }}>
            <View style={skillStyle.header}></View>
            <View style={skillStyle.body}>
                <GLText style={skillStyle.title} title={item.title} />
                <GLText style={skillStyle.text} title={"lvl " + "??" + ", " + item.xp + " xp"} />
                <GLText style={skillStyle.text} title={"Last time : " + item.lastTime} />
            </View>
        </TouchableOpacity>
    )

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Compétences"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Controls */}
                <View>
                    <GLText title="Tri" />
                    <View style={style.separator}></View>
                </View>

                {/* Content */}
                <View style={style.content}>
                    <FlatList
                        style={style.skills}
                        data={user.skills}
                        keyExtractor={(item, i) => "skill_" + i}
                        renderItem={this.component_skill}
                    />
                </View>
            </View>
        )
    }
}

const skillStyle = StyleSheet.create({
    skill: {
        marginBottom: 30,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    header: {
        width: 86,
        height: 86,
        borderWidth: 2,
        borderColor: 'red'
    },
    body: {
        width: '75%',
        marginLeft: 24
    },
    title: {
        color: '#5AB4F0',
        padding: 0,
        marginBottom: 4,
        fontSize: 36
    },
    text: {
        color: '#5AB4F0',
        padding: 0,
        fontSize: 20
    }
});

const style = StyleSheet.create({
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#FFFFFF'
    },
    content: {
        flex: 1
    },
    skills: {
        paddingTop: 24
    }
});

export default Skills;