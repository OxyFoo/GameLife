import * as React from 'react';
import { Animated, View, Image } from 'react-native';

import styles from './style';
import BackChestReward from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import IMG_CHESTS, { IMG_CHEST_OX } from 'Ressources/items/chests/chests';
import { Page, Frame, Text, Button } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class ChestReward extends BackChestReward {
    render() {
        const langM = langManager.curr['modal'];

        // Default chest image
        let chestImage = IMG_CHESTS[0];
        if (this.chestRarity === 'ox') {
            chestImage = IMG_CHEST_OX;
        } else if (this.chestRarity > 0 && this.chestRarity < IMG_CHESTS.length) {
            chestImage = IMG_CHESTS[this.chestRarity];
        }

        const itemBackgroundStyle = {
            borderColor: this.rarityColor,
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        // Shake the chest
        const styleChestAnimation = {
            transform: [{
                rotateZ: this.state.animChest.interpolate({
                    inputRange: [0, 1, 2, 3, 4],
                    outputRange: ['0deg', '1deg', '-1deg', '1deg', '0deg']
                })
            }]
        };

        const styleText = {
            opacity: this.state.animItem,
            transform: [
                { translateY: WithInterpolation(this.state.animItem, 20, 0) }
            ]
        };
        const styleTextSecondary = {
            color: this.rarityColor
        };
        const styleButton = {
            opacity: this.state.animInteractions,
            transform: [
                { translateY: WithInterpolation(this.state.animInteractions, 20, 0) }
            ]
        };

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                canScrollOver={false}
            >
                <Animated.View
                    style={[
                        styles.container,
                        { transform: [{ scale: this.state.animGlobal }] }
                    ]}
                >
                    {/* Chest */}
                    <Animated.View style={[styleChestAnimation, styles.chestContainer]}>
                        <Image
                            style={styles.chestImage}
                            source={chestImage}
                        />
                    </Animated.View>

                    {/* Item */}
                    <Animated.View
                        style={[
                            styles.frameContainer,
                            { transform: [{ scale: this.state.animItem }] }
                        ]}
                    >
                        {this.chestRarity !== 'ox' && (
                            <Frame
                                style={[styles.frame, itemBackgroundStyle]}
                                characters={[ this.character ]}
                                onlyItems={true}
                                size={this.characterSize}
                                loadingTime={0}
                            />
                        ) || (
                            <View style={[styles.frameOX, itemBackgroundStyle]}>
                                <Image
                                    style={styles.OX}
                                    source={IMG_OX}
                                />
                            </View>
                        )}
                    </Animated.View>
                </Animated.View>

                {/* Text */}
                <Animated.View style={styleText}>
                    <Text color='primary' fontSize={24}>{this.text}</Text>
                    {!!this.textSecondary && (
                        <Text style={styleTextSecondary}>{this.textSecondary}</Text>
                    )}
                </Animated.View>

                <Button
                    style={styles.button}
                    styleAnimation={styleButton}
                    color='main1'
                    onPress={this.onPress}
                >
                    {langM['btn-continue']}
                </Button>
            </Page>
        );
    }
}

export default ChestReward;
