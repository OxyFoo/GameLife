import * as React from 'react';

import Page from './Page';

/**
 * @typedef {import('../Components').Page} Page
 */

class PageBack extends React.Component {
    /** @type {Page} */
    refPage = React.createRef();

    /** @description Called when page is focused */
    componentDidFocused = () => {};
}

export default PageBack;
