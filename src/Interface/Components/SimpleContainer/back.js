import * as React from 'react';

/**
 * @typedef {import('react').ReactNode} ReactNode
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const SimpleContainerProps = {
    /** @type {ReactNode} */
    children: null,

    /** @type {StyleProp} */
    style: {}
};

class SimpleContainerBack extends React.Component {
}

SimpleContainerBack.prototype.props = SimpleContainerProps;
SimpleContainerBack.defaultProps = SimpleContainerProps;

export default SimpleContainerBack;
