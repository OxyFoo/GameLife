import * as React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Separator, Text } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

function RenderSeparator() {
    const [fadeAnim] = React.useState(new Animated.Value(0));

    // Animation on mount
    React.useEffect(() => {
        setTimeout(() => {
            SpringAnimation(fadeAnim, 1).start();
        }, 100);
    });

    const animStyle = {
        opacity: fadeAnim
    };

    return (
        <Animated.View style={animStyle}>
            <Separator style={styles.separator} />
        </Animated.View>
    );
}

function RenderEmpty() {
    const lang = langManager.curr['notifications']['in-app'];

    return <Text>{lang['list-empty']}</Text>;
}

export { RenderSeparator, RenderEmpty };
