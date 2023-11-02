import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

// POUR GET LES DATA : https://discord.com/channels/902921436191154286/902921436191154289/1169306909602496532
// "J'ai une fonction qui permet de récupérer les actis d'un jour précis, et une autre pour les filtrer (par cque tu veux)
// Et récup les temps c'est une simple addition"
/* Mais du coup tu peux faire des var de test du style
monActi = {
    ID: 1,
    SkillID: 1,
    duration: 60, // En minutes
    ...
}
*/

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

const renderDot = (color) => {
    return (
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
};

const renderLegendItem = (item, index) => (
    <View
        key={index}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
        }}>
        {renderDot(item.color)}
        <Text style={{ color: 'white' }}>{item.name}: {item.value}%</Text>
    </View>
);

const renderLegendComponent = (data) => {
    const elem_per_row = 2;
    return (
        <>
            {Array.from({ length: Math.ceil(data.length / elem_per_row) }).map((_, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: "10%" }}>
                    {data.slice(rowIndex * elem_per_row, rowIndex * elem_per_row + elem_per_row).map((item, index) => renderLegendItem(item, rowIndex * elem_per_row + index))}
                </View>
            ))}
        </>
    );
};

const minToPercentOfDay = (min) => {
    return Math.round((min / 1440) * 100);
};

const PieChartHome = (data) => {

    const [dataRendered, setDataRendered] = useState(data);
    const [biggestActivity, setBiggestActivity] = useState({ id: 0, value: 0, name: "" });
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        const updatedData = { ...data };

        // Convert min to percent of day and compute total percent
        let totalPercent = 0;
        updatedData.data.forEach(item => {
            if (item.id > 0 && item.id < 6 && item.valueMin) {
                item.value = minToPercentOfDay(item.valueMin);
                totalPercent += item.value;
            }
        });

        // Handle case where totalPercent is not 100
        if (totalPercent < 100) {
            const index = updatedData.data.findIndex(item => item.id === 6);
            if (index !== -1) {
                updatedData.data[index].value = 100 - totalPercent;
            }
            else {
                updatedData.data.push({
                    valueMin: 0,
                    color: '#B0B0B0',
                    name: "Non défini",
                    id: 6,
                    value: 100 - totalPercent,
                });
            };
        }

        // Les gradient shadows chelou qui marchent pas de ouf sont calculés ici 
        updatedData.data.forEach(item => {
            item.value = !isNaN(item.value) && typeof item.value === 'number' ? item.value : 0;
            item.gradientCenterColor = shadeColor(item.color, -20);
        });

        // determine the biggest activity name and value 
        let maxActi = { id: 0, value: 0, name: "" };
        updatedData.data.forEach(item => {
            if (item.value > maxActi.value) {
                maxActi.id = item.id;
                maxActi.value = item.value;
                maxActi.name = item.name;
            }
        });

        setBiggestActivity(maxActi);
        setDataRendered(updatedData);

    }, []); // Empty dependency array ensures this effect runs once after initial render

    useEffect(() => {

        const updatedData = { ...dataRendered };

        // set the biggest activity as focused
        updatedData.data.forEach(item => item.focused = item.id === biggestActivity.id)
        setDataRendered(updatedData);

        // check if we find a focused:true in an item 
        const focused = updatedData.data.find(item => item.focused === true);
        if (focused) {
            setDataReady(true);
        }
        else {
            setDataReady(false);
        }

    }, [biggestActivity]);


    return (
        <View
            style={{
                padding: 16,
                borderRadius: 20,
                backgroundColor: '#9196fb',
            }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                Performance of the day
            </Text>
            <View style={{ padding: 20, alignItems: 'center' }}>
                {dataReady ?
                    <PieChart
                        data={dataRendered.data}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text
                                        style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                                        {biggestActivity.value}%
                                    </Text>
                                    <Text style={{ fontSize: 14, color: 'white' }}>{biggestActivity.name}</Text>
                                </View>
                            );
                        }}
                    />
                    :
                    <></>
                }
            </View>
            {renderLegendComponent(dataRendered.data)}
        </View>
    );
}

export default PieChartHome;