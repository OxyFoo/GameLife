import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import HistogramBar from './bar';
import BackSkillHistogram, { VISIBLE_BARS } from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('./back').HistogramDay} HistogramDay
 */

/** @param {HistogramDay} item */
const KeyExtractor = (item) => `day-${item.dayIndex}`;

class SkillHistogram extends BackSkillHistogram {
    render() {
        const lang = langManager.curr['skill'];
        const { style, firstDayIndex } = this.props;
        const { listWidth, selectedDayIndex } = this.state;
        const { days, niceMax } = this.getData();

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
                    <Text style={styles.headerTitle} fontSize={16} color='primary' bold>
                        {lang['history-activity']}
                    </Text>
                    {selectedDayIndex !== null && (
                        <Text fontSize={12} color='main3'>
                            {this.getSelectedText(selectedDayIndex)}
                        </Text>
                    )}
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
                                    key={`histogram-${listWidth}`}
                                    ref={this.refList}
                                    contentContainerStyle={styles.listContent}
                                    data={days}
                                    extraData={`${selectedDayIndex}-${niceMax}`}
                                    keyExtractor={KeyExtractor}
                                    renderItem={this.renderItem}
                                    getItemLayout={this.getItemLayout}
                                    initialScrollIndex={Math.max(0, days.length - VISIBLE_BARS)}
                                    initialNumToRender={VISIBLE_BARS + 6}
                                    maxToRenderPerBatch={VISIBLE_BARS}
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
            selected={item.dayIndex === this.state.selectedDayIndex}
            onPress={this.onBarPress}
        />
    );
}

export { SkillHistogram };
