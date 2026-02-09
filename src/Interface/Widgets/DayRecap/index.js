import React from 'react';
import { View, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';

import styles from './style';
import BackDayRecap from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import user from 'Managers/UserManager';

import { DonutChart, Icon, ProgressBar, RadarChart, Text } from 'Interface/Components';
import { DynamicBackground } from 'Interface/Primitives';

// @ts-ignore
import GameLifeLogo from 'Ressources/logo/GameLife.png';

/**
 * @typedef {import('./back').ActivityData} ActivityData
 */

class DayRecap extends BackDayRecap {
    render() {
        const { onClose } = this.props;
        const { isSaving, isSharing, recapData } = this.state;

        // Show loading if data not ready
        if (!recapData) {
            return (
                <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                    <View style={styles.overlay}>
                        <ActivityIndicator size='large' color={themeManager.GetColor('main1')} />
                    </View>
                </Modal>
            );
        }

        const {
            username,
            level,
            xpGained,
            xpCurrent,
            xpNext,
            totalMinutes,
            categories,
            skills,
            statsGained,
            totalStats
        } = recapData;

        const langStats = langManager.curr['statistics']?.['names'] || {};
        const langRecap = langManager.curr['calendar']?.['recap'] || {};
        const langLevel = langManager.curr['level'] || {};

        // Check if there are no activities
        const hasNoActivities = categories.length === 0 || totalMinutes === 0;

        // Show empty state if no activities
        if (hasNoActivities) {
            return (
                <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                    <View style={styles.overlay}>
                        {/* Close button top right */}
                        <View style={styles.topRow}>
                            <TouchableOpacity style={styles.closeButtonTop} onPress={onClose}>
                                <Icon icon='close' color='primary' size={24} />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.card,
                                styles.emptyCard,
                                { backgroundColor: themeManager.GetColor('background') }
                            ]}
                        >
                            <DynamicBackground opacity={0.2} />
                            <Icon icon='planner' color='secondary' size={64} />
                            <Text style={styles.emptyTitle} color='primary'>
                                {langRecap['empty-title'] || 'No activities'}
                            </Text>
                            <Text style={styles.emptyMessage} color='secondary'>
                                {langRecap['empty-message'] || 'Add activities to create your daily recap!'}
                            </Text>
                        </View>

                        {/* Close button bottom */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.closeButtonInline, { backgroundColor: themeManager.GetColor('border') }]}
                                onPress={onClose}
                            >
                                <Icon icon='close' color='primary' size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }

        // Prepare donut chart data (from categories)
        const donutData = categories
            .filter((a) => a.durationMinutes > 0)
            .map((category) => ({
                label: category.name,
                value: category.durationMinutes,
                stroke: category.color
            }));

        // Prepare radar chart data
        const radarData = this.computeRadarData(totalStats);

        // Format total time
        const totalTimeFormatted = this.formatDuration(totalMinutes);

        // Get stats keys for display (only show non-zero stats)
        const statsKeys = user.experience.statsKey.filter((key) => statsGained[key] > 0);

        // Card background color from theme
        const cardBgColor = themeManager.GetColor('background');
        const borderColor = themeManager.GetColor('border');

        return (
            <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                <View style={styles.overlay}>
                    {/* Close button top right */}
                    <View style={styles.topRow}>
                        <TouchableOpacity style={styles.closeButtonTop} onPress={onClose}>
                            <Icon icon='close' color='primary' size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Capturable card */}
                    <ViewShot
                        ref={this.viewShotRef}
                        options={{ format: 'png', quality: 1, result: 'tmpfile', width: 1080 }}
                    >
                        <View style={[styles.card, { backgroundColor: cardBgColor }]}>
                            <DynamicBackground opacity={0.2} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title} color='primary'>
                                    {(langRecap['title'] || 'Today I did - {}').replace('{}', username)}
                                </Text>
                                <Text style={styles.dateText} color='secondary'>
                                    {this.props.date.toLocaleDateString(
                                        langManager.currentLangageKey === 'en' ? 'en-US' : 'fr-FR',
                                        {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }
                                    )}
                                </Text>
                            </View>

                            {/* Level progress bar */}
                            <View style={styles.levelContainer}>
                                <View style={styles.levelRow}>
                                    <Text style={styles.levelText} color='secondary'>
                                        {langLevel['level-small'] || 'Niv.'} {level}
                                    </Text>
                                    <Text style={styles.xpText} color='main1'>
                                        + {xpGained} {langLevel['xp'] || 'EXP'}
                                    </Text>
                                </View>
                                <ProgressBar
                                    style={styles.progressBar}
                                    value={xpCurrent}
                                    maxValue={xpNext}
                                    color='gradient'
                                    height={8}
                                />
                            </View>

                            {/* Donut chart + Activities list */}
                            <View style={styles.mainContent}>
                                <View style={styles.donutContainer}>
                                    <DonutChart
                                        data={donutData}
                                        size={120}
                                        strokeWidth={8}
                                        strokeLinecap='round'
                                        delay={0}
                                        segmentGap={10}
                                    >
                                        <View style={styles.donutCenter}>
                                            <Text style={styles.donutCenterText} color='primary'>
                                                {totalTimeFormatted}
                                            </Text>
                                        </View>
                                    </DonutChart>
                                </View>

                                <View style={styles.activitiesList}>
                                    {skills.slice(0, 4).map((skill, index) => (
                                        <View key={index} style={styles.activityItem}>
                                            <Text style={styles.activityName} color='primary'>
                                                {skill.name}{' '}
                                                <Text style={styles.activityDuration} color='secondary'>
                                                    - {this.formatDuration(skill.durationMinutes)}
                                                </Text>
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Separator */}
                            <View style={[styles.separator, { backgroundColor: borderColor }]} />

                            {/* Stats + Radar */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statsBars}>
                                    {statsKeys.map((key) => {
                                        const value = statsGained[key];

                                        return (
                                            <View key={key} style={styles.statBarRow}>
                                                <View
                                                    style={[
                                                        styles.statBadge,
                                                        { backgroundColor: themeManager.GetColor('main1') }
                                                    ]}
                                                >
                                                    <Text style={styles.statBadgeText} color='backgroundCard'>
                                                        +{value}
                                                    </Text>
                                                </View>
                                                <Text style={styles.statLabel} color='primary'>
                                                    {langStats[key] || key}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                <View style={styles.radarContainer}>
                                    <RadarChart data={radarData} size={160} showLabels={true} levels={4} />
                                </View>
                            </View>

                            {/* Footer with logo */}
                            <View style={styles.footer}>
                                <View style={styles.footerLeft}>
                                    <Image source={GameLifeLogo} style={styles.footerLogo} />
                                    <Text style={styles.logoText} color='main1'>
                                        {langRecap['footer'] || 'GameLife'}
                                    </Text>
                                </View>
                                <View style={styles.footerRight}>
                                    <Icon icon='apple' color='main1' size={16} />
                                    <Icon icon='android' color='main1' size={16} />
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* Action buttons (outside captured area) */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.closeButtonInline, { backgroundColor: themeManager.GetColor('border') }]}
                            onPress={onClose}
                        >
                            <Icon icon='close' color='primary' size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: themeManager.GetColor('main2') }]}
                            onPress={this.saveToGallery}
                            disabled={isSaving}
                        >
                            <Icon icon='save' color='primary' size={18} />
                            <Text style={styles.buttonText} color='primary'>
                                {isSaving ? langRecap['saving'] || 'Saving...' : langRecap['save'] || 'Save'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.shareButton, { backgroundColor: themeManager.GetColor('main1') }]}
                            onPress={() => this.shareImage('general')}
                            disabled={isSharing}
                        >
                            <Icon icon='share-2' color='primary' size={18} />
                            <Text style={styles.buttonText} color='primary'>
                                {isSharing ? langRecap['sharing'] || 'Sharing...' : langRecap['share'] || 'Share'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default DayRecap;
