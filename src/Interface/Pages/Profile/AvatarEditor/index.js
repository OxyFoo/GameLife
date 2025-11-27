import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import {
    getInitialAvatarItems,
    updateAvatarItem,
    getAvatarPositionForCategory,
    getEditModeAvatarPosition,
    getDefaultAvatarPosition
} from './back';
import InventoryPanel from './InventoryPanel';
import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 */

/**
 * @typedef {object} AvatarEditorProps
 * @property {Animated.Value} scrollY - Scroll position of the parent ScrollView (for parallax effect)
 * @property {() => void} [onExitEditMode] - Callback called when exiting edit mode
 */

/**
 * @typedef {object} AvatarEditorRef
 * @property {() => void} enterEditMode - Function to enter edit mode
 * @property {() => void} exitEditMode - Function to exit edit mode
 */

/**
 * Avatar editor component with ref support
 * @param {AvatarEditorProps} props
 * @param {React.Ref<AvatarEditorRef>} ref
 * @returns {React.ReactElement}
 */
const AvatarEditorComponent = ({ scrollY, onExitEditMode }, ref) => {
    const screenDim = Dimensions.get('window');

    const [avatarItems, setAvatarItems] = useState(getInitialAvatarItems());

    const avatarScale = useRef(new Animated.Value(1)).current;
    const avatarTranslateX = useRef(new Animated.Value(-1 / 4)).current;
    const avatarTranslateY = useRef(new Animated.Value(0)).current;

    // Expose enterEditMode function to parent component via ref
    useImperativeHandle(ref, () => ({
        enterEditMode,
        exitEditMode
    }));

    const styleAvatar = {
        transform: [
            { translateY: Animated.add(Animated.divide(scrollY, 2), avatarTranslateY) },
            { translateX: Animated.multiply(avatarTranslateX, screenDim.width) },
            { scale: avatarScale }
        ]
    };

    /**
     * Enter edit mode for avatar customization
     * Hides UI and centers avatar with smooth animations
     */
    const enterEditMode = () => {
        // Move avatar to center
        const { x, y } = getEditModeAvatarPosition();
        adjustAvatarPosition({ x, y });

        // Open bottom panel with category change callback
        user.interface.bottomPanel?.Open({
            content: (
                <InventoryPanel
                    avatarItems={avatarItems}
                    onSlotChange={adjustAvatarPositionForCategory}
                    onItemSelect={handleItemUpdate}
                />
            ),
            // overlayColor: '#00000001',
            overlay: true,
            onClose: () => {
                exitEditMode();
            }
        });
    };

    /**
     * Exit edit mode and restore normal view
     */
    const exitEditMode = () => {
        // Restore avatar to default position
        const { x, y, scale } = getDefaultAvatarPosition();
        adjustAvatarPosition({ x, y, scale });

        // Close bottom panel (useless if called from onClose of the panel itself)
        if (user.interface.bottomPanel?.IsOpened()) {
            user.interface.bottomPanel?.Close();
        }

        // Notify parent component
        onExitEditMode?.();
    };

    /**
     * Update avatar items
     * @param {string} itemId - The new item id to equip
     */
    const handleItemUpdate = (itemId) => {
        setAvatarItems((currentItems) => updateAvatarItem(currentItems, itemId));
    };

    /**
     * Adjust avatar vertical position based on selected category
     * @param {'all' | 'hair' | 'top' | 'bottom' | 'shoes' | null} category
     */
    const adjustAvatarPositionForCategory = (category) => {
        const { y, scale } = getAvatarPositionForCategory(category);
        adjustAvatarPosition({ y, scale });
    };

    /**
     * @param {object} newPos
     * @param {number} [newPos.x] Position in ratio of screen width (-0.25 = center)
     * @param {number} [newPos.y]
     * @param {number} [newPos.scale]
     */
    const adjustAvatarPosition = (newPos) => {
        const animations = [];
        if (newPos.x !== undefined) animations.push(SpringAnimation(avatarTranslateX, newPos.x));
        if (newPos.y !== undefined) animations.push(SpringAnimation(avatarTranslateY, newPos.y));
        if (newPos.scale !== undefined) animations.push(SpringAnimation(avatarScale, newPos.scale));

        Animated.parallel(animations).start();
    };

    return (
        <Animated.View style={[styles.avatarContainer, styleAvatar]}>
            <AvatarFrame width={screenDim.width * 2} height={screenDim.width * 2} backgroundColor='#00000000'>
                <AvatarCharacter
                    body={'human_00'}
                    // bodyColor={'#f3e4d1'}
                    position={{ x: 0, y: 0, z: 0 }}
                    rotation={{ x: 0, y: 0, z: 0 }}
                    scale={1}
                    items={avatarItems}
                />
            </AvatarFrame>
        </Animated.View>
    );
};

const AvatarEditor = forwardRef(AvatarEditorComponent);

export default AvatarEditor;
