import * as React from 'react';

import user from 'Managers/UserManager';

/**
 * @typedef {import('Data/User/Raids').RaidSnapshot} RaidSnapshot
 */

/**
 * Snapshot of the raid, refreshed on every change of the raid data, of the local preview, of the
 * minute tick and of the level (gate)
 * @returns {RaidSnapshot}
 */
function useRaid() {
    const [snapshot, setSnapshot] = React.useState(() => user.raids.GetSnapshot());

    React.useEffect(() => {
        const refresh = () => setSnapshot(user.raids.GetSnapshot());
        const l1 = user.raids.payload.AddListener(refresh);
        const l2 = user.raids.simulation.AddListener(refresh);
        const l3 = user.raids.tick.AddListener(refresh);
        const l4 = user.experience.experience.AddListener(refresh);
        refresh();
        return () => {
            user.raids.payload.RemoveListener(l1);
            user.raids.simulation.RemoveListener(l2);
            user.raids.tick.RemoveListener(l3);
            user.experience.experience.RemoveListener(l4);
        };
    }, []);

    return snapshot;
}

export { useRaid };
