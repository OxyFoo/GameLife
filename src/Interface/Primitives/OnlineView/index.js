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
    const initialOnlineState = user.server2.tcp.state.Get() === 'authenticated';
    const [isOnline, setIsOnline] = React.useState(initialOnlineState);

    React.useEffect(() => {
        const listener = user.server2.tcp.state.AddListener(() => {
            const _isOnline = user.server2.tcp.state.Get() === 'authenticated';
            onChangeState?.(_isOnline);
            setIsOnline(_isOnline);
        });

        return () => {
            user.server2.tcp.state.RemoveListener(listener);
        };
    });

    if (!isOnline && offlineView) {
        return offlineView;
    }

    return children;
}

export { OnlineView };
