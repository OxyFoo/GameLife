import user from 'Managers/UserManager';

import { CircularAnimation, SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('./back').default} BackPage
 */

class Scrolling {
    /** @param {BackPage} parent */
    constructor(parent) {
        this.parent = parent;
    }

    posY = 0;
    scrollEnabled = true;

    firstTouchY = 0;
    firstPosY = 0;
    tickTime = 0;
    tickPos = 0;
    acc = 0;

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const nativeEvent = event?.nativeEvent || null;
        if (nativeEvent === null) return;

        const height = nativeEvent.layout.height;
        if (height !== this.parent.state.height) {
            this.parent.setState({ height: height }, () => {
                this.posY = this.limitValues(this.posY);
                CircularAnimation(this.parent.positionY, this.posY, 500).start();
            });
        }
        this.parent.props.onLayout(event);
    }

    /** @param {number} scrollY */
    onScroll = (scrollY) => {
        const { topOverlay, topOverlayHeight } = this.parent.props;
        if (topOverlay !== null) {
            if (-scrollY > topOverlayHeight && !this.parent.state.topOverlayShow) {
                this.parent.setState({ topOverlayShow: true });
                SpringAnimation(this.parent.topOverlayPosition, 0).start();
            } else if (-scrollY < topOverlayHeight && this.parent.state.topOverlayShow) {
                this.parent.setState({ topOverlayShow: false });
                SpringAnimation(this.parent.topOverlayPosition, 1).start();
            }
        }
    }

    /**
     * @param {number} value
     * @param {boolean} canScrollOver
     */
    limitValues = (value, canScrollOver = false) => {
        if (!this.parent.props.scrollable) {
            return 0;
        }

        const reduceScroll = 8;

        // No scroll over bottom
        const { height } = this.parent.state;
        const bottom = value + height;
        const bottomOffset = this.parent.props.isHomePage ? user.interface.bottomBar.state.height : this.parent.props.bottomOffset;
        const maxHeight = user.interface.screenHeight - bottomOffset;

        // No scroll over bottom
        if (!canScrollOver) {
            if (bottom < maxHeight)
                value = maxHeight - height;
        }

        // Reduce over scroll bottom
        else if (height > maxHeight) {
            if (bottom < maxHeight) {
                value = (maxHeight - height) + ((value - (maxHeight - height)) / reduceScroll);
            }
        }

        // Reduce over scroll bottom (if height < maxHeight)
        else if (value < 0) {
            value /= reduceScroll;
        }

        // No scroll over top
        if (!canScrollOver)
            if (value > 0)
                value = 0;

        // Reduce over scroll top
        if (value > 0) {
            value /= reduceScroll;
        }

        return value;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (!this.scrollEnabled) return;

        this.acc = 0;
        this.firstPosY = this.posY;
        this.firstTouchY = event.nativeEvent.pageY;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        if (!this.scrollEnabled) return;

        // Position
        const currPosY = event.nativeEvent.pageY;
        const deltaPosY = this.firstTouchY - currPosY;
        const newPosY = this.firstPosY - deltaPosY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.acc = (newPosY - this.tickPos) / deltaTime;
        this.tickTime = Date.now();
        this.tickPos = newPosY;

        // Update
        this.posY = this.limitValues(newPosY, this.parent.props.canScrollOver);
        TimingAnimation(this.parent.positionY, this.posY, 1).start();
        this.onScroll(this.posY);
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (!this.scrollEnabled) return;

        let newPosY = this.posY + this.acc * 0.25;
        newPosY = this.limitValues(newPosY);

        this.posY = newPosY;
        CircularAnimation(this.parent.positionY, newPosY).start();
        this.onScroll(this.posY);
    }
}

export default Scrolling;
