import { RaidPhaseIndex } from 'Utils/Raids';

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
