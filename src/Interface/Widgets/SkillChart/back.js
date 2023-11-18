import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

/** 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * 
 * @typedef {{ date: string, value: number }} LineData
 */

const SkillChartProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    chartWidth: 300,

    /** @type {number} */
    skillID: 0
}

class SkillChartBack extends React.Component {
    state = {
        /** @type {LineData[]} */
        cleanedData: [],

        /** @type {ColorTheme|ColorThemeText} */
        lineColor: 'black'
    }

    componentDidMount() {
        const lineColor = this.getLineColor(this.props.skillID);
        const linesData = this.getDataFromSkillID(this.props.skillID);
        const cleaningData = (this.fillMissingDates(linesData));

        this.setState({
            cleanedData: cleaningData,
            lineColor: lineColor
        });
    }

    /** 
     * Get all the data from the skillID
     * @param {number} skillID
     * @returns {LineData[]}
    */
    getDataFromSkillID(skillID) {
        const dataFromBack = [];

        // get the datas here 
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === skillID)

        // go through the history and create one {activity: string, date: string, value: number} 
        for (const element of history) {
            const date = DateToFormatString(GetDate(element.startTime));
            const index = dataFromBack.findIndex(item => item.date === date);
            if (index !== -1) {
                dataFromBack[index].value += element.duration;
                continue;
            }
            dataFromBack.push({
                date: date,
                value: element.duration
            });
        }

        return dataFromBack;
    }

    /**
     * return the same array of map with filled dates and 0 values
     * @param {LineData[]} data 
     * @returns 
     */
    fillMissingDates = (data) => {
        const parseDate = dateString => {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        };

        const formatDate = date => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // check if there is at least one data point
        if (data.length === 0) {
            return [];
        }

        const allDates = new Set();
        let earliestDate = null;
        let latestDate = null;

        // Gather all unique dates and find earliest/latest dates
        data.forEach(dataPoint => {
            const currentDate = parseDate(dataPoint.date);
            allDates.add(dataPoint.date);
            if (!earliestDate || currentDate < earliestDate) {
                earliestDate = currentDate;
            }
            if (!latestDate || currentDate > latestDate) {
                latestDate = currentDate;
            }
        });

        // Check if there are at least two dates (otherwise there is nothing to fill in)
        if (allDates.size <= 1 || !earliestDate || !latestDate) {
            return data;
        }

        // Calculate the range of dates
        const dateRange = Array.from({ length: (latestDate - earliestDate) / (1000 * 60 * 60 * 24) + 1 }, (_, i) => {
            const date = new Date(earliestDate);
            date.setDate(date.getDate() + i);
            return formatDate(date);
        });

        // Fill in missing dates
        const result = dateRange.map(date => {
            const existingDataPoint = data.find(dataPoint => dataPoint.date === date);
            if (existingDataPoint) {
                return existingDataPoint;
            }
            // Assume 'activity' is the same for all data points as it is not specified how to handle multiple activities
            return { /*activity: data[0].activity,*/ date, value: 0 };
        });

        return result;
    };

    /**
     * Returns the color of the category of the skill 
     * @param {number} skillID
     * @returns {string}
     */
    getLineColor = (skillID) => {
        const skill = dataManager.skills.GetByID(skillID);
        const categoryID = skill.CategoryID;
        const category = dataManager.skills.GetCategoryByID(categoryID);
        if (category === null) {
            return 'black';
        }
        return category.Color;
    }
}

SkillChartBack.prototype.props = SkillChartProps;
SkillChartBack.defaultProps = SkillChartProps;

export default SkillChartBack;