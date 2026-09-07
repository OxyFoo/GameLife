import 'react-native';
import React from 'react';
import { act, render } from '@testing-library/react-native';

import DynamicVar from 'Utils/DynamicVar';
import { BonusOxMention } from '../mention';

/* The `args` of the display page are captured once, so the mention has to watch the bonus. */

describe('[Widget] BonusOxMention', () => {
    it('shows what the activity brought on its own', () => {
        const bonusOx = new DynamicVar(0);
        const { getAllByText } = render(<BonusOxMention baseOx={30} bonusOx={bonusOx} />);

        expect(getAllByText(/30/).length).toBeGreaterThan(0);
    });

    it('adds the bonus to the total once the ad has been watched', () => {
        const bonusOx = new DynamicVar(0);
        const { getAllByText, queryAllByText } = render(<BonusOxMention baseOx={30} bonusOx={bonusOx} />);

        act(() => bonusOx.Set(15));

        expect(getAllByText(/45/).length).toBeGreaterThan(0);
        expect(queryAllByText(/^\D*30\D*$/).length).toBe(0);
    });

    it('stops watching once unmounted', () => {
        const bonusOx = new DynamicVar(0);
        const { unmount } = render(<BonusOxMention baseOx={30} bonusOx={bonusOx} />);

        unmount();

        // Would throw on a setState after unmount if the listener was still registered
        act(() => bonusOx.Set(15));
    });
});
