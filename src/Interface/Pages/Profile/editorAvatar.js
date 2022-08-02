import * as React from 'react';
import { View, Animated, FlatList, Dimensions, StyleSheet } from 'react-native';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import ItemCard from '../../Widgets/ItemCard';
import { Sleep } from '../../../Utils/Functions';
import { SpringAnimation } from '../../../Utils/Animations';
import { Text, Button, Separator, Icon, Frame, Character } from '../../Components';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AvatarProps = {
    refParent: null,
    onChangeState: (opened) => {}
}

const TEST_STATS = {
    'int': 1,
    'soc': 2,
    'for': 0,
    'end': 4,
    'agi': 0,
    'dex': 5
};

/**
 * @typedef {import('../../../Data/Items').Slot} Slot
 */

class EditorAvatar extends React.Component {
    state = {
        characterPosY: 0,
        characterHeight: 0,
        characterBottomPosY: 0,

        editorOpened: false,
        editorAnim: new Animated.Value(0),
        editorHeight: 0,

        /** @type {Slot} */
        slotSelected: 'hair',
        itemSelected: false,
        itemSelectedID: null,
        itemAnim: new Animated.Value(0),
        itemSelectionHeight: 0
    }

    constructor(props) {
        super(props);
        this.character = new Character('user', 'MALE', 'skin_01', user.inventory.GetEquipments());
        //this.character.SetAnimation('idle');
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

    SetSelectItem = async (itemID = null) => {
        this.setState({ itemSelectedID: itemID });

        if (itemID === null) {
            this.setState({ itemSelected: false });
            SpringAnimation(this.state.itemAnim, 0).start();
        } else {
            SpringAnimation(this.state.itemAnim, 1).start();
            await Sleep(200); this.setState({ itemSelected: true });
        }
    }

    renderSelectedStuff = () => {
        const { itemSelectionHeight } = this.state;
        const interY = { inputRange: [0, 1], outputRange: [-itemSelectionHeight-12, 0] };
        const translationY = { transform: [{ translateY: this.state.itemAnim.interpolate(interY) }] };

        const { itemSelectedID } = this.state;
        let name = '', description = '';
        if (itemSelectedID !== null) {
            const item = dataManager.items.GetByID(itemSelectedID);
            name = dataManager.GetText(item.Name);
            description = dataManager.GetText(item.Description);
        }

        return (
            <Animated.View style={[styles.editorCurrent, translationY]} onLayout={this.onItemSelectionLayout}>
                <Icon containerStyle={styles.editorClose} onPress={() => this.SetSelectItem()} icon='cross' color='main1' />

                <Text style={{ marginBottom: 12 }} fontSize={24} bold>{name}</Text>
                <Text style={{ marginBottom: 12 }} fontSize={16} color='secondary'>{description}</Text>

                {/* Stats (buffs) - Unused */}
                {/*<View style={{ marginBottom: 24 }}>
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'center', marginLeft: '5%' }}
                        data={Object.keys(TEST_STATS)}
                        numColumns={3}
                        renderItem={({item}) => {
                            const value = TEST_STATS[item];
                            return (
                                <View style={[styles.stuffStats, { opacity: value === 0 ? .5 : 1 }]}>
                                    <Text style={{ textAlign: 'left' }} fontSize={12} color='secondary'>{langManager.curr['statistics']['names'][item] + ':'}</Text>
                                    <Text style={{ textAlign: 'left' }} fontSize={12} color={value === 0 ? 'secondary' : 'primary'}>{'+' + value}</Text>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => 'stat' + index}
                    />
                </View>*/}

                {/* Current stuff actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                    <Button style={{ width: '40%', paddingHorizontal: 4 }} borderRadius={12} color='main1'>Vendre +XX Ox</Button>
                    <Button style={{ width: '56%' }} borderRadius={12} color='main2'>EQUIPER</Button>
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

        /** @param {Slot} slot */
        const selectSlot = (slot) => this.setState({ slotSelected: slot });
    
        /** @param {Slot} slot */
        const background = (slot) => this.state.slotSelected === slot ? 'main2' : 'backgroundCard';

        const allItems = user.inventory.GetStuffs();
        const items = allItems.filter(item => item.Slot === this.state.slotSelected);

        return (
            <>
                {/* Character */}
                <Animated.View style={characterStyle} onLayout={this.onCharacterLayout}>
                    <Animated.View style={[styles.columnSide, columnOpacity]}>
                        <Button style={styles.box} onPress={() => selectSlot('hair')} color={background('hair')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => selectSlot('top')} color={background('top')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        {/*<Button style={styles.box} onPress={() => selectSlot('face')} color={background('face')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />*/}
                        {/*<Button style={styles.box} onPress={() => selectSlot('accessory')} color={background('accessory')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />*/}
                    </Animated.View>
                    <View style={styles.columnMiddle}>
                        <View style={styles.row}>
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                            {/*<Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />*/}
                            {/*<Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />*/}
                        </View>
                        <Animated.View style={avatarStyle}>
                            <Frame characters={[ user.character ]} />
                            {!editorOpened && <Button style={styles.avatarOverlay} onPress={this.OpenEditor} />}
                        </Animated.View>
                    </View>
                    <Animated.View style={[styles.columnSide, columnOpacity]}>
                        <Button style={styles.box} onPress={() => selectSlot('bottom')} color={background('bottom')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => selectSlot('shoes')} color={background('shoes')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        {/*<Button style={styles.box} onPress={() => selectSlot('gloves')} color={background('gloves')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />*/}
                        {/*<Button style={styles.box} onPress={() => selectSlot('weapon')} color={background('weapon')} icon='item' iconColor='main1' iconSize={30} rippleColor='white' />*/}
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
                            renderItem={({item}) => (
                                <ItemCard
                                    item={item}
                                    onPress={this.SetSelectItem}
                                    selectedId={itemSelectedID}
                                />
                            )}
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

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    columnSide: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    columnMiddle: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    box: {
        width: '90%',
        aspectRatio: 1,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    row: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    smallBox: {
        width: '10%',
        paddingHorizontal: '8%'
    },
    avatar: {
        width: '80%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
    },
    avatarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 16
    },

    editor: {
        position: 'absolute',
        padding: '5%',
        paddingTop: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 100,
        overflow: 'hidden'
    },
    editorCurrent: {
        marginBottom: 12
    },
    editorClose: {
        position: 'absolute',
        top: 0,
        right: 12,
        zIndex: 100,
        elevation: 100
    },
    stuffStats: {
        width: '25%',
        marginRight: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default EditorAvatar;