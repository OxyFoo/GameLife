import * as React from 'react';
import { View, Animated, FlatList, Dimensions, StyleSheet } from 'react-native';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { ItemCard } from '../Widgets';
import { Text, Button, Character, Separator, XPBar, Icon } from '../Components';
import { SpringAnimation } from '../../Functions/Animations';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AvatarProps = {
    refParent: null,
    onChangeState: (opened) => {}
}

const TEST = [
    { id: 0, name: 'Test1' },
    { id: 1, name: 'Test2' },
    { id: 2, name: 'Test3' },
    { id: 3, name: 'Test4' },
    { id: 4, name: 'Test5' },
    { id: 5, name: 'Test6' },
    { id: 6, name: 'Test7' },
    { id: 7, name: 'Test8' }
];

const TEST_STATS = {
    'int': 1,
    'soc': 2,
    'for': 0,
    'end': 4,
    'agi': 0,
    'dex': 5
};

class Avatar extends React.Component {
    state = {
        characterPosY: 0,
        characterHeight: 0,
        characterBottomPosY: 0,

        editorOpened: true,
        editorAnim: new Animated.Value(1)
    }

    onLayout = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ characterBottomPosY: y + height, characterHeight: height });

        if (this.state.characterPosY === 0) {
            this.setState({ characterPosY: y });
        }
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

    render() {
        const maxPosY = - this.state.characterPosY + 12;
        const interCharacPosY = { inputRange: [0, 1], outputRange: [0, maxPosY] };
        const characTranslateY = this.state.editorAnim.interpolate(interCharacPosY);
        const interEditorPosY = { inputRange: [0, .5, 1], outputRange: [0, 0, maxPosY] };
        const editorTranslateY = this.state.editorAnim.interpolate(interEditorPosY);

        const characterStyle = [
            styles.parent,
            { transform: [{ translateY: characTranslateY }] }
        ];

        const editorStyle = [
            styles.editor,
            {
                top: this.state.characterBottomPosY + 12,
                height: SCREEN_HEIGHT - this.state.characterHeight - 24,
                opacity: this.state.editorAnim,
                backgroundColor: themeManager.getColor('background'),
                transform: [{ translateY: editorTranslateY }]
            }
        ];

        return (
            <>
                {/* Character */}
                <Animated.View style={characterStyle} onLayout={this.onLayout}>
                    <View style={styles.column}>
                        <Button style={styles.box} onPress={() => { this.OpenEditor(); }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                    </View>
                    <View style={styles.column2}>
                        <View style={styles.row}>
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                            <Button style={[styles.box, styles.smallBox]} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={24} rippleColor='white' />
                        </View>
                        <View style={styles.avatar}>
                            <Character />
                        </View>
                    </View>
                    <View style={styles.column}>
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                        <Button style={styles.box} onPress={() => {  }} color='backgroundCard' icon='item' iconColor='main1' iconSize={30} rippleColor='white' />
                    </View>
                </Animated.View>

                {/* Editor panel */}
                <Animated.View style={editorStyle} pointerEvents={this.state.editorOpened ? 'auto' : 'none'}>
                    <Icon containerStyle={styles.editorClose} onPress={this.CloseEditor} icon='cross' color='main1' />

                    {/* Current stuff */}
                    <Text style={{ marginBottom: 12 }} fontSize={24}>Nom equipement</Text>
                    <Text style={{ marginBottom: 12 }} fontSize={16}>Balblabla balblabla balblabla balblabla balblabla balblabla balblabla balblabla</Text>
                    <View style={{ marginBottom: 12 }}>
                        <FlatList
                            columnWrapperStyle={{ justifyContent: 'center', marginLeft: '5%' }}
                            data={Object.keys(TEST_STATS)}
                            numColumns={3}
                            renderItem={({item}) =>
                                <View style={{ width: '30%' }}>
                                    <Text style={{ textAlign: 'left' }} fontSize={12}>{langManager.curr['statistics']['names'][item] + ': +0'}</Text>
                                </View>}
                            keyExtractor={(item, index) => 'stat' + index}
                            />
                    </View>

                    {/* Current stuff actions */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Button style={{ width: '40%', paddingHorizontal: 4 }} borderRadius={12} color='main1'>Vendre +XX Ox</Button>
                        <Button style={{ width: '56%' }} borderRadius={12} color='main2'>EQUIPER</Button>
                    </View>

                    <Separator.Horizontal style={{ width: '96%', marginHorizontal: '2%', marginBottom: 12 }} />

                    {/* Other stuffs */}
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        data={[1, 2, 3]}
                        numColumns={3}
                        renderItem={({item}) => <ItemCard />}
                        keyExtractor={(item, index) => 'item-card-' + index} // TODO - Add ID item
                    />
                </Animated.View>
            </>
        );
    }
}

Avatar.prototype.props = AvatarProps;
Avatar.defaultProps = AvatarProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    column: {
        width: '15%',
        alignItems: 'center'
    },
    column2: {
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
        backgroundColor: '#FFFFFF'
    },

    editor: {
        position: 'absolute',
        padding: '5%',
        left: 0,
        right: 0,
        borderRadius: 16,
        zIndex: 100,
        elevation: 100,
        borderTopColor: '#FFFFFF',
        borderWidth: 1
    },
    editorClose: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 100,
        elevation: 100
    }
});

export default Avatar;