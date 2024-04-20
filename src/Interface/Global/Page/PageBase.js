import * as React from 'react';

/**
 * @typedef {import('Interface/Global').Page} Page
 */

class PageBase extends React.Component {
    /** @type {Page | null} */
    refPage = null;

    /** @type {boolean} */
    loaded = false;

    /** @description Do not forgot super.componentDidMount */
    componentDidMount() {
        this.loaded = true;
    }

    /** @description Called when page is focused */
    componentDidFocused = (args) => {};
}

export default PageBase;
