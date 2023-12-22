import * as React from 'react';
import { Animated, Image, View } from 'react-native';

import styles from './style';
import BackChestReward from './back';
import { IMG_CHESTS } from './chests';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Page, Frame, Text, Button } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class ChestReward extends BackChestReward {
    render() {
        const langM = langManager.curr['modal'];

        const itemBackgroundStyle = {
            borderColor: this.rarityColor,
            backgroundColor: themeManager.GetColor('backgroundCard')
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
                    <View style={styles.chestContainer}>
                        <Image
                            style={styles.chestImage}
                            source={IMG_CHESTS[this.chestRarity]}
                        />
                    </View>

                    {/* Item */}
                    <Animated.View
                        style={[
                            styles.frameContainer,
                            { transform: [{ scale: this.state.animItem }] }
                        ]}
                    >
                        <Frame
                            style={[styles.frame, itemBackgroundStyle]}
                            characters={[ this.character ]}
                            onlyItems={true}
                            size={this.characterSize}
                        />
                    </Animated.View>
                </Animated.View>

                {/* Text */}
                <Animated.View style={styleText}>
                    <Text color='primary' fontSize={24}>{this.text}</Text>
                    <Text style={styleTextSecondary}>{this.textSecondary}</Text>
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
