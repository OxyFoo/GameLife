const fs = require('fs');
const os = require('os');
const path = require('path');

const {
    RAIDS_DIR,
    REGISTRY_NAME,
    countConsecutive,
    pairPhases,
    readRaidFolder,
    readRaidFolders,
    buildRegistry,
    writeRegistry
} = require('../setup-raids');

/**
 * @param {Record<string, string[]>} folders Files of each folder
 * @returns {string}
 */
function makeRaidsDir(folders) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gamelife-raids-'));
    for (const [folder, files] of Object.entries(folders)) {
        fs.mkdirSync(path.join(dir, folder));
        for (const file of files) {
            fs.writeFileSync(path.join(dir, folder, file), '');
        }
    }
    return dir;
}

describe('setup-raids', () => {
    test('the phases stop at the first missing number', () => {
        const files = ['phase_1.png', 'phase_2.png', 'phase_4.png', 'phase_5.png', 'background_1.png'];
        expect(countConsecutive(files, 'phase_')).toBe(2);
        expect(countConsecutive(files, 'background_')).toBe(1);
        expect(countConsecutive(['phase_2.png'], 'phase_')).toBe(0);
    });

    test('a phase takes its own background, then the last one', () => {
        const backgrounds = (/** @type {number} */ phases, /** @type {number} */ count) =>
            pairPhases(phases, count).map((phase) => phase.background);

        expect(backgrounds(4, 2)).toEqual([
            'background_1.png',
            'background_2.png',
            'background_2.png',
            'background_2.png'
        ]);
        expect(backgrounds(3, 1)).toEqual(['background_1.png', 'background_1.png', 'background_1.png']);
        expect(backgrounds(2, 5)).toEqual(['background_1.png', 'background_2.png']);
        expect(pairPhases(2, 1).map((phase) => phase.boss)).toEqual(['phase_1.png', 'phase_2.png']);
    });

    test('the files the phases do not use are reported as ignored', () => {
        const raid = readRaidFolder('03_pride', [
            'phase_1.png',
            'phase_2.png',
            'phase_4.png',
            'background_1.png',
            'background_2.png',
            'background_3.png'
        ]);
        expect(raid.phases).toHaveLength(2);
        expect(raid.ignored).toEqual(['background_3.png', 'phase_4.png']);
    });

    test('a folder needs a first phase and a first background', () => {
        expect(() => readRaidFolder('05_envy', ['phase_1.png'])).toThrow('05_envy');
        expect(() => readRaidFolder('05_envy', ['phase_2.png', 'background_1.png'])).toThrow('05_envy');
        expect(() => readRaidFolder("05 l'envie", ['phase_1.png', 'background_1.png'])).toThrow();
    });

    test('the registry is rewritten only when the folders change', () => {
        const dir = makeRaidsDir({
            generic: ['phase_1.png', 'background_1.png'],
            '01_nyx': ['phase_1.png', 'phase_2.png', 'phase_3.png', 'background_1.png', 'background_2.png']
        });
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        try {
            expect(writeRegistry(dir)).toBe(true);
            expect(writeRegistry(dir)).toBe(false);

            const registry = fs.readFileSync(path.join(dir, REGISTRY_NAME), 'utf8');
            expect(registry).toContain("background: require('./01_nyx/background_2.png')");
            expect(registry.match(/require\('\.\/01_nyx\/phase_\d\.png'\)/g)).toHaveLength(3);
            expect(registry).toContain("boss: require('./generic/phase_1.png')");

            fs.writeFileSync(path.join(dir, '01_nyx', 'phase_4.png'), '');
            expect(writeRegistry(dir)).toBe(true);
        } finally {
            log.mockRestore();
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });

    test('the generic folder is required', () => {
        const dir = makeRaidsDir({ '01_nyx': ['phase_1.png', 'background_1.png'] });
        try {
            expect(() => buildRegistry(readRaidFolders(dir))).toThrow('generic');
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });

    test('res/raids/raids.js matches the folders of res/raids (run node scripts/setup-raids.js)', () => {
        const registry = fs.readFileSync(path.join(RAIDS_DIR, REGISTRY_NAME), 'utf8');
        expect(registry).toBe(buildRegistry(readRaidFolders()));
    });
});
