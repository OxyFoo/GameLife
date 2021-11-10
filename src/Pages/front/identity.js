import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import BackIdentity from '../back/identity';
import { GLDropDown, GLHeader, GLText, GLTextEditable } from '../Components';
import { isUndefined } from '../../Functions/Functions';

class Identity extends BackIdentity {
    component_titre = ({ item }) => {
        const title = item;

        return (
            <GLText style={{ marginVertical: 4 }} title={title.Title} onPress={() => this.editTitle(item)} />
        )
    }

    render() {
        const age = this.calculateAge(this.state.birth) || '?';
        const mode = this.state.showDateTimePicker;
        const totalDuration = user.activities.getTotalDuration();
        const totalH = Math.floor(totalDuration/60);
        const totalM = ((totalDuration/60) - totalH) * 60;
        const totalLang = langManager.curr['identity']['value-totaltime'];
        const totalTxt = totalLang.replace('{}', totalH).replace('{}', totalM);
        const title = user.getTitleByID(this.state.title) || langManager.curr['identity']['empty-title'];
        const titles = user.getUnlockTitles();

        let names = [];
        let descriptions = [];
        let solvedAchievements = [...user.solvedAchievements];
        solvedAchievements.reverse();

        const max = Math.min(solvedAchievements.length, 3);
        for (let i = 0; i < max; i++) {
            const achievementID = solvedAchievements[i];
            const achievement = user.getAchievementByID(achievementID);
            if (!isUndefined(achievement)) {
                names.push(achievement.Name);
                descriptions.push(achievement.Description);
            }
        }

        return (
            <>
                <View style={{flex: 1}}>
                    {/* Header */}
                    <GLHeader
                        title={langManager.curr['identity']['page-title']}
                        leftIcon='back'
                        onPressLeft={this.back}
                        rightIcon={this.state.loading ? '' : 'check'}
                        onPressRight={this.valid.bind(this)}
                    />

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Profile image */}
                        <Animated.View style={[styles.image, { width: this.state.imageAnimation, height: this.state.imageAnimation }]} onTouchStart={this.imagePress}>
                            <Image style={{ width: '100%', height: '100%' }} source={require('../../../ressources/photos/default.jpg')} resizeMode="contain"  />
                        </Animated.View>

                        {/* Pseudo */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-pseudo'].toUpperCase()} />
                        <GLTextEditable
                            style={styles.value}
                            value={this.state.pseudo}
                            onChangeText={this.editPseudo}
                            beforeChangeText={this.beforeEditPseudo}
                            placeholder={langManager.curr['identity']['placeholder-pseudo']}
                        />

                        {/* Email */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-email'].toUpperCase()+" - "+user.conn.status} />
                        <GLTextEditable
                            style={styles.value}
                            value={this.state.email}
                            defaultValue={langManager.curr['identity']['empty-email']}
                            onChangeText={this.editMail}
                            textContentType="emailAddress"
                            placeholder={langManager.curr['identity']['placeholder-email']}
                        />
                        
                        {/* Title */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-title'].toUpperCase()} />
                        <GLDropDown
                            style={styles.value}
                            value={title}
                            data={titles}
                            onSelect={this.editTitle}
                            simpleText={true}
                            forcePopupMode={true}
                        />

                        {/* Age */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-age'].toUpperCase()} />
                        <GLText style={styles.value} title={langManager.curr['identity']['value-age'].replace('{}', age)} onPress={this.ageClick} color='secondary' />

                        {/* Total time */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-totaltime'].toUpperCase()} />
                        <GLText style={styles.value} title={totalTxt} color='secondary' />

                        {/* Last achievement */}
                        {names.length > 0 && (
                            <>
                                <GLText style={styles.text} title={langManager.curr['identity']['name-lastachievement'].toUpperCase()} />
                                <TouchableOpacity
                                    style={styles.achievementsContainer}
                                    activeOpacity={.5}
                                    onPress={() => { user.changePage('achievements'); }}
                                >
                                    <View style={[styles.achievementsBox, { backgroundColor: themeManager.colors['globalBackcomponent'] }]}>
                                        <GLText style={styles.title} title={names[0]} />
                                        <GLText style={styles.description} title={descriptions[0]} color="secondary" />
                                    </View>
                                    {names.length > 1 && (
                                        <View style={[styles.achievementsBox, { backgroundColor: themeManager.colors['globalBackcomponent'] }]}>
                                            <GLText style={styles.title} title={names[1]} />
                                            <GLText style={styles.description} title={descriptions[1]} color="secondary" />
                                        </View>
                                    )}
                                    {names.length > 2 && (
                                        <View style={[styles.achievementsBox, { backgroundColor: themeManager.colors['globalBackcomponent'] }]}>
                                            <GLText style={styles.title} title={names[2]} />
                                            <GLText style={styles.description} title={descriptions[2]} color="secondary" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                <DateTimePickerModal
                    date={new Date()}
                    mode={mode}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={mode != ''}
                />
            </>
        )
    }
}

const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    content: { 
        paddingHorizontal: "8%",
        paddingVertical: "5%",
        
    },
    containerPseudo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    text: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: ww * 64 / 1000,
        marginBottom: "3%",

    },
    value: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: ww * 586 / 10000,
        marginBottom: "10%"
    },
    image: {
        position:'absolute',
        top: "3%",
        right: "7%",
        width: ww * 25/100,
        height: ww * 25/100,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        backgroundColor: '#000000',
        zIndex: 100,
        elevation: 100
    },

    achievementsContainer: { 
        height: wh * 165 / 1000,
        display: 'flex',
        flexDirection: 'row',
        
    },
    achievementsBox: { 
        flex: 1,
        maxWidth: '30%',
        display: 'flex',
        justifyContent: 'space-evenly',
        marginHorizontal: "2%",
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        borderColor: '#FFFFFF',
        borderTopWidth: ww * 11 / 1000,
        borderBottomWidth: ww * 11 / 1000,
        borderLeftWidth: ww * 11 / 1000,
        borderRightWidth: ww * 11 / 1000,
        
    },
    title: { 
        minHeight: wh * 45 / 1000,
        marginBottom: "15%",
        fontSize: ww * 426 / 10000,
    },
    description: { 
        marginBottom: "10%",
        fontSize:ww*26/1000 ,
    }
});

export default Identity;