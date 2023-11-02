import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts"

function fillMissingDates(data) {
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
      const dateRange = Array.from({length: (latestDate - earliestDate) / (1000 * 60 * 60 * 24) + 1}, (_, i) => {
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

  

const LineChartSkill = (linesData) => {

    const [maxVal, setMaxVal] = useState(0);
    const [dataCleaned, setDataCleaned] = useState([]);
    const [dataReady, setDataReady] = useState(false);
    const chartWidth = 300;
    const [chartSpace, setChartSpace] = useState(0);

    useEffect(() => {
        let cleanedData = (fillMissingDates(linesData.data));
        setDataCleaned(cleanedData);

        setMaxVal(Math.max(
            ...Object.values(linesData.data).reduce((acc, dataSet) => {
                return acc.concat(dataSet.map(dataPoint => dataPoint.value));
            }, [])
        ));

        const numberOfDataPoints = cleanedData.lineData.length; // Assuming lineData and lineData2 have the same length
        const calculatedSpacing = chartWidth / (numberOfDataPoints - 1);
        setChartSpace(calculatedSpacing);

        setDataReady(true);
    }, []);



    return (
        <View
            style={{
                paddingVertical: 0,
                backgroundColor: '#03052E',
                flex: 1,
            }}>
            <View
                style={{
                    margin: 20,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#666666',
                }}>
                {dataReady ?
                    <LineChart
                        areaChart
                        data={dataCleaned.lineData}
                        data2={dataCleaned.lineData2}
                        height={250}
                        width={chartWidth}
                        maxValue={maxVal * 1.3}
                        spacing={chartSpace}
                        initialSpacing={0}
                        color1="skyblue"
                        color2="orange"
                        textColor1="green"
                        hideDataPoints
                        dataPointsColor1="blue"
                        dataPointsColor2="red"
                        startFillColor1="skyblue"
                        startFillColor2="orange"
                        startOpacity={0.8}
                        endOpacity={0.3}
                        pointerConfig={{
                            pointerStripHeight: 230,
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: 'lightgray',
                            radius: 6,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: items => {
                                return (
                                    <View
                                        style={{
                                            height: 90,
                                            width: 200,
                                            justifyContent: 'center',
                                            marginTop: -34,
                                            marginLeft: -40,
                                        }}>
                                        <Text style={{ color: 'white', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                                            {items[0].date}
                                        </Text>
                        
                                        <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                {items[0].value +" min of "+ items[0].activity}
                                            </Text>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                {items[1].value +" min of "+ items[1].activity}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />
                    : <></>
                }
            </View>
        </View>
    );
};

export default LineChartSkill 