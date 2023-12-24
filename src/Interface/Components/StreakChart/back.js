import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const StreakChartProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    currentStreak: 0,

    /** @type {number} */
    bestStreak: 0,

    /** @type {number} */
    overValue: 0,

    /** @type {number} */
    size: 200,

    /** @type {number} */
    strokeWidth: 30
}

class StreakChartBack extends React.Component {
    state = {
        dottedLine: null,
        backgroundProgressBar: null,
        progressBar: null,
        filledSemiCircle: null,
        renderTexts: null,
        strokeDasharray: null,
    }

    /** @param {StreakChartProps} props */
    constructor(props) {
        super(props);

        const newState = this.compute(false);
        this.state = {
            ...this.state,
            ...newState,
        };
    }

    /** @param {StreakChartProps} nextProps */
    shouldComponentUpdate(nextProps) {
        if (nextProps.currentStreak !== this.props.currentStreak ||
            nextProps.bestStreak !== this.props.bestStreak) {
            return true;
        }

        return false;
    }

    componentDidUpdate() {
        this.compute();
    }

    compute(update = true) {
        // So we don't have 120% or something like that 
        let bestStreak = this.props.bestStreak;
        if (this.props.currentStreak >= bestStreak) {
            bestStreak = this.props.currentStreak + this.props.overValue;
        }

        // Compute the progress bar 
        const radius = (this.props.size - this.props.strokeWidth) / 2;
        const circumference = Math.PI * radius;
        const filling = (this.props.currentStreak / bestStreak) * circumference;
        const strokeDasharray = `${filling} ${circumference}`;

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
        const dottedLine = `M ${textX},${textY} L ${endX},${endY}`;

        const backgroundProgressBar = `
            M ${this.props.size / 2},${this.props.size / 2 - radius} 
            a ${radius},${radius} 0 0,1 0,${2 * radius}
        `;

        const progressBar = `
            M ${this.props.size / 2},${this.props.size / 2 - radius} 
            a ${radius},${radius} 0 0,1 0,${2 * radius}
        `;

        const filledSemiCircle = `
            M ${textX - strokeWidthText},${textY}
            a ${strokeWidthText},${strokeWidthText} 0 0,1 ${strokeWidthText * 2},0
            a ${cornerRadius},${cornerRadius} 0 0,1 ${-cornerRadius},${cornerRadius}
            h ${-((strokeWidthText * 2) - (cornerRadius * 2))}
            a ${cornerRadius},${cornerRadius} 0 0,1 ${-cornerRadius},${-cornerRadius}
            Z
        `;

        if (update) {
            this.setState({
                dottedLine,
                backgroundProgressBar,
                progressBar,
                filledSemiCircle,
                strokeDasharray
            });
        }

        return {
            dottedLine,
            backgroundProgressBar,
            progressBar,
            filledSemiCircle,
            strokeDasharray
        };
    }
}

StreakChartBack.prototype.props = StreakChartProps;
StreakChartBack.defaultProps = StreakChartProps;

export default StreakChartBack;
