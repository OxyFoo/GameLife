import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Animated, Dimensions, View } from 'react-native';
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
import SlotButton from './SlotButton';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageHeader } from 'Interface/Widgets';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {import('./back').AvatarPosition} AvatarPosition
 * @typedef {import('./back').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemName} ItemName
 * @typedef {import('./InventoryPanel').InventoryPanelRef} InventoryPanelRef
 * @typedef {'avatar' | 'bodyColor' | 'hair' | 'top' | 'bottom' | 'shoes'} SlotType
 */

/**
 * @typedef {object} AvatarEditorProps
 * @property {boolean} editMode - Whether the avatar editor is in edit mode
 * @property {Animated.Value} animEditMode - Animation value for edit mode (0 = normal, 1 = edit mode)
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
const AvatarEditorComponent = ({ editMode, animEditMode, scrollY, onExitEditMode }, ref) => {
    const screenDim = Dimensions.get('window');

    const [avatarItems, setAvatarItems] = useState(getInitialAvatarItems());
    const [bodyColor, setBodyColor] = useState('#f3e4d1'); // TODO: default body color from user profile
    const [selectedSlot, setSelectedSlot] = useState(/** @type {InventorySlotType} */ ('hair'));
    const inventoryPanelRef = useRef(/** @type {InventoryPanelRef | null} */ (null));

    const avatarScale = useRef(new Animated.Value(1)).current;
    const avatarTranslateX = useRef(new Animated.Value(-1 / 4)).current;
    const avatarTranslateY = useRef(new Animated.Value(0)).current;

    /** Mapping slots => categories */
    /** @type {Record<SlotType, InventorySlotType>} */
    const SLOT_CATEGORY_MAP = {
        avatar: 'all',
        bodyColor: 'bodyColor',
        hair: 'hair',
        top: 'top',
        bottom: 'bottom',
        shoes: 'shoes'
    };

    // Expose enterEditMode function to parent component via ref
    useImperativeHandle(ref, () => ({
        enterEditMode,
        exitEditMode
    }));

    /**
     * @param {AvatarPosition} newPos - Avatar position (x: ratio of screen width, y: vertical offset, scale: zoom level)
     */
    const adjustAvatarPosition = useCallback(
        /** @param {AvatarPosition} newPos */
        (newPos) => {
            const animations = [];
            if (newPos.x !== undefined) {
                animations.push(SpringAnimation(avatarTranslateX, newPos.x));
            }
            if (newPos.y !== undefined) {
                animations.push(SpringAnimation(avatarTranslateY, newPos.y));
            }
            if (newPos.scale !== undefined) {
                animations.push(SpringAnimation(avatarScale, newPos.scale));
            }

            Animated.parallel(animations).start();
        },
        [avatarTranslateX, avatarTranslateY, avatarScale]
    );

    /**
     * Adjust avatar vertical position based on selected category
     * @param {InventorySlotType | null} category
     */
    const adjustAvatarPositionForCategory = useCallback(
        /** @param {InventorySlotType | null} category */
        (category) => {
            const { y, scale } = getAvatarPositionForCategory(category);
            adjustAvatarPosition({ y, scale });
        },
        [adjustAvatarPosition]
    );

    /**
     * Update avatar items
     * @param {string} itemId - The new item id to equip
     */
    const handleItemUpdate = useCallback(
        /** @param {string} itemId */
        (itemId) => {
            setAvatarItems((currentItems) => updateAvatarItem(currentItems, itemId));
        },
        []
    );

    /**
     * Update body color
     * @param {string} color - The new body color
     */
    const handleBodyColorUpdate = useCallback(
        /** @param {string} color */
        (color) => {
            setBodyColor(color);
        },
        []
    );

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
                    bodyColor={bodyColor}
                    forwardedRef={inventoryPanelRef}
                    onSlotChange={adjustAvatarPositionForCategory}
                    onItemSelect={handleItemUpdate}
                    onBodyColorSelect={handleBodyColorUpdate}
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
     * Handle slot button press
     * @param {SlotType} slotType
     */
    const handleSlotPress = (slotType) => {
        const category = SLOT_CATEGORY_MAP[slotType];
        setSelectedSlot(category);
        inventoryPanelRef.current?.changeSlot(category);
    };

    const lang = langManager.curr['profile'];
    const uiEditorAvatarOpacity = { opacity: animEditMode };

    return (
        <>
            {/** PageHeader: Editor Avatar */}
            <Animated.View
                style={[styles.editorAvatarHeader, uiEditorAvatarOpacity]}
                pointerEvents={editMode ? 'auto' : 'none'}
            >
                <PageHeader
                    style={styles.pageHeader}
                    title={lang['title-edit-avatar']}
                    onBackPress={exitEditMode}
                    secondaryIcon='settings-outline'
                    secondaryIconColor='transparent'
                    onSecondaryIconPress={() => {}}
                />
            </Animated.View>

            {/** Avatar Character */}
            <Animated.View style={[styles.avatarContainer, styleAvatar]}>
                <AvatarFrame width={screenDim.width * 2} height={screenDim.width * 2} backgroundColor='#00000000'>
                    <AvatarCharacter
                        body={'human_00'}
                        bodyColor={bodyColor}
                        position={{ x: 0, y: 0, z: 0 }}
                        rotation={{ x: 0, y: 0, z: 0 }}
                        scale={1}
                        items={avatarItems}
                    />
                </AvatarFrame>
            </Animated.View>

            {/** Inventory slots */}
            <Animated.View
                style={[styles.slotsContainer, uiEditorAvatarOpacity]}
                pointerEvents={editMode ? 'auto' : 'none'}
            >
                {/** Left slots: Avatar, Body color */}
                <View>
                    <SlotButton
                        slotType='avatar'
                        category='all'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='bodyColor'
                        category='all'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                </View>

                {/** Right slots: Hair, Top, Bottom, Shoes */}
                <View>
                    <SlotButton
                        slotType='hair'
                        category='hair'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='top'
                        category='top'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='bottom'
                        category='bottom'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='shoes'
                        category='shoes'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        onPress={handleSlotPress}
                    />
                </View>
            </Animated.View>
        </>
    );
};

const AvatarEditor = forwardRef(AvatarEditorComponent);

export default AvatarEditor;
