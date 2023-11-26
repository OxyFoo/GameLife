import * as React from 'react';
import { View, Animated, FlatList } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import EditorAvatarBack from './editorAvatarBack';
import ItemCard from './cards/ItemCard';
import ColorCard from './cards/ColorCard';
import CharacterCard from './cards/CharacterCard';
import styles from './editorAvatarStyle';
import { Text, Button, Separator, Icon, Frame, TextSwitch } from 'Interface/Components';
import { CHARACTERS, COLORS } from 'Ressources/items/humans/Characters';

/**
 * @typedef {import('Class/Inventory').Stuff} Stuff
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').Slot} Slot
 * @typedef {import('Data/Items').SkinSlot} SkinSlot
 * @typedef {Slot | SkinSlot} AvatarSlot
 */

class EditorAvatarRender extends EditorAvatarBack {
    /** @param {SkinSlot} slot */
    renderButtonSkin = (slot) => {
        const icon = {
            'skin': 'human',
            'skinColor': 'item'
        };
        return (
            <Button
                style={[styles.box, styles.smallBox]}
                onPress={() => this.selectSlot(slot)}
                color={this.getButtonBackground(slot)}
                iconSize={24}
                rippleColor='white'

                icon={icon[slot]}
                iconColor='main1'
            />
        );
    }

    /** @param {Slot} slot */
    renderButtonItem = (slot) => {
        const character = this.slotCharacters[slot];
        const containerSize = dataManager.items.GetContainerSize(slot);

        let onlyItems = true;
        let bodyView = 'full';
        if (character.items.includes('hair_01')) {
            onlyItems = false;
            bodyView = 'head';
        }

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
                    onlyItems={onlyItems}
                    bodyView={bodyView}
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

    renderCharacter = ({ item: characterName }) => {
        const { sexeSelected } = this.state;
        const sexe = [ 'MALE', 'FEMALE' ];

        const sameSexe = sexe[sexeSelected] === user.character.sexe;
        const sameSkin = characterName === user.character.skin;
        const isSelected = sameSexe && sameSkin;
        const selectCharacter = (sexe, skin) => {
            // Update character
            user.character.sexe = sexe;
            user.character.skin = skin;
            user.character.SetPose(sexe === 'MALE' ? 'defaultMale' : 'defaultFemale');

            // Update inventory
            user.inventory.Equip('sexe', sexe);
            user.inventory.Equip('skin', skin);

            // Update characters
            for (const slot in this.slotCharacters) {
                this.slotCharacters[slot].sexe = sexe;
                this.slotCharacters[slot].skin = skin;
                this.slotCharacters[slot].Refresh();
            }
            user.character.Refresh();

            // Update interface
            this.forceUpdate();
            this.refFrame?.forceUpdate();
            user.interface.header.refFrame?.forceUpdate();

            // Update database
            user.GlobalSave();
        }
        const onPress = isSelected ? () => {} : selectCharacter;

        return (
            <CharacterCard
                characterSexe={sexe[sexeSelected]}
                characterName={characterName}
                characterSkinColor={user.character.skinColor}
                isSelected={isSelected}
                onPress={onPress}
            />
        );
    }

    renderColor = ({ index, item: skinColor }) => {
        const selectColor = (color) => {
            if (user.character.skinColor !== index) {
                user.character.skinColor = index;
                user.inventory.Equip('skinColor', index);
                this.refFrame?.forceUpdate();
                user.interface.header.refFrame?.forceUpdate();
                for (const slot in this.slotCharacters) {
                    this.slotCharacters[slot].skinColor = index;
                    this.slotCharacters[slot].Refresh();
                }
            }
        }

        return (
            <ColorCard
                characterSkinColor={skinColor}
                onPress={selectColor}
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
            ox = Math.ceil(item.Value * .75);
            isEquipped = equippedStuffsID.includes(stuffSelected.ID);
        }

        const lang = langManager.curr['profile-avatar'];
        const btnSell = lang['button-sell'].replace('{}', ox.toString());
        const btnEquip = lang['button-equip'];

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
                        {btnSell}
                    </Button>
                    <Button
                        style={styles.editorStuffEquipBtn}
                        onPress={this.buttonEquipPress}
                        color='main2'
                        enabled={!isEquipped}
                    >
                        {btnEquip}
                    </Button>
                </View>

                <Separator.Horizontal color='border' style={{ width: '96%', marginHorizontal: '2%' }} />
            </Animated.View>
        );
    }

    renderItemsList() {
        const { slotSelected, stuffsSelected, sexeSelected } = this.state;
        const lang = langManager.curr['other'];

        if (slotSelected === 'skin') {
            const males = Object.keys(CHARACTERS.MALE);
            const females = Object.keys(CHARACTERS.FEMALE);
            const characters = [ males, females ];
            const selectSexe = (state) => this.setState({ sexeSelected: state });
            return (
                <>
                    <TextSwitch
                        texts={[lang['sexe-male'], lang['sexe-female']]}
                        fontSize={28}
                        onChange={selectSexe}
                    />
                    <FlatList
                        data={characters[sexeSelected]}
                        numColumns={3}
                        renderItem={this.renderCharacter}
                        keyExtractor={(item) => item.toString() + sexeSelected.toString()}
                    />
                </>
            );
        } else if (slotSelected === 'skinColor') {
            return (
                <FlatList
                    data={COLORS}
                    numColumns={3}
                    renderItem={this.renderColor}
                    keyExtractor={(item) => item.toString()}
                />
            );
        }

        return (
            <FlatList
                contentContainerStyle={styles.editorStuffContainer}
                data={stuffsSelected}
                numColumns={3}
                renderItem={this.renderCardItem}
                keyExtractor={(item, index) => 'item-card-' + item.ID + '-' + index.toString()}
            />
        );
    }

    render() {
        const {
            characterPosY,
            editorOpened,
            editorAnim,
            characterBottomPosY,
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
                height: user.interface.screenHeight - characterBottomPosY + 148,
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
                <Animated.View ref={ref => this.refButton = ref} style={characterStyle} onLayout={this.onCharacterLayout}>
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
                            <Frame ref={ref => this.refFrame = ref} characters={[ user.character ]} />
                            {!editorOpened && (
                                <Button
                                    style={styles.avatarOverlay}
                                    onPress={this.OpenEditor}
                                />
                            )}
                        </Animated.View>
                    </View>
                    <Animated.View style={[styles.columnSide, columnOpacity]}>
                        {this.renderButtonItem('bottom')}
                        {this.renderButtonItem('shoes')}
                    </Animated.View>
                </Animated.View>

                {/* Editor panel */}
                <Animated.View style={editorStyle} onLayout={this.onEditorLayout} pointerEvents={editorOpened ? 'auto' : 'none'}>
                    <Separator.Horizontal color='border' style={{ width: '96%', marginHorizontal: '2%', marginBottom: 12 }} />
                    {this.renderSelectedStuff()}

                    {/* Other stuffs */}
                    <Animated.View style={[selectionStyle]}>
                        {this.renderItemsList()}
                    </Animated.View>
                </Animated.View>
            </>
        );
    }
}

export default EditorAvatarRender;