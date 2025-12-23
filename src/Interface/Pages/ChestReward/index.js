import * as React from 'react';
import { Animated, View, Image } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import OxObject from './OxObject';
import BackChestReward from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS, { IMG_CHEST_OX } from 'Ressources/items/chests/chests';
import { Text, Button } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class ChestReward extends BackChestReward {
    render() {
        const langM = langManager.curr['modal'];
        const { frameSize, animChest, animItem, animInteractions, animGlobal } = this.state;

        // Default chest image
        let chestImage = IMG_CHESTS.common;
        if (this.chestRarity === 'ox') {
            chestImage = IMG_CHEST_OX;
        } else {
            chestImage = IMG_CHESTS[this.chestRarity];
        }

        const itemBackgroundStyle = {
            borderColor: this.rarityColor
        };

        // Shake the chest
        const styleChestAnimation = {
            opacity: animItem.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            }),
            transform: [
                {
                    scale: animItem.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.5]
                    })
                },
                {
                    rotateZ: animChest.interpolate({
                        inputRange: [0, 1, 2, 3, 4],
                        outputRange: ['0deg', '1deg', '-1deg', '1deg', '0deg']
                    })
                }
            ]
        };

        const styleText = {
            opacity: animItem,
            transform: [{ translateY: WithInterpolation(animItem, 20, 0) }]
        };
        const styleTextSecondary = {
            color: this.rarityColor
        };
        const styleButton = {
            opacity: animInteractions,
            transform: [{ translateY: WithInterpolation(animInteractions, 20, 0) }]
        };

        // Ox objects
        const oxObjects = [];
        if (this.chestRarity === 'ox') {
            let count = 10;
            if (this.oxCount > 500) count = 50;
            else if (this.oxCount > 1000) count = 100;

            for (let i = 0; i < count; i++) {
                oxObjects.push(
                    <OxObject
                        key={`ox-obj-${i}`}
                        index={i}
                        total={count}
                        parentLayout={{ width: frameSize, height: frameSize }}
                    />
                );
            }
        }

        const avatarFrameSize = frameSize - styles.frame.borderWidth * 2;
        const avatarRenderScale = this.avatarPosition?.scale && this.avatarPosition.scale >= 3 ? 2 : 1;

        return (
            <View style={styles.page}>
                <Animated.View style={[styles.container, { transform: [{ scale: animGlobal }] }]}>
                    {/* Chest */}
                    <Animated.View style={[styleChestAnimation, styles.chestContainer]}>
                        <Image style={styles.chestImage} source={chestImage} />
                    </Animated.View>

                    {/* Item */}
                    <Animated.View
                        style={[styles.frameContainer, { transform: [{ scale: animItem }] }]}
                        onLayout={this.onFrameLayout}
                    >
                        {(this.chestRarity !== 'ox' && this.avatarPosition !== null && avatarFrameSize > 0 && (
                            <View style={[styles.frame, itemBackgroundStyle]}>
                                <AvatarFrame
                                    width={avatarFrameSize}
                                    height={avatarFrameSize}
                                    renderScale={avatarRenderScale}
                                    backgroundColor={themeManager.GetColor('backgroundCard')}
                                >
                                    <AvatarCharacter
                                        body={this.avatarBody}
                                        bodyColor={this.avatarBodyColor}
                                        position={this.avatarPosition.pos}
                                        scale={this.avatarPosition.scale}
                                        items={this.avatarItems}
                                    />
                                </AvatarFrame>
                            </View>
                        )) || (
                            <View style={[styles.frameOX, itemBackgroundStyle]} onLayout={this.onFrameLayout}>
                                {oxObjects}
                            </View>
                        )}
                    </Animated.View>
                </Animated.View>

                {/* Text */}
                <Animated.View style={styleText}>
                    <Text color='primary' fontSize={24}>
                        {this.text}
                    </Text>
                    {!!this.textSecondary && <Text style={styleTextSecondary}>{this.textSecondary}</Text>}
                </Animated.View>

                <Button style={styles.button} styleAnimation={styleButton} color='main1' onPress={this.onPress}>
                    {langM['btn-continue']}
                </Button>
            </View>
        );
    }
}

export default ChestReward;
