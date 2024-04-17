import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Text as TextSVG, Defs, LinearGradient, Stop } from 'react-native-svg';

import StreakChartBack from './back';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';

class StreakChart extends StreakChartBack {
    render() {
        const lang = langManager.curr['quests'];
        const title = lang['current-streak'];

        const textX = this.props.size / 2;
        const textY = this.props.size / 2 + this.props.strokeWidth / 12; // TODO : CHANGE THE METHOD OF CALCULATION BECAUSE /

        const leftTextX = 10;
        const centerTextX = this.props.size / 2;
        const rightTextX = this.props.size;
        const bottomTextY = this.props.size / 2 + this.props.strokeWidth + 5;

        return (
            <View style={this.props.style}>
                <Text style={styles.text} fontSize={18} bold>{title}</Text>

                <Svg width={this.props.size} height={this.props.height}>
                    <Defs>
                        <LinearGradient id='progressGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                            <Stop offset='0%' stopColor='#21CF46' stopOpacity='1' />
                            <Stop offset='100%' stopColor='#67FF7D' stopOpacity='1' />
                        </LinearGradient>
                    </Defs>

                    {/* Dotted line linking central KPI and progress bar  */}
                    {this.state.dottedLine &&
                        <Path
                            d={this.state.dottedLine}
                            fill='none'
                            stroke='#67FF7D'
                            strokeWidth={2}
                            strokeDasharray='5, 5' // This creates a pattern of 5px dash and 5px gap
                            strokeLinecap='round'
                        />}

                    {/* Background progress bar */}
                    {this.state.backgroundProgressBar &&
                        <Path
                            d={this.state.backgroundProgressBar}
                            fill='none'
                            stroke='#9095FF3D'
                            strokeWidth={this.props.strokeWidth}
                            strokeLinecap='round'
                            transform={`rotate(270 ${this.props.size / 2} ${this.props.size / 2})`}
                        />}

                    {/* Progress bar */}
                    {this.state.progressBar &&
                        <Path
                            d={this.state.progressBar}
                            fill='none'
                            stroke='url(#progressGradient)'
                            strokeWidth={this.props.strokeWidth}
                            strokeDasharray={this.state.strokeDasharray}
                            strokeLinecap='round'
                            transform={`rotate(270 ${this.props.size / 2} ${this.props.size / 2})`}
                        />
                    }

                    {/* Filled semi-circle for the current streak number background */}
                    {this.state.filledSemiCircle &&
                        <Path
                            d={this.state.filledSemiCircle}
                            fill='url(#progressGradient)'
                        />
                    }


                    {/* Text element for current streak number */}
                    <TextSVG
                        x={textX}
                        y={textY}
                        textAnchor='middle'
                        fontSize={this.props.strokeWidth / 2}
                        fontWeight='bold'
                        fill='#fff'
                    >
                        {this.props.currentStreak}
                    </TextSVG>

                    {/* Text for '0' */}
                    <TextSVG
                        x={leftTextX}
                        y={bottomTextY}
                        textAnchor='start'
                        fill='white'
                        fontSize='16'
                        fontWeight='bold'
                    >
                        0
                    </TextSVG>

                    {/* Text for 'current streak' */}
                    <TextSVG
                        x={centerTextX}
                        y={bottomTextY}
                        textAnchor='middle'
                        fill='white'
                        fontSize='14'
                    >
                        {langManager.curr['quests']['currSteak']}
                    </TextSVG>

                    {/* Text for '208' */}
                    <TextSVG
                        x={rightTextX}
                        y={bottomTextY}
                        textAnchor='end'
                        fill='white'
                        fontSize='16'
                        fontWeight='bold'
                    >
                        {this.props.bestStreak}
                    </TextSVG>
                </Svg>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 16
    }
});

export default StreakChart;
