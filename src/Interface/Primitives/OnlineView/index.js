import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {object} OnlineViewProps
 * @property {React.ReactNode} children
 * @property {React.ReactNode} offlineView
 * @property {(online: boolean) => void} [onChangeState]
 */

/** @type {OnlineViewProps} */
const OnlineViewProps = {
    children: [],
    offlineView: null
};

/**
 * @param {OnlineViewProps} props
 * @returns {React.ReactNode}
 */
function OnlineView(props = OnlineViewProps) {
    const { children, offlineView, onChangeState } = props;

    const initialOnlineState = user.server2.IsAuthenticated();
    const [isOnline, setIsOnline] = React.useState(initialOnlineState);

    React.useEffect(() => {
        const updateOnlineStatus = () => {
            const _isOnline = user.server2.IsAuthenticated();

            if (_isOnline !== isOnline) {
                onChangeState?.(_isOnline);
                setIsOnline(_isOnline);
            }
        };

        const listenerTCP = user.server2.tcp.state.AddListener(updateOnlineStatus);
        const listenerDevice = user.server2.deviceAuth.state.AddListener(updateOnlineStatus);
        const listenerUser = user.server2.userAuth.email.AddListener(updateOnlineStatus);

        return () => {
            user.server2.tcp.state.RemoveListener(listenerTCP);
            user.server2.deviceAuth.state.RemoveListener(listenerDevice);
            user.server2.userAuth.email.RemoveListener(listenerUser);
        };
    });

    if (!isOnline && offlineView) {
        return offlineView;
    }

    return children;
}

export { OnlineView };
