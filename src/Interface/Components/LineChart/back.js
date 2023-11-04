import * as React from 'react';

import user from 'Managers/UserManager';
import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import dataManager from 'Managers/DataManager';
import { Item } from 'Data/Items';

/* TODOOOOOOOOO

- use the good skillID
- Seeing if we compare those datas with datas from an other activity
- Set the color depending on the category of the activity  
- UI BELLE + PADDING LAAAA

*/


const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    chartWidth: 300,

    /** @type {number} */
    skillID: 0,
}

class LineChartBack extends React.Component {
    state = {
        cleanedData: [],
    }

    dataReady = false;
    linesData = {};
    maxVal = 0;
    chartSpace = 0;
    barWidth = 0;

    linesData2 = {
        lineData: [
            { activity: "Running", date: "01/01/2023", value: 0 },
            { activity: "Running", date: "05/01/2023", value: 5 },
            { activity: "Running", date: "06/01/2023", value: 10 },
            // ... (additional data points)
            { activity: "Running", date: "28/01/2023", value: 135 },
            { activity: "Running", date: "29/01/2023", value: 140 },
            { activity: "Running", date: "30/01/2023", value: 145 }
        ],
        lineData2: [
            { activity: "Cycling", date: "01/01/2023", value: 0 },
            { activity: "Cycling", date: "02/01/2023", value: 7 },
            { activity: "Cycling", date: "03/01/2023", value: 14 },
            // ... (additional data points)
            { activity: "Cycling", date: "28/01/2023", value: 196 },
            { activity: "Cycling", date: "29/01/2023", value: 203 },
            { activity: "Cycling", date: "30/01/2023", value: 210 }
        ]
    };


    getDataFromSkillID(skillID) {

        const dataFromBack = [];

        // get the datas here 
        const userActivities = user.activities.Get();
        const history = userActivities.filter((a) => a.skillID === skillID)
        const skillName = dataManager.GetText(dataManager.skills.GetByID(skillID).Name)

        // go through the history and create one {activity: string, date: string, value: number} 
        for (let i = 0; i < history.length; i++) {
            const date = DateToFormatString(GetDate(history[i].startTime));
            const index = dataFromBack.findIndex(item => item.date === date);
            if (index !== -1) {
                dataFromBack[index].value += history[i].duration;
            }
            else {
                dataFromBack.push({
                    activity: skillName,
                    date: date,
                    value: history[i].duration
                })
            }
        }

        return dataFromBack;
    }


    componentDidMount() {

        console.log("MOUUUUUNT")
        this.linesData = {};
        this.dataReady = false;
        this.maxVal = 0;
        this.chartSpace = 0;
        this.barWidth = 0; 

        // get the datas from the skillID
        this.linesData.lineData = this.getDataFromSkillID(this.props.skillID);

        // compute the datas to not have missing dates anymore 
        let cleaningData = (this.fillMissingDates(this.linesData));
        
        console.log("CLEANING DATA", cleaningData)

        if (cleaningData.lineData.length > 2) {
            cleaningData.lineData = [
                cleaningData.lineData[0],
                ...cleaningData.lineData.slice(1, -1).map(item => ({ ...item, date: '' })),
                cleaningData.lineData[cleaningData.lineData.length - 1]
            ];
        }

        console.log("CLEANING DATA", cleaningData);

        // Getting the length of first array (because all array have the same length thanks to clean data)
        let numberOfDataPoints = cleaningData.lineData.length;

        /* // OLD STUFF FOR THE LINE CHART
        // compute the max value of the chart
        this.maxVal = Math.max(
            ...Object.values(cleaningData).map(dataSet => Math.max(...dataSet.map(dataPoint => dataPoint.value)))
        );

        // compute the space between each point of the chart
        //if (numberOfDataPoints > 1) this.chartSpace = this.props.chartWidth / (numberOfDataPoints - 1);
        */

        // compute the bar width 
        this.barWidth = this.props.chartWidth / numberOfDataPoints;

        // set state to render the chart (only if more than 1 data point)
        this.setState({
            cleanedData: cleaningData.lineData,
        });
        this.dataReady = true;

    }

    componentDidUpdate() {
        console.log("DID UPDATE")
    }

    /**
     * return the same array of map with filled dates and 0 values
     * 
     * @param {{activity:string, date:string, value:number}[]} data 
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

LineChartBack.prototype.props = InputProps;
LineChartBack.defaultProps = InputProps;

export default LineChartBack;