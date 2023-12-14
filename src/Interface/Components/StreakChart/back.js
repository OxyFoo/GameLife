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

    /** @param {StreakChartProps} props */
    constructor(props) {
        super(props);

        const newState = this.compute(false);
        this.state = {
            ...this.state,
            ...newState,
        };

    }

    componentDidMount() {
        // Ici c'était appellé APRES le 1er rendu (effectué avec les state null)
        // Et le setState était bloqué par ton shouldUpdate
        // (et en ajoutant une comparaison pour l'autoriser qd mm ça fera qu'il essaie de rendre 2 fois donc c'est moyen ds tous les cas)
        //this.compute();
    }



    // Je l'ai commenté parce que ça fonctionne MAIS ça rajoute un délai de 1 valeur 
    // quand tu cliques sur le bouton.
    // ce décalage n'est pas normal mais je comprend pas pourquoi il arrive.
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate0 STREAKCHART', this.props, nextProps);
        //console.log('shouldComponentUpdate0 STREAKCHART', this.state, nextState); // Lui jle print pas avec le render ds le state c'est illisible mdr
        console.log('shouldComponentUpdate1 STREAKCHART', nextProps.currentStreak !== this.props.currentStreak);
        console.log('shouldComponentUpdate2 STREAKCHART', nextProps.bestStreak !== this.props.bestStreak);
        console.log('shouldComponentUpdate3 STREAKCHART', nextState.rotation !== this.state.rotation);

        // Si les valeurs des props (qui ont besoin d'un rerencer) changent, on update
        if (nextProps.currentStreak !== this.props.currentStreak ||
            nextProps.bestStreak !== this.props.bestStreak) {
            return true;
        }

        // On pourrait faire la comparaison avec le state.rotation ici
        // ça aiderait le 1er render (enfin, le ferait une 2e fois pour forcer l'affichage)
        // Et sa valeur (comme ceux du state) ne sont pas censé changer (et ne sont pas censé impliquer de rendus si les props ne changent pas)
        // Donc inutile de comparer les states a priori

        // Dans les autres cas on rerender pas
        return false;
    }



    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate STREAKCHART', this.props, prevProps);
        this.compute();
    }


    compute(update = true) {
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

        // Update the state
        // Là j'ai fais ça comme ça uniquement pour pouvoir appeller state dans le constructor
        // L'intérêt est d'avoir les valeurs AVANT le 1er rendu
        // Et on peut pas faire de setState dans le constructor, car il implique un rerendu et que le composant n'est pas encore monté
        if (update) {
            this.setState({
                dottedLine,
                backgroundProgressBar,
                progressBar,
                filledSemiCircle,
                rotation,
                strokeDasharray
            });
        }

        // Donc lui il est utilisé uniquement par le constructor
        // Tu peux soit laisser comme ça, soit ailleurs faire "setState(this.compute()))"
        // Et comme ça tu peux totalement virer le setState ici (et le paramètre de la fonction)
        // Dans les 2 cas ça va c'est efficace et pas trop dégeu
        return {
            dottedLine,
            backgroundProgressBar,
            progressBar,
            filledSemiCircle,
            rotation,
            strokeDasharray
        };
    }

}

StreakChartBack.prototype.props = StreakChartProps;
StreakChartBack.defaultProps = StreakChartProps;

export default StreakChartBack;