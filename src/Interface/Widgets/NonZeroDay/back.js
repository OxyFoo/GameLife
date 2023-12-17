import * as React from 'react';

import RenderPopup from './popup';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const NonZeroDayProps = {
    /** @type {StyleProp} */
    style: {}
};

class NonZeroDayBack extends React.Component {
    openPopup = () => {
        user.interface.popup.Open('custom', RenderPopup, undefined);
    }
}

NonZeroDayBack.prototype.props = NonZeroDayProps;
NonZeroDayBack.defaultProps = NonZeroDayProps;

export default NonZeroDayBack;
