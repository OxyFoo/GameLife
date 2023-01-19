import * as React from 'react';

import Page from './Page';

/**
 * @typedef {import('../Components').Page} Page
 */

class PageBack extends React.Component {
    /** @type {Page} */
    refPage = React.createRef();

    /** @type {boolean} */
    loaded = false;

    /** @description Do not forgot super.componentDidMount */
    componentDidMount() {
        this.loaded = true;
    }

    /** @description Called when page is focused */
    componentDidFocused = () => {};
}

export default PageBack;
