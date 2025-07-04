import * as React from 'react';
import { View, Image, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackMissions from './back';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text, Zap } from 'Interface/Components';
import { IMG_OX } from 'Ressources/items/currencies/currencies';
import IMG_CHESTS from 'Ressources/items/chests/chests';
import { Title } from 'Interface/Pages/Home/title';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Missions').MissionType} MissionType
 */

class Missions extends BackMissions {
    render() {
        const lang = langManager.curr['missions'];
        const langHome = langManager.curr['home'];
        const { style } = this.props;
        const { mission } = this.state;

        if (mission === null || mission.state === 'claimed') {
            return null;
        }

        const missionsData = dataManager.missions.Get();
        const stepLength = missionsData.length;
        const step = Math.min(this.state.step, stepLength - 1);
        const stepReward = missionsData[step];

        const styleReward = {
            backgroundColor: themeManager.GetColor('main1')
        };
        const styleAnimation = {
            opacity: this.state.animReward.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0.8, 0]
            }),
            transform: [
                {
                    scale: this.state.animReward.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2]
                    })
                }
            ]
        };

        return (
            <>
                <Title title={langHome['section-missions']} />

                <Button
                    style={[styles.buttonContainer, style]}
                    onPress={this.handleNextMission}
                    appearance='uniform'
                    color='transparent'
                >
                    <LinearGradient
                        style={styles.gradient}
                        colors={[
                            themeManager.GetColor('main2', { opacity: 0.65 }),
                            themeManager.GetColor('main2', { opacity: 0.25 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.container}>
                            <View style={styles.zapContainer}>
                                <Zap
                                    style={styles.zap}
                                    inclinaison={mission.state === 'pending' ? 'onFourLegs' : 'onTwoLegs'}
                                />
                            </View>

                            <View style={styles.columnContent}>
                                {(mission?.state === 'pending' && (
                                    <View>
                                        <Text style={styles.text} fontSize={16}>
                                            {lang['content'][missionsData[step].name].title}
                                        </Text>

                                        <Text style={styles.text} fontSize={14}>
                                            {lang['text-hint']}
                                        </Text>
                                    </View>
                                )) || (
                                    <Text style={styles.text} fontSize={16}>
                                        {lang['text-claim']}
                                    </Text>
                                )}

                                <FlatList
                                    style={styles.flatlist}
                                    contentContainerStyle={styles.flatlistContainer}
                                    data={missionsData}
                                    extraData={step}
                                    renderItem={this.rewardListElement}
                                    horizontal
                                />
                            </View>

                            <View style={styles.columnReward}>
                                <View style={[styles.rewardCard, styleReward]}>
                                    <Animated.View style={[styles.rewardItem, styleAnimation]}>
                                        {this.renderReward(stepReward)}
                                    </Animated.View>
                                </View>

                                <Text style={styles.missionStep} fontSize={12}>{`${step + 1}/${stepLength}`}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Button>
            </>
        );
    }

    /** @param {{ item: MissionType, index: number }} param0 */
    rewardListElement = ({ item, index }) => {
        const { step } = this.state;

        const active = index >= step;
        const current = index === step;

        const styleRewardPreview = {
            opacity: current ? 1 : 0.5,
            backgroundColor: themeManager.GetColor(current || active ? 'main1' : 'background')
        };

        return <View style={[styles.rewardPreview, styleRewardPreview]}>{this.renderReward(item, true)}</View>;
    };

    /**
     * @param {MissionType} item
     * @param {boolean} [hideOxText=false]
     */
    renderReward(item, hideOxText = false) {
        if (item.rewards.length <= 0) {
            return null;
        }

        const firstReward = item.rewards[0];
        if (firstReward.Type === 'OX') {
            return (
                <>
                    <Image style={styles.rewardImage} source={IMG_OX} />
                    {!hideOxText && (
                        <Text style={styles.rewardValue} fontSize={14}>
                            {`x${firstReward.Amount}`}
                        </Text>
                    )}
                </>
            );
        } else if (firstReward.Type === 'Chest') {
            return <Image style={styles.rewardImage} source={IMG_CHESTS[firstReward.ChestRarity]} />;
        } else {
            return null;
        }
    }
}

export { Missions };
