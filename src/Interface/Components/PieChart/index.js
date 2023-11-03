import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import { PieChart } from "react-native-gifted-charts";

import user from 'Managers/UserManager';
import { GetTime } from 'Utils/Time';
import dataManager from 'Managers/DataManager';

import styles from './style';


// Je vais peut etre bouger ces functions autre part ? 
// mais la plupart servent seulement pour ce composant la 
// Marche pas trop mais y'a de l'idée 
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.round(R * (1 + percent / 100));
    G = Math.round(G * (1 + percent / 100));
    B = Math.round(B * (1 + percent / 100));

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = (R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16);
    const GG = (G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16);
    const BB = (B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16);

    return `#${RR}${GG}${BB}`;
}

/**
 * Renders a colored dot used for legends or markers.
 *
 * @param {string} color - The color of the dot.
 * @returns {JSX.Element} A View component styled as a colored dot.
 */
const renderDot = (color) => (
    <View
        style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: color,
            marginRight: 10,
        }}
    />
);

/**
 * Renders a legend item. (color dot + text)
 * 
 * @param {{ color: string, name: string, value: number }} item - The item object with color, name, and value properties.
 * @param {number} index 
 * @returns {JSX.Element} A View component styled as a legend item.
 */
const renderLegendItem = (item, index) => (
    <View key={index} style={styles.legendItem}>
        {renderDot(item.color)}
        <Text style={styles.legendItemText}>{item.name}: {item.value}%</Text>
    </View>
);

/**
 * Renders the legend component. (In our case, three rows of two legend items)
 * 
 * @param {{ color: string, name: string, value: number }[]} data - The data array of items with color, name, and value properties.
 * @param {number} elem_per_row - The number of legend items per row.
 * @returns {JSX.Element} A View component styled as a legend component.
 */
const renderLegendComponent = (data, elem_per_row = 2) => (
    <>
        {Array.from({ length: Math.ceil(data.length / elem_per_row) }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.legendRow}>
                {data.slice(rowIndex * elem_per_row, rowIndex * elem_per_row + elem_per_row).map((item, index) => renderLegendItem(item, rowIndex * elem_per_row + index))}
            </View>
        ))}
    </>
);

/**
 * Renders the pie chart with its legend component.
 * 
 * @param {{ data: { color: string, name: string, value: number }[] }} dataRendered - The object containing a `data` array of items with color, name, and value properties.
 * @param {{ id: number, value: number, name: string }} biggestActivity - The biggest activity object with id, value, and name properties.
 * @returns {JSX.Element} A View component styled as a pie chart with its legend component.
 */
const renderPieChartWithLegend = (dataRendered, biggestActivity) => {
    return (
        <View style={styles.pieChartContainer}>
            <PieChart
                data={dataRendered}
                donut
                showGradient
                sectionAutoFocus
                radius={90}
                innerRadius={60}
                innerCircleColor={'#232B5D'}
                centerLabelComponent={() => (
                    <View style={styles.centerLabel}>
                        <Text
                            style={styles.centerLabelText}>
                            {biggestActivity.value}%
                        </Text>
                        <Text style={styles.centerLabelSubText}>
                            {biggestActivity.name}
                        </Text>
                    </View>
                )}
            />
            {renderLegendComponent(dataRendered)}
        </View>
    );
};

const PieChartHome = () => {

    const [dataRendered, setDataRendered] = useState([]);
    const [biggestActivity, setBiggestActivity] = useState({ id: 0, value: 0, name: "" });
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {

        // List of categories id and colors
        const updatedData = [
            { id: 1, valueMin: 0, color: '#7578D4' },
            { id: 2, valueMin: 0, color: '#FFB37A' },
            { id: 3, valueMin: 0, color: '#2690ff' },
            { id: 4, valueMin: 0, color: '#5bebc5' },
            { id: 5, valueMin: 0, color: '#FFD633' },
        ];

        // Get all the categories names
        for (let i = 0; i < updatedData.length; i++) {
            updatedData[i].name = dataManager.GetText(dataManager.skills.GetCategoryByID(updatedData[i].id).Name)
        };

        // Getting info on acti of today and computing 
        const allActivitiesOfToday = user.activities.GetByTime(GetTime(undefined, 'local'));
        allActivitiesOfToday.forEach(acti => {
            const categoryID = dataManager.skills.GetByID(acti.skillID).CategoryID;
            const index = updatedData.findIndex(item => item.id === categoryID);
            if (index !== -1) {
                updatedData[index].valueMin += acti.duration;
            }
            else {
                console.log("Error in PieChartHome : categoryID not found in updatedData")
                console.log("Details : acti = ", acti, "categoryID = ", categoryID)
            }
        });

        // Convert min to percent of day and compute total percent
        let totalPercent = 0;
        updatedData.forEach(item => {
            if (item.id > 0 && item.id < 6) {
                item.value = Math.round(item.valueMin / 1440 * 100) || 0;
                totalPercent += item.value;
            }
        });

        // Either actualize the value of the "undefined" activity or create it
        if (totalPercent < 100) {
            const index = updatedData.findIndex(item => item.id === 6);
            if (index !== -1) {
                updatedData[index].value = 100 - totalPercent;
            }
            else {
                updatedData.push({
                    valueMin: 0,
                    color: '#B0B0B0',
                    name: "Non défini",
                    id: 6,
                    value: 100 - totalPercent,
                });
            };
        }

        // Les gradient shadows chelou qui marchent pas de ouf sont calculés ici 
        // CA EN VRAI on peut le faire à la main non ?
        updatedData.forEach(item => {
            item.value = !isNaN(item.value) && typeof item.value === 'number' ? item.value : 0;
            item.gradientCenterColor = shadeColor(item.color, -20);
        });

        // determine the biggest activity name and value 
        let maxActi = { id: 0, value: 0, name: "" };
        updatedData.forEach(item => {
            if (item.value > maxActi.value) {
                maxActi.id = item.id;
                maxActi.value = item.value;
                maxActi.name = item.name;
            }
        });

        // set the biggest activity as focused
        updatedData.forEach(item => item.focused = item.id === maxActi.id)

        setBiggestActivity(maxActi);
        setDataRendered(updatedData);

        // check if we find a focused:true in an item 
        const focused = updatedData.find(item => item.focused === true);
        if (focused) {
            setDataReady(true);
        }
        else {
            setDataReady(false);
            console.log("It seems to be an issue with the focus of the pie chart")
        }

        //console.log("Use Effect Called", totalPercent, updatedData)

    }, []); // Empty dependency array ensures this effect runs once after initial render



    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Performance of the day
            </Text>
            {dataReady && dataRendered ? renderPieChartWithLegend(dataRendered, biggestActivity) : <></>}
        </View>
    );
}

export default PieChartHome;

// DONNEES TESTS
/*
const pieData = [
    { id: 1, name: "Bien-être", valueMin: 600, color: '#7578D4' },
    { id: 2, name: "Travail", valueMin: 200, color: '#FFB37A' },
    { id: 3, name: "Créativité", valueMin: 200, color: '#2690ff' },
    { id: 4, name: "Quotidien", valueMin: 200, color: '#5bebc5' },
    { id: 5, name: "Social", valueMin: 200, color: '#FFD633' },
  ];
  */