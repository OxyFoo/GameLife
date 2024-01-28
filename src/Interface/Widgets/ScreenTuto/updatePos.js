import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { GetDate } from 'Utils/Time';
import { GetAbsolutePosition } from 'Utils/UI';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Interface/Components/Zap/back').ZapColor} ZapColor
 * @typedef {import('Interface/Components/Zap/back').ZapInclinaison} ZapInclinaison
 * @typedef {import('Interface/Components/Zap/back').ZapFace} ZapFace
 * @typedef {import('Interface/Components/Zap/back').ZapOrientation} ZapOrientation
 */

/**
 * @this {import('./back').default}
 */
async function UpdatePositions() {
    const { zapLayout, messageLayout } = this;
    const { positionY, component: { ref }, zap: { inline } } = this.state;

    if (zapLayout === null || messageLayout === null) {
        return;
    }

    // Default zap & message position target
    let targetPosition = {
        x: user.interface.screenWidth / 2,
        y: user.interface.screenHeight / 2,
        width: 0,
        height: 0
    };

    // Auto component position
    if (ref !== null) {
        targetPosition = await GetAbsolutePosition(ref);
    }

    // Override component position
    if (positionY !== null) {
        targetPosition.y = positionY * user.interface.screenHeight;
    }

    const componentMidX = targetPosition.x + targetPosition.width / 2;
    const componentMidY = targetPosition.y + targetPosition.height / 2;
    const isOnTop = componentMidY < user.interface.screenHeight / 2;

    const theta = Math.PI / 2 + Math.atan2(
        componentMidX - user.interface.screenWidth / 2,
        componentMidY - user.interface.screenHeight / 2
    );

    const offset = targetPosition.height / 2;
    const offsetX = + Math.cos(theta) * offset;
    const offsetY = - Math.sin(theta) * offset;

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
    const quarterIndex = Math.floor(componentMidY / (user.interface.screenHeight / 4));

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
        const theta = Math.atan2(
            componentMidX - user.interface.screenWidth / 2,
            componentMidY - user.interface.screenHeight / 2
        ) + Math.PI / 2;

        // Invert zap & message position if component is on first or last quarter of the screen
        let offset = targetPosition.height / 2 + zapLayout.height / 2 + 36;
        if (quarterIndex === 0 || quarterIndex >= 3) {
            offset = - offset - messageLayout.height - 36;
        }

        const offsetX = - Math.cos(theta) * offset;
        const offsetY = Math.sin(theta) * offset;

        zapPosX = componentMidX + offsetX - zapLayout.width / 2;
        zapPosY = componentMidY + offsetY - zapLayout.height / 2;
    }

    // Zap out of screen
    if (zapPosX < 0)
        zapPosX = 0;
    if (zapPosX + zapLayout.width > user.interface.screenWidth)
        zapPosX = user.interface.screenWidth - zapLayout.width;
    if (zapPosY < 0)
        zapPosY = 0;
    if (zapPosY + zapLayout.height > user.interface.screenHeight)
        zapPosY = user.interface.screenHeight - zapLayout.height;

    // Message out of screen
    if (messageX < 0)
        messageX = 0;
    if (messageX + messageLayout.width > user.interface.screenWidth)
        messageX = user.interface.screenWidth - messageLayout.width;
    if (messageY < 0)
        messageY = 0;
    if (messageY + messageLayout.height > user.interface.screenHeight)
        messageY = user.interface.screenHeight - messageLayout.height;

    // Zap states
    const isTop = quarterIndex === 0 || quarterIndex === 2;
    const isRight = targetPosition.x >= user.interface.screenWidth / 2 || inline;
    const isNight = GetDate().getHours() >= 20 || GetDate().getHours() <= 8;

    /** @type {ZapColor} */
    const color = isNight ? 'night' : 'day';
    /** @type {ZapInclinaison} */
    const inclinaison = isTop ? 'onTwoLegs' : 'onFourLegs';
    /** @type {ZapFace} */
    const face = 'face';
    /** @type {ZapOrientation} */
    const orientation = isRight ? 'right' : 'left';

    return new Promise(resolve => {
        this.setState({
            zap: {
                ...this.state.zap,
                color: color,
                inclinaison: inclinaison,
                face: face,
                orientation: orientation
            }
        }, () => {
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
                    this.setState({
                        zap: {
                            ...this.state.zap,
                            face: 'show'
                        }
                    }, () => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    });
}

export { UpdatePositions };
