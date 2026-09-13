import { TwoDigit, Round, Sum, Range, SortByKey, GetByKey, MinMax, IsUndefined, Random } from '../Functions';

describe('[Utils] Functions', () => {
    describe('TwoDigit', () => {
        it('should pad a single digit', () => {
            expect(TwoDigit(0)).toBe('00');
            expect(TwoDigit(7)).toBe('07');
        });

        it('should keep two digits as-is and truncate beyond', () => {
            expect(TwoDigit(42)).toBe('42');
            expect(TwoDigit(123)).toBe('23');
        });
    });

    describe('Round', () => {
        it('should floor to an integer by default', () => {
            expect(Round(3.9)).toBe(3);
        });

        it('should floor to the requested number of decimals', () => {
            expect(Round(3.456, 2)).toBe(3.45);
            expect(Round(3.456, 1)).toBe(3.4);
        });
    });

    describe('Sum', () => {
        it('should sum the values', () => {
            expect(Sum([1, 2, 3])).toBe(6);
        });

        it('should return 0 for an empty array', () => {
            expect(Sum([])).toBe(0);
        });
    });

    describe('Range', () => {
        it('should build a zero-based range', () => {
            expect(Range(5)).toEqual([0, 1, 2, 3, 4]);
        });

        it('should honour the step', () => {
            expect(Range(6, 2)).toEqual([0, 2, 4]);
        });

        it('should return an empty range for length 0', () => {
            expect(Range(0)).toEqual([]);
        });
    });

    describe('MinMax', () => {
        it('should clamp below, inside and above the bounds', () => {
            expect(MinMax(0, -5, 10)).toBe(0);
            expect(MinMax(0, 5, 10)).toBe(5);
            expect(MinMax(0, 50, 10)).toBe(10);
        });
    });

    describe('IsUndefined', () => {
        it('should only be true for undefined', () => {
            expect(IsUndefined(undefined)).toBe(true);
            expect(IsUndefined(null)).toBe(false);
            expect(IsUndefined(0)).toBe(false);
        });
    });

    describe('SortByKey', () => {
        it('should sort by a numeric key', () => {
            const sorted = SortByKey([{ n: 3 }, { n: 1 }, { n: 2 }], 'n');
            expect(sorted.map((e) => e.n)).toEqual([1, 2, 3]);
        });

        it('should sort strings case-insensitively', () => {
            const sorted = SortByKey([{ s: 'banana' }, { s: 'Apple' }], 's');
            expect(sorted.map((e) => e.s)).toEqual(['Apple', 'banana']);
        });
    });

    describe('GetByKey', () => {
        const items = [
            { ID: 1, name: 'one' },
            { ID: 2, name: 'two' }
        ];

        it('should return the matching element', () => {
            expect(GetByKey(items, 'ID', 2)).toEqual({ ID: 2, name: 'two' });
        });

        it('should return null when nothing matches', () => {
            expect(GetByKey(items, 'ID', 99)).toBeNull();
        });
    });

    describe('Random', () => {
        it('should stay within [min, max[', () => {
            for (let i = 0; i < 100; i++) {
                const value = Random(5, 10, 2);
                expect(value).toBeGreaterThanOrEqual(5);
                expect(value).toBeLessThan(10);
            }
        });
    });
});
