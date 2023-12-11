import * as React from 'react';

import langManager from 'Managers/LangManager';

import { Svg, Path, Text, Defs, LinearGradient, Stop } from 'react-native-svg';


/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
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
        console.log("componentDidMount")
        this.compute();
    }


    shouldComponentUpdate(nextProps, nextState) {
        console.log("shouldComponentUpdate")
        console.log("nextProps : ", this.props.bestStreak, nextProps.bestStreak)
        console.log("nextState : ", this.state.rotation, nextState.rotation)
        // Only re-render if currentStreak has changed
        return nextProps.currentStreak !== this.props.currentStreak ||
            nextProps.bestStreak !== this.props.bestStreak ||
            nextState.rotation !== this.state.rotation ; // Comme ca il apparait au début sinon il apparait pas 
    }

    componentDidUpdate(prevProps, prevState) {
        // This will be called only if shouldComponentUpdate returned true
        if (this.props.currentStreak !== prevProps.currentStreak ||
            this.props.bestStreak !== prevProps.bestStreak ||
            this.state.rotation !== prevState.rotation ) {
            this.compute();
            // Any other logic that should run after the component updates
        }
    }




    compute() {
        console.log("COMPUUUUUUUUTE")
        // So we don't have 120% or something like that 
        let bestStreak = this.props.bestStreak;
        if (this.props.currentStreak >= bestStreak) {
            bestStreak = this.props.currentStreak + 5;
        }

        // Compute the progress bar 
        const radius = (this.props.size - this.props.strokeWidth) / 2;
        const circumference = Math.PI * radius;
        const strokeDasharray = `${(this.props.currentStreak / bestStreak) * circumference} ${circumference}`; // pour déterminer à quel niveau arreter la progress Bar 
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

        // Compute the text elements 
        const leftTextX = 10; // X position for left-aligned text
        const centerTextX = this.props.size / 2; // X position for center-aligned text
        const rightTextX = this.props.size; // X position for right-aligned text
        const bottomTextY = this.props.size / 2 + this.props.strokeWidth + 5; // Y position for text at the bottom

        const texts = [ // On va peut etre pas l'utiliser, tout dépend de ce que tu dis sur le commentaire de la ligne 126 avec le map. 
            {
                x: textX,
                y: textY + 5,
                fontSize: this.props.strokeWidth / 1.5,
                text: this.props.currentStreak
            },
            {
                x: leftTextX,
                y: bottomTextY,
                textAnchor: "start",
                text: '0',
            },
            {
                x: centerTextX,
                y: bottomTextY,
                textAnchor: "middle",
                fontSize: 14,
                fontWeight: 'normal',
                fill: '#bbb',
                text: langManager.curr['quests']['current-streak']
            },
            {
                x: rightTextX,
                y: bottomTextY,
                textAnchor: "end",
                text: bestStreak
            }
        ]
        const renderTexts = texts.map((item, index) => (
            <Text
                key={index}
                x={item.x}
                y={item.y}
                textAnchor={item.textAnchor || "middle"}
                fontSize={item.fontSize || 16}
                fontWeight={item.fontWeight || 'bold'}
                fill={item.fill || '#fff'}
            >
                {item.text}
            </Text>
        ))

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
            renderTexts,
            rotation,
            strokeDasharray
        })

        //console.log("New values from compute : ", dottedLine, backgroundProgressBar, progressBar, filledSemiCircle, renderTexts, rotation, strokeDasharray)

    }

}

StreakChartBack.prototype.props = StreakChartProps;
StreakChartBack.defaultProps = StreakChartProps;

export default StreakChartBack;