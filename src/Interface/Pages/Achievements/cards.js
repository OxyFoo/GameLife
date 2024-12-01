import * as React from 'react';
import { Animated, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, ProgressBar, Icon } from 'Interface/Components';
import { Round } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('./back').PanelAchievementType} PanelAchievementType
 * @typedef {import('react-native').ListRenderItem<PanelAchievementType>} AchievementListRenderItem
 */

/** @type {AchievementListRenderItem} */
function AchievementCard({ item: achievement }) {
    const { isSolved } = achievement;
    const [isOpened, setIsOpened] = React.useState(false);
    const [maxHeight, setMaxHeight] = React.useState(-1);
    const animation = React.useRef(new Animated.Value(0)).current;

    /** @type {(event: LayoutChangeEvent) => void} */
    const onContentLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > maxHeight) {
            setMaxHeight(height);
        }
    };

    const onPress = () => {
        const toValue = isOpened ? 0 : 1;
        SpringAnimation(animation, toValue, false).start();
        setIsOpened(!isOpened);
    };

    /** @type {ViewStyle} */
    const style = {
        borderColor: isSolved ? themeManager.GetColor('main1') : '#888888'
    };

    return (
        <Button style={[styles.achievementButton, style]} appearance='uniform' color='transparent' onPress={onPress}>
            {isSolved ? (
                <LinearGradient
                    style={styles.achievementGradient}
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.4 }),
                        themeManager.GetColor('main1', { opacity: 0.1 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    children={
                        <AchievementCardContent
                            achievement={achievement}
                            animation={animation}
                            maxHeight={maxHeight}
                            isSolved={isSolved}
                            isOpened={isOpened}
                            onContentLayout={onContentLayout}
                        />
                    }
                />
            ) : (
                <AchievementCardContent
                    achievement={achievement}
                    animation={animation}
                    maxHeight={maxHeight}
                    isSolved={isSolved}
                    isOpened={isOpened}
                    onContentLayout={onContentLayout}
                />
            )}
        </Button>
    );
}

/**
 * @param {object} props
 * @param {PanelAchievementType} props.achievement
 * @param {Animated.Value} props.animation
 * @param {number} props.maxHeight
 * @param {boolean} props.isSolved
 * @param {boolean} props.isOpened
 * @param {(event: LayoutChangeEvent) => void} props.onContentLayout
 */
function AchievementCardContent({ achievement, animation, maxHeight, isSolved, isOpened, onContentLayout }) {
    const lang = langManager.curr['achievements'];
    const { ID, Name, Progress, GlobalPercentage } = achievement;

    const [styleTitle, setStyleTitle] = React.useState({
        marginBottom: Animated.multiply(animation, 4)
    });

    const [styleDescription, setStyleDescription] = React.useState({
        opacity: animation,
        marginTop: isOpened ? 2 : 0,
        maxHeight: maxHeight === -1 ? undefined : Animated.multiply(animation, maxHeight)
    });

    React.useEffect(() => {
        setStyleTitle({
            marginBottom: Animated.multiply(animation, 4)
        });
        setStyleDescription({
            opacity: animation,
            marginTop: isOpened ? 2 : 0,
            maxHeight: maxHeight === -1 ? undefined : Animated.multiply(animation, maxHeight)
        });
    }, [animation, maxHeight, isOpened]);

    const achievementData = dataManager.achievements.GetByID(ID);
    if (achievementData === null) {
        return null;
    }

    const conditionText =
        achievementData.Type === 'SHOW'
            ? user.achievements.getConditionText(achievementData.Condition)
            : lang['condition-text-hide'];

    const rewardText =
        achievementData.Rewards.length > 0
            ? user.rewards.GetText('not-claim', achievementData.Rewards)
            : lang['reward-text-empty'];

    /** @type {ViewStyle} */
    const styleIcon = {
        opacity: Animated.subtract(1, animation)
    };

    return (
        <View style={styles.achievementContent}>
            {/* Title & info icon */}
            <Animated.View style={[styles.achievementContentTitle, styleTitle]}>
                <Text style={styles.achievementTitle}>{Name}</Text>
                <Animated.View style={[styles.achievementInfoIcon, styleIcon]}>
                    <Icon icon='info-circle-outline' color='gradient' size={22} />
                </Animated.View>
            </Animated.View>

            {/* Description, condition, reward */}
            <Animated.View style={[styles.achievementContentDescription, styleDescription]} onLayout={onContentLayout}>
                <Text style={styles.achievementDescription} color='main1'>
                    {lang['condition-text'] + conditionText}
                </Text>
                <Text style={styles.achievementCondition} color='main1'>
                    {lang['reward-text'] + rewardText}
                </Text>
                <Text style={styles.achievementGlobalProgression} color='secondary'>
                    {lang['global-progress-text'].replace('{}', GlobalPercentage)}
                </Text>
            </Animated.View>

            {/* Progress bar */}
            {!isSolved && Progress > 0 && (
                <View>
                    <Text style={styles.achievementProgressionValue} color='secondary'>
                        {`${Round(Progress * 100, 1)}%`}
                    </Text>
                    <ProgressBar height={6} value={Progress} maxValue={1} />
                </View>
            )}
        </View>
    );
}

export default AchievementCard;
