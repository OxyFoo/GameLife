import * as React from 'react';
import { Animated, View, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles, { MAIN_SIZE, CATALYST_SIZE } from './style';
import BackTechnoForge from './back';
import { ForgeSlot } from './ForgeSlot';
import { ForgeParticles } from './ForgeParticles';
import { ForgePath } from './ForgePath';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, OxAmount, ProgressBar, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { FORGE_BASE_CHANCE, IsForgeOpen } from '@oxyfoo/gamelife-types/Rules/TechnoForge';

class TechnoForge extends BackTechnoForge {
    render() {
        const lang = langManager.curr['technoforge'];
        const { onlineState, forging, phase, ox, layoutMain } = this.state;

        if (onlineState !== 'authenticated') {
            return this.renderNoInternet();
        }

        const main = this.GetMain();
        const catalysts = this.GetCatalysts();
        const catalystCount = this.GetCatalystIDs().length;
        const cost = this.GetCost() ?? 0;
        const chance = Math.round(this.GetChance() * 100);
        const dexBonus = Math.round(this.GetDexBonus() * 100);
        const blocker = this.GetBlocker();

        // Under the main slot: what is missing, or that everything is ready; the step of the attempt while it plays
        const captionKey = blocker ?? 'caption-ready';
        const captionColor = blocker === null ? 'main3' : 'light';
        const targetRarity = this.GetTargetRarity();
        const verdictColor =
            phase === 'success' && targetRarity !== null ? themeManager.GetRariryColors(targetRarity)[0] : null;
        const phaseColor =
            phase === 'failure' ? themeManager.GetColor('secondary') : (verdictColor ?? themeManager.GetColor('main3'));

        // The choreography: the slots fill, the path lights up, the main copy shakes and glows, then takes the verdict.
        // The shake is the looped wave scaled by the charge, which only ever eases: nothing snaps.
        const wave = this.animShake.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-1, 0, 1] });
        const shake = Animated.multiply(wave, this.animCharge);
        const styleMain = {
            transform: [
                phase === 'failure'
                    ? { translateY: this.animOutcome.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }
                    : { scale: this.animOutcome.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1.06] }) },
                { translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] }) },
                { rotateZ: shake.interpolate({ inputRange: [-1, 1], outputRange: ['-2.5deg', '2.5deg'] }) }
            ]
        };
        const styleGlow = {
            borderColor: verdictColor ?? themeManager.GetColor('main3'),
            opacity: Animated.multiply(this.animGlow, this.animCharge).interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.9]
            })
        };
        const liquidColor = themeManager.GetColor('main3');
        // Everything but the main copy fades before the result screen
        const styleFade = { opacity: this.animFade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) };
        const particlesAt = { left: layoutMain.x + layoutMain.width / 2, top: layoutMain.y + layoutMain.height / 2 };

        // Under the chance bar: how the number is made
        const base = FORGE_BASE_CHANCE[Math.max(1, catalystCount)];
        let chanceCaption = lang['chance-caption-1'];
        if (catalystCount > 0) {
            const key = base + dexBonus > 100 ? 'chance-caption-capped' : 'chance-caption-detail';
            chanceCaption = lang[key].replace('{}', base.toString()).replace('{}', dexBonus.toString());
        }

        // Opaque enough to stay readable, translucent enough to belong to the page (raid card)
        const overlay = [
            themeManager.GetColor('background', { opacity: 0.88 }),
            themeManager.GetColor('background', { opacity: 0.97 })
        ];

        return (
            <View style={styles.page}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <PageHeader
                        title={lang['title']}
                        onBackPress={this.onBack}
                        secondaryIcon='info-circle-outline'
                        secondaryIconColor='gradient'
                        onSecondaryIconPress={this.OpenInfo}
                    />

                    {/** Ox owned, like the calendar: tap to open the shop */}
                    <Animated.View style={[styles.oxRow, styleFade]}>
                        <Button
                            style={styles.oxButton}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openShop}
                            enabled={!forging}
                        >
                            <OxAmount value={ox} fontSize={16} iconSize={20} />
                        </Button>
                    </Animated.View>

                    {/** The main copy, the step it is about to take, and the two catalysts under it */}
                    <View style={styles.forgeArea}>
                        <Animated.View style={[styles.mainSlot, styleMain]} onLayout={this.onLayoutMain}>
                            <ForgeSlot
                                size={MAIN_SIZE}
                                label={lang['slot-main']}
                                stuff={main}
                                transitionTo={
                                    main === null || phase === 'success' || !IsForgeOpen(main.Rarity)
                                        ? undefined
                                        : targetRarity
                                }
                                onPress={() => this.OpenPicker('main')}
                                enabled={!forging}
                            />
                            <Animated.View style={[styles.slotGlow, styleGlow]} pointerEvents='none' />
                        </Animated.View>
                        {(phase === 'success' || phase === 'failure') && (
                            <ForgeParticles
                                style={particlesAt}
                                progress={this.animParticles}
                                color={phase === 'success' ? phaseColor : themeManager.GetColor('border')}
                                count={phase === 'success' ? 16 : 10}
                                distance={phase === 'success' ? 96 : 64}
                                rise={phase === 'success' ? 12 : -28}
                            />
                        )}
                        {phase === 'idle' ? (
                            <Animated.View style={styleFade}>
                                <Text
                                    style={[styles.caption, { color: themeManager.GetColor(captionColor) }]}
                                    fontSize={12}
                                >
                                    {lang[captionKey]}
                                </Text>
                            </Animated.View>
                        ) : (
                            <Animated.View style={styleFade}>
                                <Text style={[styles.phaseText, { color: phaseColor }]} fontSize={12} bold>
                                    {lang[`phase-${phase}`]}
                                </Text>
                            </Animated.View>
                        )}

                        <Animated.View style={[styles.connectors, styleFade]}>
                            <ForgePath
                                progress={this.animPath}
                                lineColor={themeManager.GetColor('main1', { opacity: 0.5 })}
                                litColor={liquidColor}
                            />
                        </Animated.View>

                        <Animated.View style={[styles.catalystsRow, styleFade]}>
                            <ForgeSlot
                                size={CATALYST_SIZE}
                                label={lang['slot-catalyst'].replace('{}', '1')}
                                stuff={catalysts[0]}
                                onPress={() => this.OpenPicker(0)}
                                enabled={!forging}
                                fill={this.animFills[0]}
                                fillColor={liquidColor}
                            />
                            <ForgeSlot
                                size={CATALYST_SIZE}
                                label={lang['slot-catalyst'].replace('{}', '2')}
                                stuff={catalysts[1]}
                                onPress={() => this.OpenPicker(1)}
                                enabled={!forging}
                                fill={this.animFills[1]}
                                fillColor={liquidColor}
                            />
                        </Animated.View>
                    </View>

                    {/** The chance of this attempt */}
                    <Animated.View style={[styles.card, styleFade]}>
                        <LinearGradient
                            style={StyleSheet.absoluteFill}
                            colors={overlay}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                        <View style={[styles.cardBorder, { borderColor: themeManager.GetColor('border') }]}>
                            <View style={styles.chanceHeader}>
                                <Text style={styles.chanceTitle} fontSize={16} bold>
                                    {lang['chance-title']}
                                </Text>
                                <View style={styles.chanceValueRow}>
                                    <Text style={styles.chanceValue} fontSize={22} color='main3' bold>
                                        {`${chance} %`}
                                    </Text>
                                    {chance >= 100 && (
                                        <Text style={styles.chanceMax} fontSize={10} color='light'>
                                            {lang['chance-max']}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <ProgressBar
                                style={styles.chanceBar}
                                height={8}
                                color='gradient'
                                value={chance}
                                maxValue={100}
                            />
                            <Text style={styles.chanceCaption} fontSize={11} color='light'>
                                {chanceCaption}
                            </Text>
                        </View>
                    </Animated.View>

                    {/** The bonus and the price */}
                    <Animated.View style={[styles.rows, styleFade]}>
                        <View style={styles.row}>
                            <Icon icon='bolt' size={18} color='main1' />
                            <Text style={styles.rowLabel} fontSize={14} color='secondary'>
                                {lang['row-dex-bonus']}
                            </Text>
                            <Text fontSize={14} color='main1' bold>
                                {`+${dexBonus} %`}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Icon icon='ox' size={18} />
                            <Text style={styles.rowLabel} fontSize={14} color='secondary'>
                                {lang['row-cost']}
                            </Text>
                            <OxAmount value={cost} fontSize={14} color={ox >= cost ? 'white' : 'error'} bold />
                        </View>
                    </Animated.View>
                </ScrollView>

                <Animated.View style={[styles.forgeButtonView, styleFade]}>
                    <Button onPress={this.OnForgePress} enabled={this.CanForge()} loading={forging}>
                        {lang['button-forge']}
                    </Button>
                </Animated.View>
            </View>
        );
    }

    /** The header stays: without the navbar, it is the only way back (no hardware button on iOS) */
    renderNoInternet = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.page}>
                <View style={styles.content}>
                    <PageHeader title={langManager.curr['technoforge']['title']} onBackPress={this.onBack} />
                </View>
                <View style={styles.noInternetContainer}>
                    <Icon icon='no-wifi' size={100} />
                    <Text fontSize={22}>{lang['internet-offline-title']}</Text>
                    <Text fontSize={14} color='secondary' style={styles.noInternetSubtext}>
                        {lang['internet-offline-text']}
                    </Text>
                </View>
            </View>
        );
    };
}

export default TechnoForge;
