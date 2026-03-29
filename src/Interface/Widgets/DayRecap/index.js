import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Modal, ActivityIndicator, ScrollView } from 'react-native';
import ViewShot from 'react-native-view-shot';

import styles from './style';
import BackDayRecap from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import user from 'Managers/UserManager';
import { Icon, Text } from 'Interface/Components';
import { DynamicBackground } from 'Interface/Primitives';

import CardContent from './elements/CardContent';

/**
 * @typedef {import('./back').ActivityData} ActivityData
 */

class DayRecap extends BackDayRecap {
    render() {
        const { onClose } = this.props;
        const { isSharing, saveStatus, recapData } = this.state;

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

        const { totalMinutes, categories, statsGained, totalStats } = recapData;

        const langRecap = langManager.curr['calendar']?.['recap'] || {};
        const langStats = langManager.curr['statistics']?.['names'] || {};
        const langLevel = langManager.curr['level'] || {};

        // Check if there are no activities
        const hasNoActivities = categories.length === 0 || totalMinutes === 0;

        // Show empty state if no activities
        if (hasNoActivities) {
            return (
                <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                    <View style={styles.overlay}>
                        {/* Background touchable to close on tap */}
                        <TouchableWithoutFeedback onPress={onClose}>
                            <View style={styles.absoluteFill} />
                        </TouchableWithoutFeedback>

                        {/* Close button top right */}
                        <View style={styles.topRow}>
                            <TouchableOpacity style={styles.closeButtonTop} onPress={onClose}>
                                <Icon icon='close' color='primary' size={24} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.emptyCard, { backgroundColor: themeManager.GetColor('background') }]}>
                            <DynamicBackground opacity={0.2} />
                            <Icon icon='planner' color='secondary' size={64} />
                            <Text style={styles.emptyTitle} color='primary'>
                                {langRecap['empty-title'] || 'No activities'}
                            </Text>
                            <Text style={styles.emptyMessage} color='secondary'>
                                {langRecap['empty-message'] || 'Add activities to create your daily recap!'}
                            </Text>
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

        return (
            <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                <View style={styles.overlay}>
                    {/* Background touchable to close on tap */}
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.absoluteFill} />
                    </TouchableWithoutFeedback>

                    {/* Close button top right */}
                    <View style={styles.topRow}>
                        <TouchableOpacity style={styles.closeButtonTop} onPress={onClose}>
                            <Icon icon='close' color='primary' size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Visible card (9:16 inside ScrollView) */}
                    <ScrollView style={styles.visibleFrame} showsVerticalScrollIndicator={false}>
                        <ViewShot
                            ref={this.viewShotRef}
                            options={{ format: 'png', quality: 1, result: 'tmpfile', width: 1080, height: 1920 }}
                        >
                            <View style={[styles.visibleCard, { backgroundColor: cardBgColor }]}>
                                <DynamicBackground opacity={0.2} />
                                <CardContent
                                    recapData={recapData}
                                    donutData={donutData}
                                    radarData={radarData}
                                    totalTimeFormatted={totalTimeFormatted}
                                    statsKeys={statsKeys}
                                    date={this.props.date}
                                    formatDuration={this.formatDuration}
                                    langRecap={langRecap}
                                    langStats={langStats}
                                    langLevel={langLevel}
                                />
                            </View>
                        </ViewShot>
                    </ScrollView>

                    {/* Action buttons (outside captured area) */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: themeManager.GetColor('main2') }]}
                            onPress={this.saveToGallery}
                            disabled={saveStatus === 'saving'}
                        >
                            <Icon icon='save' color='primary' size={18} />
                            <Text style={styles.buttonText} color='primary'>
                                {saveStatus === 'saving'
                                    ? langRecap['saving'] || 'Saving...'
                                    : saveStatus === 'success'
                                      ? langRecap['saved-success'] || 'Confirmé ✓'
                                      : saveStatus === 'error'
                                        ? langRecap['saved-error'] || 'Échec ✗'
                                        : langRecap['save'] || 'Save'}
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
