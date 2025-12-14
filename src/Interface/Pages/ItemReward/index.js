import * as React from 'react';
import { Animated, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import BackItemReward from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class ItemReward extends BackItemReward {
    render() {
        const langM = langManager.curr['modal'];
        const { layoutFrame, animItem, animInteractions, animGlobal } = this.state;

        const itemBackgroundStyle = {
            borderColor: this.rarityColor
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

        const frameWidth = layoutFrame.width / 2;
        const frameHeight = (layoutFrame.height - styles.frame.borderWidth * 2) / 2;
        const avatarRenderScale = this.avatarPosition?.scale && this.avatarPosition.scale >= 3 ? 2 : 1;

        return (
            <View style={styles.page}>
                <Animated.View style={[styles.container, { transform: [{ scale: animGlobal }] }]}>
                    {/* Item */}
                    <Animated.View
                        style={[styles.frameContainer, { transform: [{ scale: animItem }] }]}
                        onLayout={this.onFrameLayout}
                    >
                        {this.avatarPosition !== null && layoutFrame.width > 0 && layoutFrame.height > 0 && (
                            <View style={[styles.frame, itemBackgroundStyle]}>
                                <AvatarFrame
                                    style={styles.avatarFrame}
                                    width={frameWidth}
                                    height={frameHeight}
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
                        )}
                    </Animated.View>
                </Animated.View>

                {/* Text */}
                <Animated.View style={[styles.textContainer, styleText]}>
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

export default ItemReward;
