import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import BackTechnoForgeResult from './back';
import { RarityLabel } from '../RarityLabel';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, OxAmount, Separator, Text } from 'Interface/Components';
import { WithInterpolation } from 'Utils/Animations';

class TechnoForgeResult extends BackTechnoForgeResult {
    render() {
        const lang = langManager.curr['technoforge'];
        const { layoutFrame, animItem, animText, animInteractions, animGlobal } = this.state;
        const { success, fromRarity, toRarity, cost } = this.outcome;

        const styleText = {
            opacity: animText,
            transform: [{ translateY: WithInterpolation(animText, 20, 0) }]
        };
        const styleButtons = {
            opacity: animInteractions,
            transform: [{ translateY: WithInterpolation(animInteractions, 20, 0) }]
        };

        const frameWidth = layoutFrame.width / 2;
        const frameHeight = (layoutFrame.height - styles.frame.borderWidth * 2) / 2;
        const avatarRenderScale = this.avatarPosition?.scale && this.avatarPosition.scale >= 3 ? 2 : 1;

        const overlay = [
            themeManager.GetColor('background', { opacity: 0.88 }),
            themeManager.GetColor('background', { opacity: 0.97 })
        ];

        return (
            <View style={styles.page}>
                <Animated.View style={[styles.container, { transform: [{ scale: animGlobal }] }]}>
                    {/** Verdict */}
                    <Animated.View style={[styles.textContainer, styleText]}>
                        <Text fontSize={32} color={success ? 'main2' : 'secondary'} bold>
                            {lang[success ? 'result-success-title' : 'result-failure-title']}
                        </Text>
                        <Text style={styles.subtitle} fontSize={12} color='light'>
                            {lang[success ? 'result-success-subtitle' : 'result-failure-subtitle']}
                        </Text>
                    </Animated.View>

                    {/** The copy */}
                    <Animated.View
                        style={[styles.frameContainer, { transform: [{ scale: animItem }] }]}
                        onLayout={this.onFrameLayout}
                    >
                        {this.avatarPosition !== null && layoutFrame.width > 0 && layoutFrame.height > 0 && (
                            <View style={[styles.frame, { borderColor: this.rarityColor }]}>
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
                                <View style={styles.frameFooter}>
                                    <Text fontSize={16} bold>
                                        {this.itemName}
                                    </Text>
                                    <RarityLabel from={success ? toRarity : fromRarity} />
                                </View>
                            </View>
                        )}
                    </Animated.View>

                    {/** The step taken, or not, and the price */}
                    <Animated.View style={[styles.card, styleText]}>
                        <LinearGradient
                            style={StyleSheet.absoluteFill}
                            colors={overlay}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                        <View style={[styles.cardBorder, { borderColor: themeManager.GetColor('border') }]}>
                            <View style={styles.transitionRow}>
                                {success ? (
                                    <RarityLabel from={fromRarity} to={toRarity} fontSize={16} />
                                ) : (
                                    <>
                                        <RarityLabel from={fromRarity} fontSize={16} />
                                        <Text fontSize={12} color='light'>
                                            {lang['result-unchanged']}
                                        </Text>
                                    </>
                                )}
                            </View>
                            <Separator style={styles.separator} color='border' />
                            <View style={styles.costRow}>
                                <Text fontSize={12} color='light'>
                                    {lang['result-cost']}
                                </Text>
                                <OxAmount value={cost} fontSize={14} color='white' bold />
                            </View>
                            {!success && (
                                <Text style={styles.failureText} fontSize={12} color='secondary'>
                                    {lang['result-failure-text']}
                                </Text>
                            )}
                        </View>
                    </Animated.View>
                </Animated.View>

                <Animated.View style={[styles.buttons, styleButtons]}>
                    <Button color='main1' onPress={this.onViewItem}>
                        {lang['result-button-view']}
                    </Button>
                    <Button appearance='outline' icon='anvil' onPress={this.onBackToForge}>
                        {lang['result-button-back']}
                    </Button>
                </Animated.View>
            </View>
        );
    }
}

export default TechnoForgeResult;
