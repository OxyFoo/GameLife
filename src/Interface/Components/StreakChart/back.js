import * as React from 'react';

import langManager from 'Managers/LangManager';

import { Svg, Path, Text, Defs, LinearGradient, Stop } from 'react-native-svg';


/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const StreakChartProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    currentStreak: 0,

    /** @type {number} */
    bestStreak: 0,

    /** @type {number} */
    size: 200,

    /** @type {number} */
    strokeWidth: 30,
}

class StreakChartBack extends React.Component {

    state = {
        dottedLine: null,
        backgroundProgressBar: null,
        progressBar: null,
        filledSemiCircle: null,
        renderTexts: null,
        rotation: 0,
        strokeDasharray: null,
    }

    componentDidMount() {
        this.compute();
    }



    // Je l'ai commenté parce que ça fonctionne MAIS ça rajoute un délai de 1 valeur 
    // quand tu cliques sur le bouton.
    // ce décalage n'est pas normal mais je comprend pas pourquoi il arrive.
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentStreak !== this.props.currentStreak ||
            nextProps.bestStreak !== this.props.bestStreak ||
            nextState.rotation !== this.state.rotation;
    }



    componentDidUpdate(prevProps, prevState) {
        this.compute();
    }


    compute() {
        // So we don't have 120% or something like that 
        let bestStreak = this.props.bestStreak;
        if (this.props.currentStreak >= bestStreak) {
            bestStreak = this.props.currentStreak + 5;
        }

        // Compute the progress bar 
        const radius = (this.props.size - this.props.strokeWidth) / 2;
        const circumference = Math.PI * radius;
        const filling = (this.props.currentStreak / bestStreak) * circumference;
        const strokeDasharray = `${filling} ${circumference}`;
        const rotation = 270;

        // Compute the center item with text and background
        const strokeWidthText = 30
        const cornerRadius = 15;

        const textX = this.props.size / 2;
        const textY = this.props.size / 2 + this.props.strokeWidth / 12; // TODO : CHANGE THE METHOD OF CALCULATION BECAUSE / 12 CA SORT DE MON CUL

        // Compute the line path
        const progressRatio = this.props.currentStreak / bestStreak;
        const progressAngle = progressRatio * 180 - 180; // Semi-circle so we use 180 degrees
        const angleRadians = (progressAngle * Math.PI) / 180;

        const endX = this.props.size / 2 + radius * Math.cos(angleRadians);
        const endY = this.props.size / 2 + radius * Math.sin(angleRadians);

        // Compute the texts to display
        const dottedLine = `M ${textX},${textY} L ${endX},${endY}`

        const backgroundProgressBar = `M ${this.props.size / 2},${this.props.size / 2 - radius} 
        a ${radius},${radius} 0 0,1 0,${2 * radius}`

        const progressBar = `M ${this.props.size / 2},${this.props.size / 2 - radius} 
        a ${radius},${radius} 0 0,1 0,${2 * radius}`

        const filledSemiCircle = `
                        M ${textX - strokeWidthText},${textY}
                        a ${strokeWidthText},${strokeWidthText} 0 0,1 ${strokeWidthText * 2},0
                        a ${cornerRadius},${cornerRadius} 0 0,1 ${-cornerRadius},${cornerRadius}
                        h ${-((strokeWidthText * 2) - (cornerRadius * 2))}
                        a ${cornerRadius},${cornerRadius} 0 0,1 ${-cornerRadius},${-cornerRadius}
                        Z`

        this.setState({
            dottedLine,
            backgroundProgressBar,
            progressBar,
            filledSemiCircle,
            rotation,
            strokeDasharray
        })


    }

}

StreakChartBack.prototype.props = StreakChartProps;
StreakChartBack.defaultProps = StreakChartProps;

export default StreakChartBack;