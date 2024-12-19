import { Animated, Dimensions, FlatList } from 'react-native';

import user from 'Managers/UserManager';

import PAGES from 'Interface/Pages';
import { MinMax } from 'Utils/Functions';
import { EasingAnimation, SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

class Mover {
    panel = {
        height: 0,
        /** @type {number} Panel Y position, 0 is closed (at the bottom of the screen) and + is opened */
        posY: 0,
        posAnimY: new Animated.Value(0),
        minPosY: 0,
        maxPosY: Dimensions.get('window').height * 0.9
    };

    scrollView = {
        /** @type {Animated.FlatList | FlatList | ScrollView | null} */
        ref: null,
        height: 0,
        innerHeight: 0,
        scrollY: 0,
        scrollAnimY: new Animated.Value(0)
    };

    events = {
        /** @type {number} Last X position */
        lastX: 0,

        /** @type {number} Last Y position */
        lastY: 0,

        /** @type {number} Accumulated X */
        accX: 0,

        /** @type {number} Accumulated Y */
        accY: 0,

        /** @type {number} Start time */
        startTime: 0,

        /** @type {number} Last tick time */
        tickTime: 0,

        /** @type {boolean} */
        isScrolling: false,

        /** @type {boolean} */
        isClosing: false
    };

    /** @type {boolean} Disable panel moving */
    scrollEnabled = true;

    /** @type {string | null} */
    animationListener = null;

    /** @param {Animated.FlatList | FlatList | ScrollView | null} scrollView */
    SetScrollView = (scrollView) => {
        if (scrollView === null || scrollView === this.scrollView.ref) {
            return;
        }
        if (this.scrollView.ref !== null) {
            this.UnsetScrollView();
        }

        this.scrollView.ref = scrollView;

        // Reset scroll position
        this.scrollView.scrollY = 0;
        this.scrollView.scrollAnimY.setValue(0);

        // If not scrollable skip the rest
        if (!this.scrollEnabled) {
            return;
        }

        // ScrollView is FlatList
        if (scrollView instanceof FlatList /* || scrollView instanceof Animated.FlatList */) {
            if (scrollView.props.scrollEnabled !== false) {
                scrollView.setNativeProps({ scrollEnabled: false });
            }

            if (typeof scrollView.props.onLayout !== 'function') {
                user.interface.console?.AddLog('warn', '[BottomPanel] onLayout is not set to Mover.onLayoutFlatList');
            }

            if (typeof scrollView.props.onContentSizeChange !== 'function') {
                user.interface.console?.AddLog(
                    'warn',
                    '[BottomPanel] onContentSizeChange is not set to Mover.onContentSizeChange'
                );
            }

            // Set scroll listener
            this.animationListener = this.scrollView.scrollAnimY.addListener(({ value }) => {
                scrollView.scrollToOffset({ offset: value, animated: false });
            });
        }

        // ScrollView is ScrollView
        else if (Object.getPrototypeOf(scrollView).constructor.name === 'ReactNativeFiberHostComponent') {
            // TODO: Add types & check for ScrollView (scrollEnabled, onLayout, onContentSizeChange)

            /** @type {ScrollView['props']} */
            //const ref = scrollView.viewConfig.validAttributes;

            //if (ref.scrollEnabled !== false) {
            //    user.interface.console?.AddLog(
            //        'error',
            //        '[BottomPanel] ScrollView have to be scrollEnabled=false (' + ref.scrollEnabled + ')'
            //    );
            //    return;
            //}

            // if (scrollView.props.onLayout !== this.onLayoutFlatList) {
            //     user.interface.console?.AddLog('error', '[BottomPanel] onLayout is not set to Mover.onLayoutFlatList');
            // }
            // if (scrollView.props.onContentSizeChange !== this.onContentSizeChange) {
            //     user.interface.console?.AddLog(
            //         'error',
            //         '[BottomPanel] onContentSizeChange is not set to Mover.onContentSizeChange'
            //     );
            // }

            this.animationListener = this.scrollView.scrollAnimY.addListener(({ value }) => {
                // @ts-ignore
                scrollView.scrollTo({ y: value, animated: false });
            });
        }
    };

    UnsetScrollView = () => {
        this.scrollView.ref = null;
        if (this.animationListener !== null) {
            this.scrollView.scrollAnimY.removeListener(this.animationListener);
        }
    };

    /**
     * @param {number | null} y Scroll to Y position (null to keep current position)
     * @param {boolean} [animation] Default is true (smooth animation)
     */
    GotoY = (y = null, animation = true) => {
        if (this.events.isClosing) {
            return;
        }

        // Clamp panel position
        const maxScroll = Math.min(this.panel.height, this.panel.maxPosY);
        if (y !== null) {
            this.panel.posY = Math.min(y, maxScroll);
        } else {
            this.panel.posY = Math.min(this.panel.posY, maxScroll);
        }

        // Clamp scroll position
        this.scrollView.scrollY = MinMax(
            0,
            this.scrollView.scrollY,
            this.scrollView.innerHeight - this.scrollView.height
        );

        // Update scroll position
        if (animation) {
            SpringAnimation(this.panel.posAnimY, -this.panel.posY).start();
            EasingAnimation(this.scrollView.scrollAnimY, this.scrollView.scrollY).start();
        } else {
            this.panel.posAnimY.setValue(-this.panel.posY);
            this.scrollView.scrollAnimY.setValue(this.scrollView.scrollY);
        }

        // Hide navbar on scroll
        const pageName = user.interface.GetCurrentPageName();
        const pageHasNavBar = pageName !== null && PAGES[pageName].feShowNavBar;
        const isScrolling = this.panel.posY > 0 && this.panel.posY < this.panel.maxPosY - 10;
        if (isScrolling && user.interface.navBar?.show) {
            user.interface.navBar?.Hide();
        } else if (pageHasNavBar && !isScrolling && !user.interface.navBar?.show) {
            user.interface.navBar?.Show();
        }
    };

    /**
     * @param {number} y
     * @param {boolean} [animated]
     */
    ScrollTo = (y, animated = false) => {
        // Clamp scroll position
        const _y = MinMax(0, y, this.scrollView.innerHeight - this.scrollView.height);
        this.scrollView.scrollY = _y;

        // Update scroll position
        if (animated) {
            EasingAnimation(this.scrollView.scrollAnimY, _y).start();
        } else {
            this.scrollView.scrollAnimY.setValue(_y);
        }
    };

    /** @type {FlatList['props']['onLayout']} */
    onLayoutFlatList = (event) => {
        this.scrollView.height = event.nativeEvent.layout.height;
    };

    /** @type {FlatList['props']['onContentSizeChange']} */
    onContentSizeChange = (_width, intentHeight) => {
        this.scrollView.innerHeight = intentHeight;
    };

    /** @param {GestureResponderEvent} event */
    touchStart = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        this.events.lastX = pageX;
        this.events.lastY = pageY;
        this.events.accX = 0;
        this.events.accY = 0;
        this.events.startTime = Date.now();
        this.events.tickTime = Date.now();
        this.events.isScrolling = false;
    };

    /** @param {GestureResponderEvent} event */
    touchMove = (event) => {
        // Position
        const posX = event.nativeEvent.pageX;
        const posY = event.nativeEvent.pageY;
        const deltaX = this.events.lastX - posX;
        const deltaY = this.events.lastY - posY;

        // Acceleration
        const deltaTime = (Date.now() - this.events.tickTime) / 1000;
        this.events.accX = MinMax(-5000, deltaX / deltaTime, 5000);
        this.events.accY = MinMax(-5000, deltaY / deltaTime, 5000);
        this.events.tickTime = Date.now();

        if (!this.scrollEnabled) return;

        // Update
        const max = Math.min(this.panel.height, this.panel.maxPosY);
        this.events.lastX = posX;
        this.events.lastY = posY;

        const isScrolledMaxAndContinueScrolling = this.panel.posY >= max && deltaY > 0;
        const refAlreadyScrolled = this.scrollView.scrollY > 0;
        if (!!this.scrollView.ref && (isScrolledMaxAndContinueScrolling || refAlreadyScrolled)) {
            this.scrollView.scrollY += deltaY;
        } else {
            this.panel.posY += deltaY;
        }

        if (this.scrollView.scrollY > 10) {
            this.events.isScrolling = true;
        }

        this.GotoY(null, false);
    };

    /** @param {GestureResponderEvent} _event */
    touchEnd = (_event) => {
        if (!this.scrollEnabled) return;

        // Big swipe down
        if (
            this.panel.posY < 0 ||
            (!this.events.isScrolling && this.events.accY < -1500 && this.panel.posY < this.panel.minPosY)
        ) {
            user.interface.bottomPanel?.Close(true);
            return;
        }

        // Big swipe of the panel or scroll
        const max = Math.min(this.panel.height, this.panel.maxPosY);
        const isScrolledMaxAndContinueScrolling = this.panel.posY >= max && this.events.accY > 0;
        const refAlreadyScrolled = this.scrollView.scrollY > 0;
        if (!!this.scrollView.ref && (isScrolledMaxAndContinueScrolling || refAlreadyScrolled)) {
            this.scrollView.scrollY += this.events.accY * 0.5;
        } else {
            this.panel.posY += this.events.accY * 0.5;
        }

        const lowPos = Math.max(this.panel.posY, this.panel.minPosY);
        this.GotoY(lowPos);
    };
}

export default Mover;
