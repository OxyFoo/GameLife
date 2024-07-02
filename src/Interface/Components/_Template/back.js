import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const NewComponentProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNewComponent extends React.Component {
    state = {};
}

BackNewComponent.prototype.props = NewComponentProps;
BackNewComponent.defaultProps = NewComponentProps;

export default BackNewComponent;
