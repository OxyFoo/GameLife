import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Modal, ActivityIndicator, ScrollView } from 'react-native';
import ViewShot from 'react-native-view-shot';

import styles from './style';
import BackDayRecap from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import { Icon, Text } from 'Interface/Components';
import { DynamicBackground } from 'Interface/Primitives';

import CardContent from './elements/CardContent';
import { TEMPLATE_NAMES } from './templates';

class DayRecap extends BackDayRecap {
    render() {
        const { onClose } = this.props;
        const { isSharing, saveStatus, template, recapData } = this.state;

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

        const langHome = langManager.curr['home'] || {};
        const langRecap = {
            ...(langManager.curr['calendar']?.['recap'] || {}),
            activities: langHome['today-activity'] || 'Activities',
            quests: langHome['today-quest'] || 'Quests'
        };
        const langStats = langManager.curr['statistics']?.['names'] || {};
        const langLevel = langManager.curr['level'] || {};

        // Check if there are no activities
        const hasNoActivities = recapData.categories.length === 0 || recapData.totalMinutes === 0;

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

        // Card background color from theme
        const cardBgColor = themeManager.GetColor('background');

        return (
            <Modal visible transparent animationType='fade' onRequestClose={onClose}>
                <View style={styles.overlay}>
                    {/* Background touchable to close on tap */}
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.absoluteFill} />
                    </TouchableWithoutFeedback>

                    {/* Top row: template buttons (left) + close (right) */}
                    <View style={styles.topRow}>
                        <View style={styles.templateButtons}>
                            {TEMPLATE_NAMES.map((name, index) => (
                                <TouchableOpacity
                                    key={name}
                                    style={[
                                        styles.templateButton,
                                        template === name && { backgroundColor: themeManager.GetColor('main1') }
                                    ]}
                                    onPress={() => this.setTemplate(name)}
                                >
                                    <Text
                                        style={styles.templateButtonText}
                                        color={template === name ? 'backgroundCard' : 'secondary'}
                                    >
                                        {index + 1}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
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
                                    date={this.props.date}
                                    template={template}
                                    formatDuration={this.formatDuration}
                                    computeRadarData={this.computeRadarData}
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
                            style={[styles.actionButton, { backgroundColor: themeManager.GetColor('main2') }]}
                            onPress={this.saveToGallery}
                            disabled={saveStatus === 'saving'}
                        >
                            <Icon icon='save' color='primary' size={18} />
                            <Text style={styles.buttonText} color='primary'>
                                {saveStatus === 'saving'
                                    ? langRecap['saving'] || 'Saving...'
                                    : saveStatus === 'success'
                                      ? langRecap['saved-success'] || '✓'
                                      : saveStatus === 'error'
                                        ? langRecap['saved-error'] || '✗'
                                        : langRecap['save'] || 'Save'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: themeManager.GetColor('main1') }]}
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

export { DayRecap };
