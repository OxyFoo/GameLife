import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const NewComponentProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNewComponent extends React.Component {
}

BackNewComponent.prototype.props = NewComponentProps;
BackNewComponent.defaultProps = NewComponentProps;

export default BackNewComponent;
