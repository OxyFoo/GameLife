import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Identity from '../../Pages/identity';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLDropDown, GLHeader, GLText, GLTextEditable } from './Components/GL-Components';

class T0Identity extends Identity {
    component_titre = ({ item }) => {
        const title = item;

        return (
            <GLText style={{ marginVertical: 4 }} title={title.Title} onPress={() => this.editTitle(item)} />
        )
    }

    render() {
        const age = this.calculateAge(this.state.birth) || '?';
        const mode = this.state.showDateTimePicker;
        const totalDuration = user.getActivitiesTotalDuration();
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
            names.push(achievement.Name);
            descriptions.push(achievement.Description);
        }

        return (
            <>
                <View style={{flex: 1}}>
                    {/* Header */}
                    <GLHeader
                        title={langManager.curr['identity']['page-title']}
                        leftIcon='back'
                        onPressLeft={this.back}
                        rightIcon='check'
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

                        {/* Title */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-title'].toUpperCase()} />
                        {/*<GLText style={styles.value} title={this.state.title || langManager.curr['identity']['empty-title']} onPress={this.toggleModal} color='secondary' />*/}
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

                        {/* Email */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-email'].toUpperCase()} />
                        <GLText style={[styles.value, { marginBottom: 6 }]} title={user.conn.status} color='secondary' />

                        {/* Email */}
                        <GLTextEditable
                            style={styles.value}
                            value={this.state.email}
                            defaultValue={langManager.curr['identity']['empty-email']}
                            onChangeText={this.editMail}
                            textContentType="emailAddress"
                            placeholder={langManager.curr['identity']['placeholder-email']}
                        />

                        {/* Total time */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-totaltime'].toUpperCase()} />
                        <GLText style={styles.value} title={totalTxt} color='secondary' />

                        {/* Last achievement */}
                        {user.solvedAchievements.length > 0 && (
                            <>
                                <GLText style={styles.text} title={langManager.curr['identity']['name-lastachievement'].toUpperCase()} />
                                <TouchableOpacity
                                    style={styles.achievementsContainer}
                                    activeOpacity={.5}
                                    onPress={() => { user.changePage('achievements'); }}
                                >
                                    <View style={[styles.achievementsBox, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }]}>
                                        <GLText style={styles.title} title={names[0]} />
                                        <GLText style={styles.description} title={descriptions[0]} color="secondary" />
                                    </View>
                                    {user.solvedAchievements.length > 1 && (
                                        <View style={[styles.achievementsBox, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }]}>
                                            <GLText style={styles.title} title={names[1]} />
                                            <GLText style={styles.description} title={descriptions[1]} color="secondary" />
                                        </View>
                                    )}
                                    {user.solvedAchievements.length > 2 && (
                                        <View style={[styles.achievementsBox, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }]}>
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

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 24,
        paddingVertical: 48
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
        fontSize: 24,
        marginBottom: 12
    },
    value: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: 22,
        marginBottom: 30
    },
    image: {
        position:'absolute',
        top: 48,
        right: 24,
        width: 96,
        height: 96,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        backgroundColor: '#000000',
        zIndex: 100,
        elevation: 100
    },

    achievementsContainer: {
        height: 128,
        display: 'flex',
        flexDirection: 'row'
    },
    achievementsBox: {
        flex: 1,
        maxWidth: '30%',
        display: 'flex',
        justifyContent: 'space-evenly',
        marginHorizontal: 4,
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderColor: '#FFFFFF',
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 6,
        borderRightWidth: 6
    },
    title: {
        minHeight: 30,
        marginBottom: 12,
        fontSize: 16
    },
    description: {
        marginBottom: 12,
        fontSize: 10
    }
});

export { T0Identity };