import * as React from 'react';

/**
 * @typedef {import('Interface/Global').Page} Page
 */

class PageBase extends React.Component {
    /** @type {React.RefObject<Page>} */
    refPage = React.createRef();

    /** @type {boolean} */
    loaded = false;

    /** @description Do not forgot super.componentDidMount */
    componentDidMount() {
        this.loaded = true;
    }

    /**
     * @description Called when page is focused
     * @param {Page['props']} args
     */
    componentDidFocused = (args) => {}
}

export default PageBase;
