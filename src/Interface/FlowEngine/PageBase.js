import * as React from 'react';

/**
 * @typedef {import('Interface/Global').Page} Page
 */

const PageBaseProps = {
    args: {}
};

class PageBase extends React.Component {
    /**
     * @description Page is not unmounted when changing page (default: false)
     * @type {boolean}
     */
    feKeepMounted = false;

    /**
     * @description Called when page is already mounted and focused
     * @param {this['props']} args
     */
    componentDidFocused = (args) => {}
}

PageBase.defaultProps = PageBaseProps;
PageBase.prototype.props = PageBaseProps;

export default PageBase;
