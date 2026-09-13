/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

/**
 * Props for an action nested in the raid card.
 *
 * `Button` reads raw `onTouch*` events and never claims the touch responder, so a press on it also
 * reaches the card's `TouchableOpacity`: the reward was claimed *and* the raid details opened.
 * Claiming the responder ends the negotiation on the button, the deepest node asked, so the card
 * never sees the touch. Termination stays granted, otherwise the surrounding `ScrollView` could no
 * longer scroll from a finger landing on a button.
 */
const STOP_CARD_PRESS = {
    /** @type {() => boolean} */
    onStartShouldSetResponder: () => true,

    /** @type {(event: GestureResponderEvent) => boolean} */
    onResponderTerminationRequest: () => true
};

export { STOP_CARD_PRESS };
