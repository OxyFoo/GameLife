import * as React from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';

import BackActivity from '../PageBack/Activity';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text, Button, ComboBox, IconCheckable, TextSwitch, Icon } from '../Components';
import { PageHeader, ActivitySchedule, ActivityExperience } from '../Widgets';

/**
 * TODO
 * [] Afficher / charger / enregistrer les commentaires (a part ? Mettre un ID aux activités ?)
 * [x] Enregistrer localement / en ligne une activité
 * [x] Supprimer localement / en ligne une activité
 * [x] Page d'ajout terminé (ou commencement + bloquer sur cette page + compteur)
 */

const SCREEN_HEIGHT = Dimensions.get('window').height;

class Activity extends BackActivity {
    renderCategory = ({ item }) => {
        const { ID, icon } = item;
        const checked = this.state.selectedCategory === ID;
        return (
            <IconCheckable
                style={{ margin: '2%' }}
                id={ID}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.selectCategory}
                pressable={!this.state.visualisationMode}
            />
        )
    }

    renderPanelDetails = () => {
        const lang = langManager.curr['activity'];
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const skillID = this.state.selectedSkill.id;
        const skill = dataManager.skills.GetByID((skillID));
        return (
            <View>
                {/* Schedule */}
                <Text style={styles.title} bold>{lang['title-schedule']}</Text>
                <ActivitySchedule
                    editable={!this.state.visualisationMode}
                    onChange={this.onChangeSchedule}
                    initialValue={this.state.ActivitySchedule}
                />

                {/* Experience */}
                <Text style={styles.title} bold>{(skill !== null && skill.XP > 0) ? lang['title-experience'] : lang['title-no-experience']}</Text>
                <ActivityExperience
                    skillID={this.state.selectedSkill.id}
                    duration={this.state.activityDuration}
                />

                {/* Commentary */}
                {this.state.comment === null ? (
                    <Button
                        style={styles.comButton}
                        onPress={this.onAddComment}
                        color='main1'
                        fontSize={14}
                    >
                        {lang['add-commentary']}
                    </Button>
                ) : (
                    <View style={{ marginBottom: 48 }}>
                        {/* Comment title */}
                        <Text style={styles.title} bold>{lang['title-commentary']}</Text>

                        {/* Comment content */}
                        <TouchableOpacity
                            style={[styles.commentPanel, backgroundCard]}
                            activeOpacity={.6}
                            onPress={this.onEditComment}
                            onLongPress={this.onRemComment}
                        >
                            <Text style={styles.comment}>{this.state.comment}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Add / Remove button */}
                {this.state.visualisationMode ? (
                    <Button onPress={this.RemActivity} color='main2'>{lang['btn-remove']}</Button>
                ) : (
                    <Button onPress={this.AddActivity} color='main2'>{lang['btn-add']}</Button>
                )}
            </View>
        );
    }

    render() {
        const lang = langManager.curr['activity'];
        const inter = { inputRange: [0, 1], outputRange: [0, SCREEN_HEIGHT] };
        const panelPosY = this.state.animPosY.interpolate(inter);
        const stylePanel = [styles.panel,
            {
                minHeight: SCREEN_HEIGHT - this.state.posY - 12,
                transform: [{ translateY: panelPosY }],
                backgroundColor: themeManager.GetColor('backgroundGrey')
            }
        ];

        return (
            <Page
                ref={ref => this.pageRef = ref}
                scrollable={this.state.selectedSkill.id !== 0}
                canScrollOver={false}
                bottomOffset={0}
            >
                <PageHeader
                    onBackPress={user.interface.BackPage}
                />

                <View style={styles.parent}>

                    {/* Categories */}
                    <Text style={styles.title} bold>{lang['title-category']}</Text>
                    <FlatList
                        style={styles.fullWidth}
                        data={this.state.categories}
                        renderItem={this.renderCategory}
                        numColumns={6}
                        keyExtractor={(item, index) => 'c-' + index}
                    />

                    {/* Activities */}
                    <Text style={styles.title} bold>{lang['title-activity']}</Text>
                    <ComboBox
                        pageRef={this.pageRef}
                        style={{ marginBottom: 48 }}
                        data={this.state.skills}
                        title={this.getCategoryName()}
                        setSearchBar={true}
                        selectedValue={this.state.selectedSkill.value}
                        onSelect={this.selectActivity}
                        enabled={!this.state.visualisationMode}
                    />

                </View>

                {/* Panel */}
                <Animated.View
                    style={stylePanel}
                    onLayout={(event) => { this.setState({ posY: event.nativeEvent.layout.y }) }}
                >
                    {!this.state.visualisationMode &&
                        <TextSwitch
                            style={{ marginBottom: 24 }}
                            textLeft={lang['swiper-already']}
                            textRight={lang['swiper-now']}
                            onChange={this.onChangeMode}
                        />
                    }

                    {this.state.startnowMode ? (
                        <Button onPress={this.StartActivity} color='main2'>{lang['btn-start']}</Button>
                    ) : (
                        <this.renderPanelDetails />
                    )}
                </Animated.View>

            </Page>
        )
    }
}

const styles = StyleSheet.create({
    parent: {
        alignItems: 'center'
    },
    title: {
        marginBottom: 24,
        fontSize: 22
    },
    fullWidth: {
        width: '100%',
        marginBottom: 48
    },
    panel: {
        width: '110%',
        marginLeft: '-5%',
        padding: '5%',
        borderRadius: 24
    },
    panelChild: {
        position: 'absolute',
        left: 0,
        right: 0
    },
    comButton: {
        height: 48,
        marginBottom: 48,
        marginHorizontal: '5%'
    },
    commentPanel: {
        padding: '5%',
        borderRadius: 24
    },
    comment: {
        fontSize: 16,
        textAlign: 'left'
    }
});

export default Activity;