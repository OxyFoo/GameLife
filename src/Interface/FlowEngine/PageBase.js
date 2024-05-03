import * as React from 'react';

/**
 * @typedef {import('Interface/FlowEngine').default} FlowEngine
 */

class PageBase extends React.Component {
    /**
     * @description Page is not unmounted when changing page (default: false)
     * @type {boolean}
     */
    feKeepMounted = false;

    refresh = true;

    constructor(props = {}) {
        super(props);

        /** @type {FlowEngine | null} */
        const parent = this.props.flowEngine || null;

        if (parent === null) {
            throw new Error('PageBase must have a parent');
        }

        /**
         * @description FlowEngine parent
         * @type {FlowEngine}
         */
        this.fe = this.props.flowEngine;
    }

    /** @param {this['props']} props */
    _componentDidFocused(props) {
        this.refresh = true;
        this.componentDidFocused(props);
    }

    _componentDidUnfocused() {
        this.refresh = false;
        this.componentDidUnfocused();
    }

    /**
     * @description Called when page is already mounted and focused
     * @param {this['props']} props
     */
    componentDidFocused(props) {}

    /**
     * @description Called when page is unmounted or not focused
     */
    componentDidUnfocused() {}

    /**
     * @description Avoid re-rendering when page is not focused\
     * ⚠ You shouldn't override this method to keep the behavior
     */
    shouldComponentUpdate() {
        return this.refresh;
    }
}

export default PageBase;
