import * as React from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';

import BackExperience from '../back/experience';
import { GLHeader, GLText, GLXPBar } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class Experience extends BackExperience {
    render() {
        const userExperience = user.experience.getExperience();
        const totalXP = user.xp;
        const XP = userExperience.xp;
        const LVL = userExperience.lvl;
        const nextLvlXP = userExperience.next;
        const lang_experience = langManager.curr['experience'];

        const textLVL = langManager.curr['level']['level-small'] + ' ' + LVL;
        const textLVLLeft = lang_experience['XPLeftToReach'];

        const title_total = lang_experience['name-total'];
        const value_total = totalXP;

        const firstDate = user.activitiyManager.getFirst();
        firstDate.setHours(0, 0, 0);
        const delta = (new Date()) - firstDate;
        const delta_days = Math.ceil(delta / (1000 * 60 * 60 * 24));
        const title_average = lang_experience['name-average'];
        const value_average = Math.max(0, parseInt(totalXP / delta_days));

        const date = new Date();
        date.setHours(0, 0, 0);
        const title_day = lang_experience['name-day'];
        const value_day = user.experience.getExperience(undefined, date).totalXP;
        const currDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
        date.setDate(date.getDate() - currDay);
        const title_week = lang_experience['name-week'];
        const value_week = user.experience.getExperience(undefined, date).totalXP;
        date.setDate(0);
        const title_month = lang_experience['name-month'];
        const value_month = user.experience.getExperience(undefined, date).totalXP;
        date.setMonth(0);
        const title_year = lang_experience['name-year'];
        const value_year = user.experience.getExperience(undefined, date).totalXP;

        const _experience = user.experience.getExperience();
        const next10lvl = Math.ceil(_experience.lvl / 10) * 10;
        const next100lvl = Math.ceil(_experience.lvl / 100) * 100;
        const title_next = lang_experience['name-next'];
        const value_next = _experience.next - _experience.xp;
        const title_10 = lang_experience['name-next-x'].replace('{}', next10lvl);
        const value_10 = user.experience.getXPTo(next10lvl) - _experience.totalXP;
        const title_100 = lang_experience['name-next-x'].replace('{}', next100lvl);
        const value_100 = user.experience.getXPTo(next100lvl) - _experience.totalXP;

        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title={lang_experience['page-title']}
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={styles.container}>
                    <View>
                        <GLText style={styles.textLevel} title={textLVL} />
                        <GLXPBar value={XP} max={nextLvlXP} style={styles.containerUserXP} />
                    </View>

                    <View>
                        <GLText style={styles.textLevel} title={title_total} value={value_total} />
                        <GLText style={styles.textLevel} title={title_average} value={value_average} />
                    </View>

                    <View>
                        <GLText style={styles.textLevel} title={title_day} value={value_day} />
                        <GLText style={styles.textLevel} title={title_week} value={value_week} />
                        <GLText style={styles.textLevel} title={title_month} value={value_month} />
                        <GLText style={styles.textLevel} title={title_year} value={value_year} />
                    </View>

                    <View>
                        <GLText style={styles.textLevel} title={textLVLLeft} />
                        <GLText style={styles.textLevel} title={title_next} value={value_next} />
                        <GLText style={styles.textLevel} title={title_10} value={value_10} />
                        <GLText style={styles.textLevel} title={title_100} value={value_100} />
                    </View>
                </View>
            </View>
        )
    }
}

const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

// peut etre devoir faire une scroll view pour celle la quand même, je suis pas sur de comment ca va s'adapter.. (a voir sur petit écran)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "7%",
        display: 'flex',
        justifyContent: 'space-around',
    },
    textLevel: {
        marginVertical: "1.5%",
        fontSize: ww * 48 / 1000,
        textAlign: 'left'
    }
});

export default Experience;