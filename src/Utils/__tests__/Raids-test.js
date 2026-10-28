import { RaidDamageRatio, RaidPhaseIndex, RaidPhaseMarkers } from 'Utils/Raids';

describe('RaidDamageRatio', () => {
    test('follows the registry of the season while the boss stands', () => {
        expect(RaidDamageRatio(0, false)).toBe(0);
        expect(RaidDamageRatio(0.37, false)).toBe(0.37);
    });

    test('a defeated boss is fully damaged whatever the registry says', () => {
        expect(RaidDamageRatio(1 - 1e-9, true)).toBe(1);
        expect(RaidDamageRatio(0.9, true)).toBe(1);
    });

    test('out of range or unknown registry is clamped', () => {
        expect(RaidDamageRatio(-0.1, false)).toBe(0);
        expect(RaidDamageRatio(1.2, false)).toBe(1);
        expect(RaidDamageRatio(NaN, false)).toBe(0);
    });
});

describe('RaidPhaseIndex', () => {
    test('a single phase covers the whole life', () => {
        expect(RaidPhaseIndex(0, 1)).toBe(0);
        expect(RaidPhaseIndex(0.99, 1)).toBe(0);
        expect(RaidPhaseIndex(1, 1)).toBe(0);
    });

    test('two phases switch at half life', () => {
        expect(RaidPhaseIndex(0.49, 2)).toBe(0);
        expect(RaidPhaseIndex(0.5, 2)).toBe(1);
        expect(RaidPhaseIndex(1, 2)).toBe(1);
    });

    test('four phases switch every quarter', () => {
        expect([0, 0.24, 0.25, 0.49, 0.5, 0.74, 0.75, 1].map((progress) => RaidPhaseIndex(progress, 4))).toEqual([
            0, 0, 1, 1, 2, 2, 3, 3
        ]);
    });

    test('out of range progress stays on the first or the last phase', () => {
        expect(RaidPhaseIndex(-0.1, 3)).toBe(0);
        expect(RaidPhaseIndex(1.2, 3)).toBe(2);
        expect(RaidPhaseIndex(NaN, 3)).toBe(0);
    });
});

describe('RaidPhaseMarkers', () => {
    test('one delimiter between two phases, none for a single one', () => {
        expect(RaidPhaseMarkers(1)).toEqual([]);
        expect(RaidPhaseMarkers(2)).toEqual([0.5]);
        expect(RaidPhaseMarkers(4)).toEqual([0.25, 0.5, 0.75]);
    });

    test('a delimiter sits where the phase changes', () => {
        RaidPhaseMarkers(3).forEach((marker, i) => expect(RaidPhaseIndex(marker, 3)).toBe(i + 1));
    });
});
