import * as React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import themeManager from 'Managers/ThemeManager';
import styles from './style';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {Object} ProgressBorderPropsType
 * @property {number} progress - Progression entre 0 et 100
 * @property {number} borderRadius - Rayon de la bordure
 * @property {number} borderWidth - Largeur de la bordure
 * @property {string} [color] - Couleur de la bordure (optionnelle)
 * @property {StyleProp} [style] - Style personnalisé
 */

/** @type {ProgressBorderPropsType} */
const ProgressBorderProps = {
    progress: 0,
    borderRadius: 8,
    borderWidth: 2,
    color: undefined,
    style: {}
};

/**
 * Composant qui affiche une bordure de progression rectangulaire avec SVG
 * La bordure se remplit dans le sens horaire selon le pourcentage
 */
class ProgressBorder extends React.Component {
    state = {
        width: 0,
        height: 0
    };

    /**
     * Crée le chemin SVG pour la bordure progressive
     * @param {number} width - Largeur
     * @param {number} height - Hauteur
     * @param {number} progress - Progression (0-100)
     * @returns {string} Chemin SVG
     */
    createProgressPath = (width, height, progress) => {
        const { borderRadius, borderWidth } = this.props;
        const halfStroke = borderWidth / 2;
        
        // Ajuster les dimensions pour tenir compte de l'épaisseur du trait
        const w = width - borderWidth;
        const h = height - borderWidth;
        const r = Math.max(0, borderRadius - halfStroke);
        
        // Calculer le périmètre total (approximatif)
        const topLength = Math.max(0, w - 2 * r);
        const rightLength = Math.max(0, h - 2 * r);
        const bottomLength = Math.max(0, w - 2 * r);
        const leftLength = Math.max(0, h - 2 * r);
        const cornerLength = (Math.PI * r) / 2; // Quart de cercle
        
        const totalLength = topLength + rightLength + bottomLength + leftLength + 4 * cornerLength;
        const progressLength = (progress / 100) * totalLength;
        
        let currentLength = 0;
        let path = '';
        
        // Point de départ : coin supérieur gauche (après le rayon)
        path += `M ${halfStroke + r} ${halfStroke}`;
        
        // 1. Côté supérieur (gauche → droite)
        const topProgress = Math.min(progressLength - currentLength, topLength);
        if (topProgress > 0) {
            path += ` L ${halfStroke + r + topProgress} ${halfStroke}`;
        }
        currentLength += topLength;
        
        // 2. Coin supérieur droit
        if (progressLength > currentLength) {
            const cornerProgress = Math.min(progressLength - currentLength, cornerLength);
            const angle = (cornerProgress / cornerLength) * 90;
            if (angle > 0) {
                const endX = halfStroke + w - r + r * Math.sin((angle * Math.PI) / 180);
                const endY = halfStroke + r - r * Math.cos((angle * Math.PI) / 180);
                path += ` A ${r} ${r} 0 0 1 ${endX} ${endY}`;
            }
        }
        currentLength += cornerLength;
        
        // 3. Côté droit (haut → bas)
        if (progressLength > currentLength) {
            const rightProgress = Math.min(progressLength - currentLength, rightLength);
            if (rightProgress > 0) {
                path += ` L ${halfStroke + w} ${halfStroke + r + rightProgress}`;
            }
        }
        currentLength += rightLength;
        
        // 4. Coin inférieur droit
        if (progressLength > currentLength) {
            const cornerProgress = Math.min(progressLength - currentLength, cornerLength);
            const angle = (cornerProgress / cornerLength) * 90;
            if (angle > 0) {
                const endX = halfStroke + w - r + r * Math.cos((angle * Math.PI) / 180);
                const endY = halfStroke + h - r + r * Math.sin((angle * Math.PI) / 180);
                path += ` A ${r} ${r} 0 0 1 ${endX} ${endY}`;
            }
        }
        currentLength += cornerLength;
        
        // 5. Côté inférieur (droite → gauche)
        if (progressLength > currentLength) {
            const bottomProgress = Math.min(progressLength - currentLength, bottomLength);
            if (bottomProgress > 0) {
                path += ` L ${halfStroke + w - r - bottomProgress} ${halfStroke + h}`;
            }
        }
        currentLength += bottomLength;
        
        // 6. Coin inférieur gauche
        if (progressLength > currentLength) {
            const cornerProgress = Math.min(progressLength - currentLength, cornerLength);
            const angle = (cornerProgress / cornerLength) * 90;
            if (angle > 0) {
                const endX = halfStroke + r - r * Math.sin((angle * Math.PI) / 180);
                const endY = halfStroke + h - r + r * Math.cos((angle * Math.PI) / 180);
                path += ` A ${r} ${r} 0 0 1 ${endX} ${endY}`;
            }
        }
        currentLength += cornerLength;
        
        // 7. Côté gauche (bas → haut)
        if (progressLength > currentLength) {
            const leftProgress = Math.min(progressLength - currentLength, leftLength);
            if (leftProgress > 0) {
                path += ` L ${halfStroke} ${halfStroke + h - r - leftProgress}`;
            }
        }
        currentLength += leftLength;
        
        // 8. Coin supérieur gauche (final)
        if (progressLength > currentLength) {
            const cornerProgress = Math.min(progressLength - currentLength, cornerLength);
            const angle = (cornerProgress / cornerLength) * 90;
            if (angle > 0) {
                const endX = halfStroke + r - r * Math.cos((angle * Math.PI) / 180);
                const endY = halfStroke + r - r * Math.sin((angle * Math.PI) / 180);
                path += ` A ${r} ${r} 0 0 1 ${endX} ${endY}`;
            }
        }
        
        return path;
    };

    /** @param {import('react-native').LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        this.setState({ width, height });
    };

    render() {
        const { style, progress, color } = this.props;
        const { width, height } = this.state;
        
        if (width === 0 || height === 0 || progress === 0) {
            return <View style={[styles.progressBorderContainer, style]} onLayout={this.onLayout} />;
        }

        const path = this.createProgressPath(width, height, progress);
        const borderColor = color || themeManager.GetColor('main2');
        
        return (
            <View style={[styles.progressBorderContainer, style]} onLayout={this.onLayout}>
                <Svg width={width} height={height} style={styles.progressSvg}>
                    <Path
                        d={path}
                        stroke={borderColor}
                        strokeWidth={this.props.borderWidth}
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </Svg>
            </View>
        );
    }
}

ProgressBorder.prototype.props = ProgressBorderProps;
ProgressBorder.defaultProps = ProgressBorderProps;

export default ProgressBorder;
