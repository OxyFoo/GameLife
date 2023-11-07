import * as React from 'react';

import user from 'Managers/UserManager';
import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import dataManager from 'Managers/DataManager';

/**
 * @typedef {{activity:string, date:string, value:number}} DataPoint
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    chartWidth: 300,

    /** @type {number} */
    skillID: 0,
}

class BarChartBack extends React.Component {
    state = {
        cleanedData: [],
    }

    dataReady = false;
    linesData = {};
    maxVal = 0;
    chartSpace = 0;
    barWidth = 0;


    getDataFromSkillID(skillID) {

        const dataFromBack = [];

        // get the datas here 
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === skillID)
        const skillName = dataManager.GetText(dataManager.skills.GetByID(skillID).Name)

        // go through the history and create one {activity: string, date: string, value: number} 
        for (const element of history) {
            const date = DateToFormatString(GetDate(element.startTime));
            const index = dataFromBack.findIndex(item => item.date === date);
            if (index !== -1) {
                dataFromBack[index].value += element.duration;
            }
            else {
                dataFromBack.push({
                    activity: skillName,
                    date: date,
                    value: element.duration
                })
            }
        }

        return dataFromBack;
    }


    componentDidMount() {

        this.linesData = {};
        this.dataReady = false;
        this.maxVal = 0;
        this.chartSpace = 0;
        this.barWidth = 0; 

        // get the datas from the skillID
        this.linesData.lineData = this.getDataFromSkillID(this.props.skillID);

        // compute the datas to not have missing dates anymore 
        let cleaningData = (this.fillMissingDates(this.linesData));

        // Getting the length of first array (because all array have the same length thanks to clean data)
        let numberOfDataPoints = cleaningData.lineData.length;

        // compute the bar width 
        this.barWidth = this.props.chartWidth / numberOfDataPoints;

        // set state to render the chart 
        this.setState({
            cleanedData: cleaningData.lineData,
        });
        this.dataReady = true;
    }


    /**
     * return the same array of map with filled dates and 0 values
     * 
     * @param {{DataPoint}[]} data 
     * @returns 
     */
    fillMissingDates(data) {
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

        const allDates = new Set();
        const result = {};

        // Gather all unique dates and find earliest/latest dates
        let earliestDate = null;
        let latestDate = null;

        Object.values(data).forEach(dataSet => {
            dataSet.forEach(dataPoint => {
                const currentDate = parseDate(dataPoint.date);
                allDates.add(dataPoint.date);
                if (!earliestDate || currentDate < earliestDate) {
                    earliestDate = currentDate;
                }
                if (!latestDate || currentDate > latestDate) {
                    latestDate = currentDate;
                }
            });
        });

        // Fill in missing dates for each dataset
        Object.keys(data).forEach(key => {
            const activity = data[key][0].activity;
            const dateRange = Array.from({ length: (latestDate - earliestDate) / (1000 * 60 * 60 * 24) + 1 }, (_, i) => {
                const date = new Date(earliestDate);
                date.setDate(date.getDate() + i);
                return formatDate(date);
            });

            result[key] = dateRange.map(date => {
                const existingDataPoint = data[key].find(dataPoint => dataPoint.date === date);
                if (existingDataPoint) {
                    return existingDataPoint;
                }
                return { activity, date, value: 0 };
            });
        });
        return result;
    }

}

BarChartBack.prototype.props = InputProps;
BarChartBack.defaultProps = InputProps;

export default BarChartBack;