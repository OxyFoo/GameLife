import React from 'react';

import styles from './style';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {Object} SkillButtonProps
 * @property {number} id
 * @property {number} [index]
 * @property {string} value
 * @property {() => void} onPress
 * @property {(event: LayoutChangeEvent) => void} onLayout
 * @property {(id: number) => void} openSkill
 * @property {ViewStyle} styleAnimation
 */

/** @type {React.FC<SkillButtonProps>} */
const SkillButton = React.memo(
    ({ id, value, onPress, onLayout, openSkill, styleAnimation: anim }) => (
        <Button
            style={styles.activityElement}
            styleAnimation={anim}
            appearance='outline'
            borderColor='secondary'
            fontColor='primary'
            onLayout={onLayout}
            onPress={onPress}
            onLongPress={() => openSkill(id)}
        >
            <Text fontSize={16}>{value}</Text>
        </Button>
    ),
    (prevProps, nextProps) =>
        prevProps.id === nextProps.id ||
        prevProps.index === nextProps.index ||
        prevProps.styleAnimation === nextProps.styleAnimation
);

export { SkillButton };
