import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackMissions from './back';
import { MISSIONS } from 'Class/Missions';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text, Zap } from 'Interface/Components';
import { IMG_OX } from 'Ressources/items/currencies/currencies';
import IMG_CHESTS from 'Ressources/items/chests/chests';

/**
 * @typedef {import('Class/Missions').MissionsType} MissionsType
 */

class Missions extends BackMissions {
    render() {
        const lang = langManager.curr['missions'];
        const { style } = this.props;
        const { mission } = this.state;

        if (mission.state === 'claimed') {
            return null;
        }

        const stepLength = MISSIONS.length;
        const step = Math.min(this.state.step, stepLength - 1);
        const stepReward = MISSIONS[step];

        const styleReward = {
            backgroundColor: themeManager.GetColor('main1')
        };

        const backgroundColor = [ '#B839FE', '#8A3DFE' ];

        return (
            <Button style={styles.buttonContainer} onPress={this.handleNextMission}>
                <LinearGradient
                    style={[styles.container, style]}
                    colors={backgroundColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.columnZap}>
                        <Zap
                            style={styles.zap}
                            inclinaison={mission.state === 'pending' ? 'onFourLegs' : 'onTwoLegs'}
                        />
                    </View>

                    <View style={styles.columnContent}>
                        <Text style={styles.title} bold>
                            {lang['text-title']}
                        </Text>

                        {mission?.state === 'pending' && (
                            <View>
                                <Text style={styles.text} fontSize={14}>
                                    {lang['content'][MISSIONS[step].name].title}
                                </Text>

                                <Text style={styles.text} fontSize={12}>
                                    {lang['text-hint']}
                                </Text>
                            </View>
                        ) || (
                            <Text style={styles.text} fontSize={16} bold>
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
                        <View style={[styles.rewardItem, styleReward]}>
                            {this.renderReward(stepReward.rewardType, stepReward.rewardValue)}
                        </View>

                        <Text fontSize={12}>
                            {`${step + 1}/${stepLength}`}
                        </Text>
                    </View>
                </LinearGradient>
            </Button>
        );
    }

    /** @param {{ item: MissionsType, index: number }} param0 */
    rewardListElement = ({ item, index }) => {
        const { step } = this.state;

        const active = index >= step;
        const current = index === step;

        const styleRewardPreview = {
            opacity: current ? 1 : 0.5,
            backgroundColor: themeManager.GetColor(current || active ? 'main1' : 'background')
        };

        return (
            <View style={[styles.rewardPreview, styleRewardPreview]}>
                {this.renderReward(item.rewardType, item.rewardValue, true)}
            </View>
        );
    }

    /**
     * @param {'ox' | 'chest'} rewardType
     * @param {number} rewardValue Ox amount or chest rarity
     * @param {boolean} [hideOxText=false]
     */
    renderReward(rewardType, rewardValue, hideOxText = false) {
        if (rewardType === 'ox') {
            return (
                <>
                    <Image
                        style={styles.rewardImage}
                        source={IMG_OX}
                    />
                    {!hideOxText && (
                        <Text style={styles.rewardValue} fontSize={14}>
                            {'x' + rewardValue.toString()}
                        </Text>
                    )}
                </>
            );
        }

        else if (rewardType === 'chest') {
            return (
                <Image
                    style={styles.rewardImage}
                    source={IMG_CHESTS[rewardValue]}
                />
            );
        }
    }
}

export default Missions;
