import * as React from 'react';
import { View, Image, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackMissions from './back';
import { MISSIONS } from 'Data/User/Missions';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text, Zap } from 'Interface/Components';
import { IMG_OX } from 'Ressources/items/currencies/currencies';
import IMG_CHESTS from 'Ressources/items/chests/chests';

/**
 * @typedef {import('Types/Global/Rarities').Rarities} Rarities
 * @typedef {import('Types/Data/User/Missions').MissionType} MissionType
 */

class Missions extends BackMissions {
    render() {
        const lang = langManager.curr['missions'];
        const { style } = this.props;
        const { mission } = this.state;

        if (mission === null || mission.state === 'claimed') {
            return null;
        }

        const stepLength = MISSIONS.length;
        const step = Math.min(this.state.step, stepLength - 1);
        const stepReward = MISSIONS[step];

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
            <Button
                style={[styles.buttonContainer, style]}
                onPress={this.handleNextMission}
                appearance='uniform'
                color='transparent'
            >
                <LinearGradient
                    style={styles.container}
                    colors={[
                        themeManager.GetColor('main2', { opacity: 0.65 }),
                        themeManager.GetColor('main2', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.columnZap}>
                        <Zap
                            style={styles.zap}
                            inclinaison={mission.state === 'pending' ? 'onFourLegs' : 'onTwoLegs'}
                        />
                    </View>

                    <View style={styles.columnContent}>
                        {(mission?.state === 'pending' && (
                            <View>
                                <Text style={styles.text} fontSize={16}>
                                    {lang['content'][MISSIONS[step].name].title}
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
                            data={MISSIONS}
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

                        <Text fontSize={12}>{`${step + 1}/${stepLength}`}</Text>
                    </View>
                </LinearGradient>
            </Button>
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
        if (item.rewardType === 'ox') {
            return (
                <>
                    <Image style={styles.rewardImage} source={IMG_OX} />
                    {!hideOxText && (
                        <Text style={styles.rewardValue} fontSize={14}>
                            {`x${item.amount}`}
                        </Text>
                    )}
                </>
            );
        } else if (item.rewardType === 'chest') {
            return <Image style={styles.rewardImage} source={IMG_CHESTS[item.rarity]} />;
        } else {
            return null;
        }
    }
}

export default Missions;
