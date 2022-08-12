import * as React from 'react';
import { View, Animated, FlatList, Dimensions } from 'react-native';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';
import themeManager from '../../../Managers/ThemeManager';

import ItemCard from '../../Widgets/ItemCard';
import styles from './editorAvatarStyle';
import { Sleep } from '../../../Utils/Functions';
import { SpringAnimation } from '../../../Utils/Animations';
import { Text, Button, Separator, Icon, Frame, Character } from '../../Components';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AvatarProps = {
    refParent: null,
    onChangeState: (opened) => {}
}

/**
 * @typedef {import('../../../Data/Items').Slot} Slot
 * @typedef {'skin'|'skinColor'} SkinSlot
 * @typedef {Slot|SkinSlot} AvatarSlot
 */

/**
 * @type {Array<string>} Used to store the list of available slots for the avatar.
 */
const Slots = [ 'hair', 'top', 'bottom', 'shoes' ];

class EditorAvatar extends React.Component {
    state = {
        characterPosY: 0,
        characterHeight: 0,
        characterBottomPosY: 0,

        editorOpened: false,
        editorAnim: new Animated.Value(0),
        editorHeight: 0,

        /** @type {AvatarSlot} */
        slotSelected: 'hair',
        itemSelected: false,
        itemSelectedID: null,
        itemAnim: new Animated.Value(0),
        itemSelectionHeight: 0
    }

    constructor(props) {
        super(props);
        this.character = new Character('user', 'MALE', 'skin_01');
        this.character.SetEquipment(user.inventory.GetEquipments());
        //this.character.SetAnimation('idle');

        this.slotCharacters = {};
        Slots.forEach(slot => {
            this.slotCharacters[slot] = new Character('itemslot-' + slot, 'MALE', 'skin_01', 0)
        });
        this.updateEquippedItems();
    }

    onCharacterLayout = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ characterBottomPosY: y + height, characterHeight: height });

        if (this.state.characterPosY === 0) {
            this.setState({ characterPosY: y });
        }
    }
    onEditorLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ editorHeight: height });
    }
    onItemSelectionLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ itemSelectionHeight: height });
    }

    OpenEditor = () => {
        this.setState({ editorOpened: true });
        this.props.onChangeState(true);

        SpringAnimation(this.state.editorAnim, 1).start();
        if (this.props.refParent.refPage !== null) {
            this.props.refParent.refPage.GotoY(0);
        }
    }
    CloseEditor = () => {
        this.setState({ editorOpened: false });
        this.props.onChangeState(false);

        SpringAnimation(this.state.editorAnim, 0).start();
    }

    updateEquippedItems = () => {
        Slots.forEach(slot => {
            const character = this.slotCharacters[slot];
            switch (slot) {
                case 'hair': character.SetEquipment([ user.inventory.avatar.Hair ]); break;
                case 'top': character.SetEquipment([ user.inventory.avatar.Top ]); break;
                case 'bottom': character.SetEquipment([ user.inventory.avatar.Bottom ]); break;
                case 'shoes': character.SetEquipment([ user.inventory.avatar.Shoes ]); break;
            }
        });
    }

    /** @param {AvatarSlot} slot */
    selectSlot = (slot) => {
        this.setState({ slotSelected: slot });
        this.selectItem(); // Reset selection
    };

    /** @param {string} itemID */
    selectItem = async (itemID = null) => {
        this.setState({ itemSelectedID: itemID });

        if (itemID === null) {
            this.setState({ itemSelected: false });
            SpringAnimation(this.state.itemAnim, 0).start();
        } else {
            SpringAnimation(this.state.itemAnim, 1).start();
            await Sleep(200); this.setState({ itemSelected: true });
        }
    }

    /** @param {AvatarSlot} slot */
    getButtonBackground = (slot) => {
        return this.state.slotSelected === slot ? 'main2' : 'backgroundCard';
    }

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

    renderCardItem = ({ item }) => {
        const equippedItems = user.inventory.GetEquipments();
        const isEquipped = equippedItems.includes(item.ID);

        return (
            <ItemCard
                item={item}
                selectedId={this.state.itemSelectedID}
                isEquipped={isEquipped}
                onPress={this.selectItem}
            />
        );
    }

    renderSelectedStuff = () => {
        const { itemSelectionHeight } = this.state;
        const interY = { inputRange: [0, 1], outputRange: [-itemSelectionHeight-12, 0] };
        const translationY = { transform: [{ translateY: this.state.itemAnim.interpolate(interY) }] };

        const { itemSelectedID } = this.state;
        let isEquipped = true; // True to disable the "Equip" button by default (and during the animation)
        let name = '', description = '';
        let onSellPress = () => {}, onEquipPress = () => {};

        if (itemSelectedID !== null) {
            const item = dataManager.items.GetByID(itemSelectedID);

            const equippedItems = user.inventory.GetEquipments();
            isEquipped = equippedItems.includes(item.ID);

            name = dataManager.GetText(item.Name);
            description = dataManager.GetText(item.Description);

            onSellPress = () => {};
            onEquipPress = () => {
                user.inventory.Equip(item.Slot, item.ID);
            };
        }

        return (
            <Animated.View style={[styles.editorCurrent, translationY]} onLayout={this.onItemSelectionLayout}>
                <Icon containerStyle={styles.editorClose} onPress={() => this.selectItem()} icon='cross' color='main1' />

                <Text style={styles.editorText} fontSize={24} bold>{name}</Text>
                <Text style={styles.editorText} fontSize={16} color='secondary'>{description}</Text>

                {/* Current stuff actions */}
                <View style={styles.editorStuffParent}>
                    <Button style={styles.editorStuffSellBtn} onPress={() => {}} color='main1'>{"[Vendre +XX Ox]"}</Button>
                    <Button
                        style={styles.editorStuffEquipBtn}
                        onPress={onEquipPress}
                        color='main2'
                        enabled={!isEquipped}
                    >
                        {"[EQUIPER]"}
                    </Button>
                </View>

                <Separator.Horizontal color='border' style={{ width: '96%', marginHorizontal: '2%' }} />
            </Animated.View>
        );
    }

    render() {
        const { characterPosY, editorOpened, editorAnim, characterBottomPosY } = this.state;

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

        const { itemSelectionHeight, itemSelectedID, itemSelected, editorHeight, itemAnim } = this.state;
        const interSelectionY = { inputRange: [0, 1], outputRange: [-itemSelectionHeight-12, 0] };
        const selectionStyle = {
            height: !itemSelected ? editorHeight : editorHeight - itemSelectionHeight - 24,
            transform: [{ translateY: itemAnim.interpolate(interSelectionY) }]
        };

        const allItems = user.inventory.GetStuffs();
        const items = allItems.filter(item => item.Slot === this.state.slotSelected);

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
                            data={items}
                            numColumns={3}
                            renderItem={this.renderCardItem}
                            keyExtractor={(item, index) => 'item-card-' + item.ID}
                        />
                    </Animated.View>
                </Animated.View>}
            </>
        );
    }
}

EditorAvatar.prototype.props = AvatarProps;
EditorAvatar.defaultProps = AvatarProps;

export default EditorAvatar;