import * as React from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import BackHome from '../back/home';
import { Button, Checkbox, Container, GLActivityBox, GLDoubleCorner, GLHeader, GLIconButton, GLStats, GLSvg, GLText, GLXPBar, Input, Combobox, Swiper, Text, XPBar, Page } from '../Components';

class Home extends BackHome {
    render() {
        return (
            <Page canScrollOver={true}>
                <Text>{user.username}</Text>
            </Page>
        );
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;
const styles = StyleSheet.create({
    parentView: {
        flex: 1,
        padding:"2%"
    },
    containerHeader: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
    },
    containerUserName: {
        width: '50%',
        height: '100%',
        padding: "2%",

        display: 'flex',
        justifyContent: 'center',

    },
    username: {
        marginLeft: "2%",
        fontSize: ww * 48 / 1000,
        textAlign: 'left'
    },
    title: {
        marginTop: "4%",
        marginLeft: "2%",
        fontSize: ww * 37 / 1000,
        textAlign: 'left',
        
    },
    containerUserXP: {
        width: '50%',
        paddingHorizontal: "0%",
        display: 'flex',
        justifyContent: 'center'
    },

    containerContent: {
        height: '45%',
        flexDirection: 'row'
    },
    containerStats: {
        width: '60%',
        height: '100%',
        padding: "3%",
        
    },
    containerLevelColumn: {
        width: '40%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    textLevel: {
        marginBottom: "10%",
        fontSize: ww * 48 / 1000
    },
    textLevelTotal: {
        marginBottom: "10%",
        fontSize: ww * 37 / 1000 
    },
    textLevelAverage: {
        fontSize: ww * 32 / 1000
    },

    block: {
        marginHorizontal: "0.8%",
        padding: "8%",
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    blockLVL: { height: '25%', justifyContent: 'space-evenly' , },
    blockCalendar: { height: '40%', paddingHorizontal: 0, overflow: 'hidden',  },
    blockSkill: { width: ww * 17 / 100, height: ww*17/100, padding: 0, margin: 0, marginTop: "3%", marginBottom: wh * 6 / 100, overflow: 'visible' ,},
    blockSkillText: {
        marginVertical: "5%",
        marginLeft: '-50%',
        width: '200%',
        lineHeight: 16,
        fontSize : ww * 42 / 1000
        
    },

    calendarTitle: {
        marginBottom: "3%",
        fontSize: ww * 37 / 1000 
    },
    calendarBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: "3%",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textLevelPlus: {
    },

    containerSkills: {
        flex: 1,
        marginTop: "5%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    titleSkill: {
        marginBottom: "3%",
        fontSize: ww * 75 / 1000,
        
    },
    addActivityText: {
        fontSize: ww * 426 / 10000,
    },

    backgroundCircles: {
        position: 'absolute',
        left: 0,
        bottom: 0
    }
});

export default Home;