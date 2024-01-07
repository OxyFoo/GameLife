import * as React from 'react';
import { View } from 'react-native';

/**
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const SimpleContainerProps = {
    /** @type {ReactNode} */
    children: null,

    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    backgroundColor: 'backgroundTransparent',
};

class SimpleContainerBack extends React.Component {
    static Header = (props) => {
        return <View {...props} />;
    };

    static Body = (props) => {
        return <View {...props} />;
    };
}

SimpleContainerBack.prototype.props = SimpleContainerProps;
SimpleContainerBack.defaultProps = SimpleContainerProps;

export default SimpleContainerBack;
