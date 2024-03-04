import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const NewsProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNews extends React.Component {
}

BackNews.prototype.props = NewsProps;
BackNews.defaultProps = NewsProps;

export default BackNews;
