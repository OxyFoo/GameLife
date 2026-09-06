import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import HistogramBar from './bar';
import BackSkillHistogram from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').HistogramDay} HistogramDay
 */

/** @param {HistogramDay} item */
const KeyExtractor = (item) => `day-${item.dayIndex}`;

class SkillHistogram extends BackSkillHistogram {
    render() {
        const lang = langManager.curr['skill'];
        const { style, firstDayIndex, windowDays, windowLabel, onWindowPress } = this.props;
        const { listWidth, selectedDayIndex } = this.state;
        const { days, niceMax } = this.getData();
        const visibleBars = this.getVisibleBars();

        const gridColor = themeManager.GetColor('border', { opacity: 0.15 });
        const baseColor = themeManager.GetColor('border', { opacity: 0.35 });

        return (
            <LinearGradient
                style={[styles.card, style]}
                colors={[
                    themeManager.GetColor('border', { opacity: 0.2 }),
                    themeManager.GetColor('border', { opacity: 0.06 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.header}>
                    <View style={styles.headerTexts}>
                        <Text style={styles.headerTitle} fontSize={16} color='primary' bold>
                            {lang['history-activity']}
                        </Text>
                        {selectedDayIndex !== null && (
                            <Text style={styles.headerSelected} fontSize={11} color='main3'>
                                {this.getSelectedText(selectedDayIndex)}
                            </Text>
                        )}
                    </View>
                    <Button
                        style={styles.windowButton}
                        styleBackground={styles.windowButtonBackground}
                        appearance='outline'
                        borderColor='main1'
                        fontColor='main1'
                        fontSize={12}
                        onPress={onWindowPress}
                    >
                        {windowLabel}
                    </Button>
                </View>

                {firstDayIndex === null ? (
                    <View style={styles.empty}>
                        <Text fontSize={14} color='secondary'>
                            {lang['histogram-empty']}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.plot}>
                        {/* Grid lines, behind the bars */}
                        <View style={styles.gridLines} pointerEvents='none'>
                            <View style={[styles.gridLine, styles.gridLineTop, { backgroundColor: gridColor }]} />
                            <View style={[styles.gridLine, styles.gridLineMiddle, { backgroundColor: gridColor }]} />
                            <View style={[styles.gridLine, styles.gridLineBottom, { backgroundColor: baseColor }]} />
                        </View>

                        {/* Y axis */}
                        <View style={styles.axis} pointerEvents='none'>
                            <Text style={[styles.axisLabel, styles.axisLabelTop]} fontSize={9} color='light'>
                                {this.formatMinutes(niceMax)}
                            </Text>
                            <Text style={[styles.axisLabel, styles.axisLabelMiddle]} fontSize={9} color='light'>
                                {this.formatMinutes(niceMax / 2)}
                            </Text>
                        </View>

                        {/* Bars, anchored to the right (today), older days loaded when scrolling to the left */}
                        <View style={styles.list} onLayout={this.onLayoutList}>
                            {listWidth > 0 && (
                                <FlatList
                                    key={`histogram-${listWidth}-${windowDays}`}
                                    ref={this.refList}
                                    contentContainerStyle={styles.listContent}
                                    data={days}
                                    extraData={`${selectedDayIndex}-${niceMax}`}
                                    keyExtractor={KeyExtractor}
                                    renderItem={this.renderItem}
                                    getItemLayout={this.getItemLayout}
                                    initialScrollIndex={Math.max(0, days.length - visibleBars)}
                                    initialNumToRender={visibleBars + 6}
                                    maxToRenderPerBatch={visibleBars}
                                    windowSize={3}
                                    removeClippedSubviews={true}
                                    maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                                    onStartReached={this.onStartReached}
                                    onStartReachedThreshold={0.5}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </View>
                )}
            </LinearGradient>
        );
    }

    /** @type {import('react-native').ListRenderItem<HistogramDay>} */
    renderItem = ({ item }) => (
        <HistogramBar
            day={item}
            slotWidth={this.getSlotWidth()}
            niceMax={this.getData().niceMax}
            labelStep={this.getDayLabelStep()}
            selected={item.dayIndex === this.state.selectedDayIndex}
            onPress={this.onBarPress}
        />
    );
}

export { SkillHistogram };
