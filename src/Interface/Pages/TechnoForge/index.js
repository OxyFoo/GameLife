import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles, { MAIN_SIZE, CATALYST_SIZE } from './style';
import BackTechnoForge from './back';
import { ForgeSlot } from './ForgeSlot';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, OxAmount, ProgressBar, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { FORGE_BASE_CHANCE } from '@oxyfoo/gamelife-types/Rules/TechnoForge';

class TechnoForge extends BackTechnoForge {
    render() {
        const lang = langManager.curr['technoforge'];
        const { onlineState, forging, ox } = this.state;

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

        // Under the main slot: what is missing, or that everything is ready
        const captionKey = blocker ?? 'caption-ready';
        const captionColor = blocker === null ? 'main3' : blocker === 'caption-max-rarity' ? 'warning' : 'light';

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
        const lineColor = { backgroundColor: themeManager.GetColor('main1', { opacity: 0.5 }) };

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
                    <View style={styles.oxRow}>
                        <Button
                            style={styles.oxButton}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openShop}
                        >
                            <OxAmount value={ox} fontSize={16} iconSize={20} />
                        </Button>
                    </View>

                    {/** The main copy, the step it is about to take, and the two catalysts under it */}
                    <View style={styles.forgeArea}>
                        <ForgeSlot
                            size={MAIN_SIZE}
                            label={lang['slot-main']}
                            stuff={main}
                            transitionTo={main === null ? undefined : this.GetTargetRarity()}
                            onPress={() => this.OpenPicker('main')}
                            enabled={!forging}
                        />
                        <Text style={[styles.caption, { color: themeManager.GetColor(captionColor) }]} fontSize={12}>
                            {lang[captionKey]}
                        </Text>

                        <View style={styles.connectors}>
                            <View style={[styles.connectorVertical, lineColor]} />
                            <View style={[styles.connectorHorizontal, lineColor]} />
                            <View style={styles.connectorBranches}>
                                <View style={[styles.connectorVertical, lineColor]} />
                                <View style={[styles.connectorVertical, lineColor]} />
                            </View>
                        </View>

                        <View style={styles.catalystsRow}>
                            <ForgeSlot
                                size={CATALYST_SIZE}
                                label={lang['slot-catalyst'].replace('{}', '1')}
                                stuff={catalysts[0]}
                                onPress={() => this.OpenPicker(0)}
                                enabled={!forging}
                            />
                            <ForgeSlot
                                size={CATALYST_SIZE}
                                label={lang['slot-catalyst'].replace('{}', '2')}
                                stuff={catalysts[1]}
                                onPress={() => this.OpenPicker(1)}
                                enabled={!forging}
                            />
                        </View>
                    </View>

                    {/** The chance of this attempt */}
                    <View style={styles.card}>
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
                    </View>

                    {/** The bonus and the price */}
                    <View style={styles.rows}>
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
                    </View>
                </ScrollView>

                <View style={styles.forgeButtonView}>
                    <Button onPress={this.OnForgePress} enabled={this.CanForge()} loading={forging}>
                        {lang['button-forge']}
                    </Button>
                </View>
            </View>
        );
    }

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.noInternetContainer}>
                <Icon icon='no-wifi' size={100} />
                <Text fontSize={22}>{lang['internet-offline-title']}</Text>
                <Text fontSize={14} color='secondary' style={styles.noInternetSubtext}>
                    {lang['internet-offline-text']}
                </Text>
            </View>
        );
    };
}

export default TechnoForge;
