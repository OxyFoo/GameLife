import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { GetAbsolutePosition } from 'Utils/UI';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components/Zap/back').ZapFace} ZapFace
 * @typedef {import('Interface/Components/Zap/back').ZapInclinaison} ZapInclinaison
 * @typedef {import('Interface/Components/Zap/back').ZapOrientation} ZapOrientation
 */

const GLOBAL_MARGIN = 24;
const NEXT_BUTTON_MARGIN = 48;

/**
 * @this {import('./back').default}
 * @returns {Promise<void>}
 */
async function UpdatePositions() {
    const { zapLayout, messageLayout } = this;
    const {
        positionY,
        component: { ref },
        zap: { inline },
        showNextButton
    } = this.state;

    if (zapLayout === null || messageLayout === null) {
        return;
    }

    // Default zap & message position target
    let targetPosition = {
        x: user.interface.size.width / 2,
        y: user.interface.size.height / 2,
        width: 0,
        height: 0
    };

    // Auto component position
    if (ref !== null) {
        targetPosition = await GetAbsolutePosition(ref);
    }

    // Override component position
    if (positionY !== null) {
        targetPosition.y = positionY * user.interface.size.height;
    }

    const componentMidX = targetPosition.x + targetPosition.width / 2;
    const componentMidY = targetPosition.y + targetPosition.height / 2;
    const isOnTop = componentMidY < user.interface.size.height / 2;

    const theta =
        Math.PI / 2 +
        Math.atan2(componentMidX - user.interface.size.width / 2, componentMidY - user.interface.size.height / 2);

    const offset = targetPosition.height / 2;
    const offsetX = +Math.cos(theta) * offset;
    const offsetY = -Math.sin(theta) * offset;

    // Message absolute position (with delay)
    let messageX = componentMidX + offsetX - messageLayout.width / 2;
    let messageY = componentMidY + offsetY;
    if (isOnTop && !inline) {
        messageY = messageY + 24;
    } else {
        messageY = messageY - messageLayout.height - 24;
    }

    let zapPosX = 0;
    let zapPosY = 0;
    const quarterIndex = Math.floor(componentMidY / (user.interface.size.height / 4));

    // Zap side to message
    // So zap is on the left the message
    if (inline) {
        zapPosX = 20;
        zapPosY = targetPosition.y - zapLayout.height;
        messageX = zapPosX + zapLayout.width;
    }

    // Automatic zap position
    // So zap position is symetric to message from the component
    else {
        const thetaAuto =
            Math.atan2(componentMidX - user.interface.size.width / 2, componentMidY - user.interface.size.height / 2) +
            Math.PI / 2;

        // Invert zap & message position if component is on first or last quarter of the screen
        let distance = targetPosition.height / 2 + zapLayout.height;
        if (quarterIndex === 0 || quarterIndex >= 3) {
            distance = -distance - messageLayout.height;
        }

        const offsetXAuto = -Math.cos(thetaAuto) * distance;
        const offsetYAuto = Math.sin(thetaAuto) * distance;

        zapPosX = componentMidX + offsetXAuto - zapLayout.width / 2;
        zapPosY = componentMidY + offsetYAuto - zapLayout.height / 2;
    }

    const screenSize = user.interface.size;
    const screenWidth = screenSize.width - screenSize.insets.left - screenSize.insets.right;
    const screenHeight = screenSize.height - screenSize.insets.top - screenSize.insets.bottom;

    // Zap out of screen
    if (zapPosX < GLOBAL_MARGIN) {
        zapPosX = GLOBAL_MARGIN;
    }
    if (zapPosX + zapLayout.width > screenWidth - GLOBAL_MARGIN) {
        zapPosX = screenWidth - zapLayout.width - GLOBAL_MARGIN;
    }
    if (zapPosY < GLOBAL_MARGIN) {
        zapPosY = GLOBAL_MARGIN;
    }
    if (zapPosY + zapLayout.height > screenHeight - GLOBAL_MARGIN) {
        zapPosY = screenHeight - zapLayout.height - GLOBAL_MARGIN;
    }
    if (showNextButton && zapPosY + zapLayout.height > screenHeight - GLOBAL_MARGIN - NEXT_BUTTON_MARGIN) {
        zapPosY -= GLOBAL_MARGIN + NEXT_BUTTON_MARGIN;
    }

    // Message out of screen
    if (messageX < GLOBAL_MARGIN) {
        messageX = GLOBAL_MARGIN;
    }
    if (messageX + messageLayout.width > screenWidth - GLOBAL_MARGIN) {
        messageX = screenWidth - messageLayout.width - GLOBAL_MARGIN;
    }
    if (messageY < GLOBAL_MARGIN) {
        messageY = GLOBAL_MARGIN;
    }
    if (messageY + messageLayout.height > screenHeight - GLOBAL_MARGIN) {
        messageY = screenHeight - messageLayout.height - GLOBAL_MARGIN;
    }
    if (showNextButton && messageY + messageLayout.height > screenHeight - GLOBAL_MARGIN - NEXT_BUTTON_MARGIN) {
        messageY -= GLOBAL_MARGIN + NEXT_BUTTON_MARGIN;
    }

    // Zap states
    const isTop = quarterIndex === 0 || quarterIndex === 2;
    const isRight = targetPosition.x >= user.interface.size.width / 2 || inline;

    /** @type {ZapInclinaison} */
    const inclinaison = isTop ? 'onTwoLegs' : 'onFourLegs';
    /** @type {ZapFace} */
    const face = 'face';
    /** @type {ZapOrientation} */
    const orientation = isRight ? 'right' : 'left';

    return new Promise((resolve) => {
        this.setState(
            {
                zap: {
                    ...this.state.zap,
                    inclinaison: inclinaison,
                    face: face,
                    orientation: orientation
                }
            },
            () => {
                Animated.parallel([
                    SpringAnimation(this.state.message.position, {
                        x: messageX,
                        y: messageY
                    }),
                    SpringAnimation(this.state.zap.position, {
                        x: zapPosX,
                        y: zapPosY
                    })
                ]).start(() => {
                    if (ref !== null) {
                        this.setState(
                            {
                                zap: {
                                    ...this.state.zap,
                                    face: 'show'
                                }
                            },
                            () => {
                                resolve();
                            }
                        );
                    } else {
                        resolve();
                    }
                });
            }
        );
    });
}

export { UpdatePositions };
