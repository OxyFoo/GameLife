import DualStack from './DualStack';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
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
 * @property {string} activitiesTitle - Translated title for activities section
 */

export default DualStack;
