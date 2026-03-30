import React from 'react';

import TripleStack from './TripleStack';
import DualStack from './DualStack';
import ChartRow from './ChartRow';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('../back').QuestProgress} QuestProgress
 * @typedef {import('../sections/ActivitiesSection').SkillData} SkillData
 *
 * @typedef {object} TemplateProps
 * @property {Array<{label: string, value: number, stroke: string}>} donutData
 * @property {string} totalTimeFormatted
 * @property {SkillData[]} skills
 * @property {(minutes: number) => string} formatDuration
 * @property {Array<keyof StatsXP>} statsKeys
 * @property {Record<keyof StatsXP, number>} statsGained
 * @property {Array<{label: string, value: number}>} radarData
 * @property {QuestProgress} questProgress
 * @property {Record<string, string>} langStats
 * @property {Record<string, string>} langRecap
 */

/** @type {Record<string, React.ComponentType<TemplateProps>>} */
const TEMPLATES = {
    tripleStack: TripleStack,
    dualStack: DualStack,
    chartRow: ChartRow
};

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

/**
 * Template router - picks the right template by name
 * @param {TemplateProps & { template: string }} props
 */
const TemplateRouter = ({ template, ...props }) => {
    const Template = TEMPLATES[template] || TripleStack;
    return <Template {...props} />;
};

export default TemplateRouter;
export { TEMPLATE_NAMES };
