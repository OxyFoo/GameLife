import * as React from 'react';

/**
 * @typedef {import('Interface/FlowEngine/back').FlowEnginePublicClass} FlowEnginePublicClass
 */

class PageBase extends React.Component {
    /**
     * @description Page is not unmounted when changing page (default: false)
     * @type {boolean}
     */
    static feKeepMounted = false;

    /**
     * @description Show user header (default: false)
     * @type {boolean}
     */
    static feShowUserHeader = false;

    /**
     * @description Show bottom bar (default: false)
     * @type {boolean}
     */
    static feShowNavBar = false;

    /**
     * @description Enable scroll on page (default: true)
     * @type {boolean}
     */
    static feScrollEnabled = true;

    /**
     * @description Refresh page when focused (default: true)
     * @type {boolean}
     * @private
     */
    refresh = true;

    constructor(props = {}) {
        super(props);

        /** @type {FlowEnginePublicClass | null} */
        const flowEngine = this.props.flowEngine || null;

        if (flowEngine === null) {
            throw new Error('PageBase must have a parent');
        }

        /**
         * @description FlowEngine parent
         * @type {FlowEnginePublicClass}
         */
        this.fe = flowEngine;
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
    componentDidFocused(props) {
        props;
    }

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
