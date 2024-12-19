import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

const TemplateGlobalBackProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class TemplateGlobalBack extends React.Component {
    state = {};
}

TemplateGlobalBack.prototype.props = TemplateGlobalBackProps;
TemplateGlobalBack.defaultProps = TemplateGlobalBackProps;

export default TemplateGlobalBack;
