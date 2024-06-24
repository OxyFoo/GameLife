import * as React from 'react';
import { Animated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import BackNotificationsInApp from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';
import { Icon } from '../Icon';
import { Button } from '../Button';

class NotificationsInAppButton extends BackNotificationsInApp {
    render() {
        const styleBellAnim = {
            transform: [
                {
                    rotate: this.state.animBell.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: ['0deg', '-15deg', '15deg', '0deg']
                    })
                }
            ]
        };

        return (
            <Button
                style={[styles.button, this.props.style]}
                appearance='uniform'
                color='transparent'
                onPress={this.openNotificationsHandler}
            >
                <Animated.View style={styleBellAnim}>
                    <Icon icon='bell-outline' color='gradient' size={28} />
                </Animated.View>
                {this.renderBadge()}
            </Button>
        );
    }

    renderBadge = () => {
        const { notificationsCount, animOpenCount } = this.state;

        if (notificationsCount <= 0) {
            return null;
        }

        const badgeStyle = {
            width: Animated.add(styles.badge.width, Animated.multiply(18, animOpenCount)),
            height: Animated.add(styles.badge.height, Animated.multiply(18, animOpenCount)),
            borderRadius: Animated.subtract(styles.badge.borderRadius, Animated.multiply(93, animOpenCount))
        };

        return (
            <>
                <MaskedView
                    style={styles.badgeMask}
                    maskElement={<Animated.View style={[styles.badge, badgeStyle, styles.badgeDarkClone]} />}
                >
                    <Icon icon='bell-outline' color='black' size={28} />
                </MaskedView>

                <Animated.View
                    style={[
                        styles.badge,
                        badgeStyle,
                        {
                            backgroundColor: themeManager.GetColor('main2')
                        }
                    ]}
                >
                    <Animated.View style={{ opacity: animOpenCount }}>
                        <Text color='primary' fontSize={notificationsCount < 100 ? 14 : 10}>
                            {notificationsCount < 100 ? notificationsCount.toString() : '99+'}
                        </Text>
                    </Animated.View>
                </Animated.View>
            </>
        );
    };
}

export { NotificationsInAppButton };
