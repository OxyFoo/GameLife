import * as React from 'react';
import { View, Animated, FlatList, Dimensions } from 'react-native';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import EditorAvatarBack from './editorAvatarBack';
import ItemCard from '../../Widgets/ItemCard';
import styles from './editorAvatarStyle';
import { Text, Button, Separator, Icon, Frame } from '../../Components';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * @typedef {import('../../../Class/Inventory').Stuff} Stuff
 * @typedef {import('../../../Data/Items').Item} Item
 * @typedef {import('../../../Data/Items').Slot} Slot
 * @typedef {'skin'|'skinColor'} SkinSlot
 * @typedef {Slot|SkinSlot} AvatarSlot
 */

class EditorAvatarRender extends EditorAvatarBack {
    /** @param {SkinSlot} slot */
    renderButtonSkin = (slot) => {
        return (
            <Button
                style={[styles.box, styles.smallBox]}
                onPress={() => this.selectSlot(slot)}
                color={this.getButtonBackground(slot)}
                iconSize={24}
                rippleColor='white'

                icon='item'
                iconColor='main1'
            />
        );
    }

    /** @param {Slot} slot */
    renderButtonItem = (slot) => {
        const character = this.slotCharacters[slot];
        const containerSize = dataManager.items.GetContainerSize(slot);

        return (
            <Button
                style={styles.box}
                onPress={() => this.selectSlot(slot)}
                color={this.getButtonBackground(slot)}
                iconSize={30}
                rippleColor='white'

                //icon='item'
                //iconColor='main1'
            >
                <Frame
                    characters={[ character ]}
                    onlyItems={true}
                    delayTime={2000}
                    size={containerSize}
                />
            </Button>
        );
    }

    /** @param {{item: Stuff}} element */
    renderCardItem = ({ item: stuff }) => {
        const { stuffSelected } = this.state;
        const equippedStuff = user.inventory.GetEquipments();

        const isSelected = stuffSelected?.ID === stuff.ID;
        const isEquipped = equippedStuff.includes(stuff.ID);

        return (
            <ItemCard
                stuff={stuff}
                isSelected={isSelected}
                isEquipped={isEquipped}
                onPress={this.selectItem}
            />
        );
    }

    renderSelectedStuff = () => {
        const { itemSelectionHeight } = this.state;
        const interY = { inputRange: [0, 1], outputRange: [-itemSelectionHeight-12, 0] };
        const translationY = { transform: [{ translateY: this.state.itemAnim.interpolate(interY) }] };

        let name = '',
            description = '',
            ox = 0,
            isEquipped = true; // True to disable the "Equip" button by default (and during the animation)

        const { stuffSelected } = this.state;
        if (stuffSelected !== null) {
            const item = dataManager.items.GetByID(stuffSelected.ItemID);
            const equippedStuffsID = user.inventory.GetEquipments();

            name = dataManager.GetText(item.Name);
            description = dataManager.GetText(item.Description);
            ox = item.Value;
            isEquipped = equippedStuffsID.includes(stuffSelected.ID);
        }

        const lang = langManager.curr['profile-avatar'];

        return (
            <Animated.View style={[styles.editorCurrent, translationY]} onLayout={this.onItemSelectionLayout}>
                <Icon containerStyle={styles.editorClose} onPress={() => this.selectItem()} icon='cross' color='main1' />

                <Text style={styles.editorTitle} fontSize={24} bold>{name}</Text>
                <Text style={styles.editorText} fontSize={16} color='secondary'>{description}</Text>

                {/* Current stuff actions */}
                <View style={styles.editorStuffParent}>
                    <Button
                        style={styles.editorStuffSellBtn}
                        onPress={this.buttonSellPress}
                        color='main1'
                        loading={this.state.selling}
                    >
                        {lang['button-sell'].replace('{}', ox)}
                    </Button>
                    <Button
                        style={styles.editorStuffEquipBtn}
                        onPress={this.buttonEquipPress}
                        color='main2'
                        enabled={!isEquipped}
                    >
                        {lang['button-equip']}
                    </Button>
                </View>

                <Separator.Horizontal color='border' style={{ width: '96%', marginHorizontal: '2%' }} />
            </Animated.View>
        );
    }

    render() {
        const {
            characterPosY,
            editorOpened,
            editorAnim,
            characterBottomPosY,
            stuffsSelected
        } = this.state;

        const maxPosY = - characterPosY + 96;
        const interCharacPosY = { inputRange: [0, 1], outputRange: [0, maxPosY] };
        const characTranslateY = editorAnim.interpolate(interCharacPosY);

        const columnOpacity = { opacity: editorAnim };
        const characterStyle = [
            styles.parent,
            { transform: [{ translateY: characTranslateY }] }
        ];

        const interEditorPosY = { inputRange: [0, .5, 1], outputRange: [0, 0, maxPosY] };
        const editorTranslateY = editorAnim.interpolate(interEditorPosY);
        const editorStyle = [
            styles.editor,
            {
                top: characterBottomPosY + 12,
                height: SCREEN_HEIGHT - characterBottomPosY + 148,
                opacity: editorAnim,
                backgroundColor: themeManager.GetColor('background'),
                transform: [{ translateY: editorTranslateY }]
            }
        ];

        const interAvatarScale = { inputRange: [0, 1], outputRange: [1.4, 1] };
        const interAvatarTranslateY = { inputRange: [0, 1], outputRange: [-12, 0] };
        const avatarStyle = [
            styles.avatar,
            {
                transform: [
                    { scale: editorAnim.interpolate(interAvatarScale) },
                    { translateY: editorAnim.interpolate(interAvatarTranslateY) }
                ]
            }
        ];

        const { itemSelectionHeight, itemSelected, editorHeight, itemAnim } = this.state;
        const interSelectionY = { inputRange: [0, 1], outputRange: [-itemSelectionHeight-12, 0] };
        const selectionStyle = {
            height: !itemSelected ? editorHeight : editorHeight - itemSelectionHeight - 24,
            transform: [{ translateY: itemAnim.interpolate(interSelectionY) }]
        };

        return (
            <>
                {/* Character */}
                <Animated.View style={characterStyle} onLayout={this.onCharacterLayout}>
                    <Animated.View style={[styles.columnSide, columnOpacity]}>
                        {this.renderButtonItem('hair')}
                        {this.renderButtonItem('top')}
                    </Animated.View>
                    <View style={styles.columnMiddle}>
                        <View style={styles.row}>
                            {this.renderButtonSkin('skin')}
                            {this.renderButtonSkin('skinColor')}
                        </View>
                        <Animated.View style={avatarStyle}>
                            <Frame characters={[ user.character ]} />
                            {!editorOpened && <Button style={styles.avatarOverlay} onPress={this.OpenEditor} />}
                        </Animated.View>
                    </View>
                    <Animated.View style={[styles.columnSide, columnOpacity]}>
                        {this.renderButtonItem('bottom')}
                        {this.renderButtonItem('shoes')}
                    </Animated.View>
                </Animated.View>

                {/* Editor panel */}
                {<Animated.View style={editorStyle} onLayout={this.onEditorLayout} pointerEvents={editorOpened ? 'auto' : 'none'}>
                    <Separator.Horizontal color='border' style={{ width: '96%', marginHorizontal: '2%', marginBottom: 12 }} />
                    {this.renderSelectedStuff()}

                    {/* Other stuffs */}
                    <Animated.View style={[selectionStyle]}>
                        <FlatList
                            data={stuffsSelected}
                            numColumns={3}
                            renderItem={this.renderCardItem}
                            keyExtractor={(item, index) => 'item-card-' + item.ID + '-' + index.toString()}
                        />
                    </Animated.View>
                </Animated.View>}
            </>
        );
    }
}

export default EditorAvatarRender;