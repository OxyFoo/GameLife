import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback, useEffect, useMemo } from 'react';
import { Animated, Dimensions, View, TouchableOpacity } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import {
    getInitialAvatarItems,
    getBodyColorHexFromUser,
    setBodyColorHexOnUser,
    getBodyTypeFromUser,
    setBodyTypeOnUser
} from './back';
import { getAvatarPositionForCategory, getDefaultAvatarPosition } from './avatarConstants';
import InventoryPanel from './InventoryPanel';
import SlotButton from './SlotButton';
import SellPopup from './SellPopup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { PageHeader } from 'Interface/Widgets';
import { SpringAnimation } from 'Utils/Animations';
import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').InventorySlotType} InventorySlotType
 * @typedef {import('./back').SlotType} SlotType
 * @typedef {import('./back').AvatarPosition} AvatarPosition
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('./InventoryPanel').InventoryPanelRef} InventoryPanelRef
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

    const [avatarItems, setAvatarItems] = useState(() => getInitialAvatarItems());
    const [bodyColor, setBodyColor] = useState(() => getBodyColorHexFromUser());
    const [bodyType, setBodyType] = useState(() => /** @type {AvatarName} */ (getBodyTypeFromUser()));
    const [selectedSlot, setSelectedSlot] = useState(/** @type {InventorySlotType} */ ('hair'));
    const [oxAmount, setOxAmount] = useState(() => user.informations.ox.Get());
    const inventoryPanelRef = useRef(/** @type {InventoryPanelRef | null} */ (null));

    // Listen to Ox changes
    useEffect(() => {
        const listener = user.informations.ox.AddListener((newOx) => {
            setOxAmount(newOx);
        });
        return () => {
            user.informations.ox.RemoveListener(listener);
        };
    }, []);

    // Recalculate avatar items when bodyColor changes to update ears color
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const avatarItemsForRender = useMemo(() => user.avatar.GetAvatarItems(), [avatarItems, bodyColor]);

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
            const { x, y, scale } = getAvatarPositionForCategory(category);
            adjustAvatarPosition({ x, y, scale });
        },
        [adjustAvatarPosition]
    );

    /**
     * Refresh avatar items from inventory after an item is equipped
     */
    const refreshAvatarItems = useCallback(() => {
        setAvatarItems(getInitialAvatarItems());
    }, []);

    /**
     * Handle item sell
     * @param {number} stuffID - The stuff ID to sell
     */
    const handleItemSell = useCallback(
        /** @param {number} stuffID */
        async (stuffID) => {
            const lang = langManager.curr['profile-avatar'];

            // Check if connected to server
            if (!user.server2.IsAuthenticated()) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-notconnected-title'],
                        message: lang['alert-notconnected-text']
                    }
                });
                return;
            }

            // Check if item is equipped - cannot sell equipped items
            const equippedStuffs = user.avatar.GetEquipments();
            if (equippedStuffs.includes(stuffID)) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-isequipped-title'],
                        message: lang['alert-isequipped-text']
                    }
                });
                return;
            }

            // Get stuff info
            const stuff = user.inventory.GetStuffByID(stuffID);
            if (stuff === null) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-sellfailed-title'],
                        message: lang['alert-sellfailed-text']
                    }
                });
                return;
            }

            // Get item info for price calculation
            const item = dataManager.items.GetByID(stuff.ItemID);
            if (item === null) {
                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-sellfailed-title'],
                        message: lang['alert-sellfailed-text']
                    }
                });
                return;
            }

            // Open sell popup with loading support
            user.interface.popup?.Open({
                content: (
                    <SellPopup
                        stuffID={stuffID}
                        item={item}
                        onSold={() => {
                            // Refresh inventory panel to remove sold item
                            inventoryPanelRef.current?.refreshInventory();
                            // Close the priority panel (ItemDetailPanel) after successful sale
                            user.interface.bottomPanel?.Close();
                            // Refresh avatar items
                            setAvatarItems(getInitialAvatarItems());
                        }}
                    />
                ),
                cancelable: true
            });
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
            setBodyColorHexOnUser(color);
        },
        []
    );

    /**
     * Update body type
     */
    const handleBodyTypeUpdate = useCallback(
        /** @param {AvatarName} body */
        (body) => {
            setBodyType(body);
            setBodyTypeOnUser(body);
        },
        []
    );

    const refreshAvatarFromUser = useCallback(() => {
        setAvatarItems(getInitialAvatarItems());
        setBodyColor(getBodyColorHexFromUser());
        setBodyType(getBodyTypeFromUser());
    }, []);

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
        refreshAvatarFromUser();
        // Move avatar to center with appropriate zoom for selected slot
        const { x, y, scale } = getAvatarPositionForCategory(selectedSlot);
        adjustAvatarPosition({ x, y, scale });

        // Open bottom panel with category change callback
        user.interface.bottomPanel?.Open({
            content: (
                <InventoryPanel
                    forwardedRef={inventoryPanelRef}
                    bodyType={bodyType}
                    bodyColor={bodyColor}
                    avatarItems={avatarItems}
                    selectedSlot={selectedSlot}
                    onBodyTypeSelect={handleBodyTypeUpdate}
                    onBodyColorSelect={handleBodyColorUpdate}
                    onSlotChange={adjustAvatarPositionForCategory}
                    onItemSelect={refreshAvatarItems}
                    onItemSell={handleItemSell}
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
                        body={bodyType}
                        bodyColor={bodyColor}
                        position={{ x: 0, y: 0, z: 0 }}
                        rotation={{ x: 0, y: 0, z: 0 }}
                        scale={1}
                        items={avatarItemsForRender}
                    />
                </AvatarFrame>
            </Animated.View>

            {/** Inventory slots */}
            <Animated.View
                style={[styles.slotsContainer, uiEditorAvatarOpacity]}
                pointerEvents={editMode ? 'auto' : 'none'}
            >
                {/** Ox display - top left corner */}
                <TouchableOpacity
                    style={styles.oxContainer}
                    onPress={() => user.interface.ChangePage('shop')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.oxText}>{oxAmount.toString()}</Text>
                    <Icon icon='ox' size={24} />
                </TouchableOpacity>

                {/** Left slots: Avatar, Body color */}
                <View>
                    <SlotButton
                        slotType='avatar'
                        category='all'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        bodyType={bodyType}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='bodyColor'
                        category='all'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        bodyType={bodyType}
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
                        bodyType={bodyType}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='top'
                        category='top'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        bodyType={bodyType}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='bottom'
                        category='bottom'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        bodyType={bodyType}
                        onPress={handleSlotPress}
                    />
                    <SlotButton
                        slotType='shoes'
                        category='shoes'
                        selectedSlot={selectedSlot}
                        avatarItems={avatarItems}
                        bodyColor={bodyColor}
                        bodyType={bodyType}
                        onPress={handleSlotPress}
                    />
                </View>
            </Animated.View>
        </>
    );
};

const AvatarEditor = forwardRef(AvatarEditorComponent);

export default AvatarEditor;
