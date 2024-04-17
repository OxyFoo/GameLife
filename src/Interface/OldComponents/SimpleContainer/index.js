import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import SimpleContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').ViewProps} ViewProps
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class SimpleContainer extends SimpleContainerBack {
    /** @param {ViewProps} props */
    static Header = (props) => {
        return <View {...props} />;
    };

    /** @param {ViewProps} props */
    static Body = (props) => {
        const bodyStyle = [
            styles.body,
            {
                backgroundColor: themeManager.GetColor('backgroundTransparent', { opacity: 0.1 })
            },
            props.style
        ];
        return <View {...props} style={bodyStyle} />;
    };

    render() {
        let header = <SimpleContainer.Header />;
        let body = <SimpleContainer.Body />;

        React.Children.forEach(this.props.children, child => {
            if (React.isValidElement(child)) {
                if (child.type === SimpleContainer.Header) {
                    header = child;
                } else if (child.type === SimpleContainer.Body) {
                    body = child;
                } else {
                    throw new Error('SimpleContainer only accepts SimpleContainer.Header and SimpleContainer.Body as children');
                }
            }
        });

        return (
            <View testID='simple-container' style={this.props.style}>
                {header}
                {body}
            </View>
        );
    }
}


export default SimpleContainer;
