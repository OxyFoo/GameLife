import React from 'react';
import { View, Text as RNText } from 'react-native';
import { Svg, Path, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

import StreakChartBack from './back';
import themeManager from 'Managers/ThemeManager';

class StreakChart extends StreakChartBack {

    render() {

        return (
            <View>
                <RNText style={{color:"white"}}>{this.state.dottedLine}</RNText>
                <Svg height={this.props.size} width={this.props.size}>
                    <Defs>
                        <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#21CF46" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#67FF7D" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    {/* Dotted line linking central KPI and progress bar  */}
                    {this.state.dottedLine &&
                        <Path
                            d={this.state.dottedLine}
                            fill="none"
                            stroke="#67FF7D"
                            strokeWidth={2}
                            strokeDasharray="5, 5" // This creates a pattern of 5px dash and 5px gap
                            strokeLinecap="round"
                        />}

                    {/* Background progress bar */}
                    {this.state.backgroundProgressBar &&
                        <Path
                            d={this.state.backgroundProgressBar}
                            fill="none"
                            stroke="#9095FF3D"
                            strokeWidth={this.props.strokeWidth}
                            strokeLinecap="round"
                            transform={`rotate(${this.state.rotation} ${this.props.size / 2} ${this.props.size / 2})`}
                        />}

                    {/* Progress bar */}
                    {this.state.progressBar &&
                        <Path
                            d={this.state.progressBar}
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth={this.props.strokeWidth}
                            strokeDasharray={this.state.strokeDasharray}
                            strokeLinecap="round"
                            transform={`rotate(${this.state.rotation} ${this.props.size / 2} ${this.props.size / 2})`}
                        />
                    }

                    {/* Filled semi-circle for the current streak number background */}
                    {this.state.filledSemiCircle &&
                        <Path
                            d={this.state.filledSemiCircle}
                            fill="url(#progressGradient)"
                        />
                    }

                    {/* All texts elements */}
                    {this.state.renderTexts ?? this.state.renderTexts}

                </Svg>
            </View>

        )
    }

}

export default StreakChart;