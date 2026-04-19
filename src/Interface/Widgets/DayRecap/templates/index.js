import React from 'react';

import TripleStack from './TripleStack';
import DualStack from './DualStack';
import ChartRow from './ChartRow';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('../back').QuestProgress} QuestProgress
 * @typedef {import('../back').ActivityData} ActivityData
 * @typedef {import('../back').DonutSegment} DonutSegment
 *
 * @typedef {object} TemplateProps
 * @property {DonutSegment[]} donutData - Donut chart segments
 * @property {string} totalTimeFormatted - Formatted total time string
 * @property {ActivityData[]} skills - Skills sorted by duration
 * @property {(minutes: number) => string} formatDuration - Duration formatter
 * @property {Array<keyof StatsXP>} statsKeys - Non-zero stat keys
 * @property {Record<keyof StatsXP, number>} statsGained - Stats gained values
 * @property {Array<{label: string, value: number}>} radarData - Radar chart data (normalized 0-1)
 * @property {QuestProgress} questProgress - Quest completion data
 * @property {string} activitiesTitle - Translated title for activities section
 * @property {string} questsTitle - Translated title for quests section
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
