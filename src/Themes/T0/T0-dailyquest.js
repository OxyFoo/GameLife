import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Dailyquest from '../../Pages/dailyquest';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLButton, GLDropDown, GLHeader, GLText } from './Components/GL-Components';
import { GetTimeToTomorrow, isUndefined } from '../../Functions/Functions';

class T0Dailyquest extends Dailyquest {
    render() {
        const dailyquestTime = langManager.curr['dailyquest']['info-remain-time'] + GetTimeToTomorrow();
        const define = langManager.curr['dailyquest']['daily-define-title'];
        const title = langManager.curr['dailyquest']['daily-title'];
        const bonus = langManager.curr['dailyquest']['bonus-title'];
        let categories;
        if (user.daily.length === 2) {
            categories = langManager.curr['dailyquest']['daily-categories-text'].replace('{}', user.daily[0].value).replace('{}', user.daily[1].value);
        }
        const edit = langManager.curr['dailyquest']['daily-edit-button'];

        const category1 = !isUndefined(this.state.selectedCategory1) ? this.state.selectedCategory1.value : langManager.curr['dailyquest']['daily-define-cat1'];
        const category2 = !isUndefined(this.state.selectedCategory2) ? this.state.selectedCategory2.value : langManager.curr['dailyquest']['daily-define-cat2'];
        const save = langManager.curr['dailyquest']['daily-define-button'];

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['dailyquest']['page-title']}
                    leftIcon="back"
                    small={true}
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.remainTime} title={dailyquestTime} />
                    {!this.state.enable ? (
                        <View style={styles.fullscreen}>
                            <GLText style={styles.titleS} title={define} />
                            <GLDropDown
                                style={{ width: '60%' }}
                                value={category1}
                                data={this.CATEGORIES}
                                onSelect={this.changeCat1}
                                onLongPress={() => this.changeCat1('')}
                            />
                            <GLDropDown
                                style={{ width: '60%' }}
                                value={category2}
                                data={this.CATEGORIES}
                                onSelect={this.changeCat2}
                                onLongPress={() => this.changeCat2('')}
                            />
                            <GLButton
                                containerStyle={styles.button}
                                value={save}
                                onPress={this.saveClick}
                            />
                        </View>
                    ) : (
                        <>
                            <GLText style={styles.title} title={title} />
                            <View style={styles.blockContainer}>
                                <GLText style={styles.textList} title="- Une heure d'acivité parmis les catégories suivantes :" />
                                <GLText title={categories} />
                            </View>

                            <GLText style={styles.title} title={bonus} />
                            <View style={styles.blockContainer}>
                                <GLText style={styles.textList} title="- Un quart d'heure dans la catégorie suivante" />
                            </View>

                            <GLButton
                                containerStyle={styles.button}
                                value={edit}
                                onPress={this.edit}
                            />
                        </>
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24
    },
    fullscreen: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    remainTime: {
        marginRight: 24,
        textAlign: 'right'
    },
    title: {
        paddingVertical: 48,
        fontSize: 26
    },
    text: {
        paddingVertical: 6,
        fontSize: 20
    },
    titleS: {
        paddingVertical: 12,
        fontSize: 26
    },
    button: {
        width: 164,
        height: 48,
        marginTop: 32
    },

    blockContainer: {
        padding: 12,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    textList: {
        marginVertical: 6,
        lineHeight: 18,
        textAlign: 'left'
    }
});

export { T0Dailyquest };