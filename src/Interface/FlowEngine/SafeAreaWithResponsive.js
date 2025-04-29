import * as React from 'react';
import { SafeAreaView, Dimensions } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

/**
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {JSX.Element} props.children
 * @param {(event: LayoutChangeEvent) => void} [props.onLayout]
 * @returns {JSX.Element}
 */
const SafeAreaWithResponsive = ({ testID, children, onLayout }) => {
    const [responsive, setResponsive] = React.useState(user.interface?.responsive.Get());

    React.useEffect(() => {
        setResponsive(user.interface.responsive.Get());
        const listener = user.interface.responsive.AddListener((newResponsive) => {
            setResponsive(newResponsive);
        });

        return () => {
            user.interface.responsive.RemoveListener(listener);
        };
    }, []);

    return (
        <SafeAreaView
            style={[
                styles.safeView,
                {
                    paddingVertical: responsive?.paddingVertical,
                    paddingHorizontal: responsive?.paddingHorizontal
                },
                typeof responsive?.scale === 'number' && {
                    width: `${100 / responsive?.scale}%`,
                    height: `${100 / responsive?.scale}%`,
                    transform: [
                        { translateX: (((100 - 100 / responsive?.scale) / 2) * Dimensions.get('window').width) / 100 },
                        {
                            translateY:
                                (((100 - 100 / responsive?.scale) / 2) * Dimensions.get('window').height) / 100 +
                                (responsive?.scale < 1 ? 24 * (1 - responsive?.scale) : -8 * (responsive?.scale - 1)) // Offset needed ?
                        },
                        { scale: responsive?.scale }
                    ]
                }
            ]}
            testID={testID}
            onLayout={onLayout}
            children={children}
        />
    );
};

export default SafeAreaWithResponsive;
