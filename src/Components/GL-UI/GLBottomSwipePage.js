import * as React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { OptionsAnimation, OptionsAnimationSpring } from '../Animations';
import GLIconButton from './GLIconButton';

import GLText from './GLText';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_LIMIT = .65;

const MAX = SCREEN_HEIGHT * SCREEN_LIMIT - 64;
const MID = MAX / 2;

class GLBottomSwipePage extends React.Component {
    state = {
        init_posY: 0,
        animPositionY: new Animated.Value(0)
    }

    swipe_start = (event) => {
        const posY = event.nativeEvent.pageY;
        this.last_posY = posY;
    }
    swipe_move = (event) => {
        const posY = event.nativeEvent.pageY;
        const newPosY = this.state.init_posY + this.last_posY - posY;
        if (newPosY) {
            this.curr_posY = newPosY;
            OptionsAnimation(this.state.animPositionY, newPosY, 0, false).start();
        }
    }
    swipe_end = (event) => {
        if (this.curr_posY > MID) {
            OptionsAnimationSpring(this.state.animPositionY, MAX, false).start();
            this.setState({ init_posY: MAX });
        } else {
            OptionsAnimationSpring(this.state.animPositionY, 0, false).start();
            this.setState({ init_posY: 0 });
        }
    }

    render() {
        const icon = this.state.init_posY === 0 ? 'chevronTop' : 'chevronBottom';

        return (
            <Animated.View
                style={[
                    styles.containerModal,
                    {
                        height: new Animated.add(64, this.state.animPositionY),
                    }
                ]}
            >
                <View
                    style={styles.header}
                    onTouchStart={this.swipe_start}
                    onTouchMove={this.swipe_move}
                    onTouchEnd={this.swipe_end}
                >
                    <GLText style={styles.title} title={this.props.title} />
                    <GLIconButton icon={icon} size={32} />
                </View>
                <View style={styles.content}>
                    {this.props.children}
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    containerModal: {
        position: 'absolute',
        width: '100%',
        //height: 64,
        bottom: 0,
        left: 0,
        overflow: 'visible',
        backgroundColor: '#000000'
    },
    header: {
        width: '100%',
        height: 64,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000'
    },
    title: {
        fontSize: 28,
        textAlign: 'left'
    },
    content: {
        width: '100%',
        height: MAX + 1000,
        paddingBottom: 1000,
        backgroundColor: '#000000'
    }
});

export default GLBottomSwipePage;