/**
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {{ name: string, value: string | number, time: number }} BenchResult
 */

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

/**
 * @param {Activity[]} activities
 * @returns {Promise<Array<BenchResult>>}
 */
async function Bench(activities) {
    let timer;

    /** @type {BenchResult[]} */
    const output = [];

    // Test 1: Map
    timer = performance.now();
    const mapResult = activities.map(activity => ({ id: activity.skillID, value: activity.startTime }));
    output.push({ name: 'Map', value: mapResult.length, time: performance.now() - timer });

    // Test 2: Map + Skills manager
    timer = performance.now();
    const mapSkillsResult = activities.map(activity => {
        const skill = dataManager.skills.GetByID(activity.skillID);
        return ({ id: activity.skillID, value: langManager.GetText(skill.Name) })
    });
    output.push({ name: 'Map + Skills', value: mapSkillsResult.length, time: performance.now() - timer });

    // Test 3: Map + Skills manager + Sort
    timer = performance.now();
    const mapSkillsSortResult = activities.map(activity => {
        const skill = dataManager.skills.GetByID(activity.skillID);
        return ({ id: activity.skillID, value: langManager.GetText(skill.Name) })
    }).sort((a, b) => a.value.localeCompare(b.value));
    output.push({ name: 'Map + Skills + Sort', value: mapSkillsSortResult.length, time: performance.now() - timer });

    // Test 4: Map + Skills manager + filter
    timer = performance.now();
    const mapSkillsFilterResult = activities
        .filter(activity => activity.skillID !== 0)
        .map(activity => {
            const skill = dataManager.skills.GetByID(activity.skillID);
            return ({ id: activity.skillID, value: langManager.GetText(skill.Name) })
        });
    output.push({ name: 'Map + Skills + filter', value: mapSkillsFilterResult.length, time: performance.now() - timer });

    // Test 5: For
    timer = performance.now();
    const forResult = [];
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        forResult.push({ id: activity.skillID, value: activity.startTime });
    }
    output.push({ name: 'For', value: forResult.length, time: performance.now() - timer });

    // Test 6: For + Skills manager
    timer = performance.now();
    const forSkillsResult = [];
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        const skill = dataManager.skills.GetByID(activity.skillID);
        forSkillsResult.push({ id: activity.skillID, value: langManager.GetText(skill.Name) });
    }
    output.push({ name: 'For + Skills', value: forSkillsResult.length, time: performance.now() - timer });

    // Test 7: For + Skills manager + Sort
    timer = performance.now();
    const forSkillsSortResult = [];
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        const skill = dataManager.skills.GetByID(activity.skillID);
        forSkillsSortResult.push({ id: activity.skillID, value: langManager.GetText(skill.Name) });
    }
    forSkillsSortResult.sort((a, b) => a.value.localeCompare(b.value));
    output.push({ name: 'For + Skills + Sort', value: forSkillsSortResult.length, time: performance.now() - timer });

    // Test 8: For + Skills manager + filter
    timer = performance.now();
    const forSkillsFilterResult = [];
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        if (activity.skillID === 0) continue;
        const skill = dataManager.skills.GetByID(activity.skillID);
        forSkillsFilterResult.push({ id: activity.skillID, value: langManager.GetText(skill.Name) });
    }
    output.push({ name: 'For + Skills + filter', value: forSkillsFilterResult.length, time: performance.now() - timer });

    // Test 9: For + Skills manager + filter + reduce
    timer = performance.now();
    const forSkillsFilterReduceResult = [];
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        if (activity.skillID === 0) continue;
        const skill = dataManager.skills.GetByID(activity.skillID);
        forSkillsFilterReduceResult.push({ id: activity.skillID, value: langManager.GetText(skill.Name) });
    }
    forSkillsFilterReduceResult.reduce((acc, val) => acc + val.value, '');
    output.push({ name: 'For + Skills + filter + reduce', value: forSkillsFilterReduceResult.length, time: performance.now() - timer });

    // Test 10: find
    timer = performance.now();
    const findResult = activities.find(activity => activity.skillID === 1);
    output.push({ name: 'Find', value: findResult ? 1 : 0, time: performance.now() - timer });

    // Test 11: findIndex
    timer = performance.now();
    const findIndexResult = activities.findIndex(activity => activity.skillID === 1);
    output.push({ name: 'FindIndex', value: findIndexResult, time: performance.now() - timer });

    // Test 12: filter
    timer = performance.now();
    const filterResult = activities.filter(activity => activity.skillID === 1);
    output.push({ name: 'Filter', value: filterResult.length, time: performance.now() - timer });

    // Test 13: reduce
    timer = performance.now();
    const reduceResult = activities.reduce((acc, val) => acc + val.skillID, 0);
    output.push({ name: 'Reduce', value: reduceResult, time: performance.now() - timer });

    // Test 14: reduceRight
    timer = performance.now();
    const reduceRightResult = activities.reduceRight((acc, val) => acc + val.skillID, 0);
    output.push({ name: 'ReduceRight', value: reduceRightResult, time: performance.now() - timer });

    // Test 15: some
    timer = performance.now();
    const someResult = activities.some(activity => activity.skillID === 1);
    output.push({ name: 'Some', value: someResult ? 1 : 0, time: performance.now() - timer });

    // Test 16: every
    timer = performance.now();
    const everyResult = activities.every(activity => activity.skillID === 1);
    output.push({ name: 'Every', value: everyResult ? 1 : 0, time: performance.now() - timer });

    // Test 17: sort
    timer = performance.now();
    const sortResult = activities.sort((a, b) => a.skillID - b.skillID);
    output.push({ name: 'Sort', value: sortResult.length, time: performance.now() - timer });

    // Test 18: reverse
    timer = performance.now();
    const reverseResult = activities.reverse();
    output.push({ name: 'Reverse', value: reverseResult.length, time: performance.now() - timer });

    // Test 19: concat
    timer = performance.now();
    const concatResult = activities.concat(activities);
    output.push({ name: 'Concat', value: concatResult.length, time: performance.now() - timer });

    // Test 20: slice
    timer = performance.now();
    const sliceResult = activities.slice(0, 10);
    output.push({ name: 'Slice', value: sliceResult.length, time: performance.now() - timer });

    // Test 21: splice
    timer = performance.now();
    const spliceResult = activities.splice(0, 10);
    output.push({ name: 'Splice', value: spliceResult.length, time: performance.now() - timer });

    return output;
}

export default Bench;
