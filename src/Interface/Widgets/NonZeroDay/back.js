import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const NonZeroDayProps = {
    /** @type {StyleProp} */
    style: {}
};

class NonZeroDayBack extends React.Component {
}

NonZeroDayBack.prototype.props = NonZeroDayProps;
NonZeroDayBack.defaultProps = NonZeroDayProps;

export default NonZeroDayBack;
