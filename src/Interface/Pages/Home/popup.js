import * as React from 'react';
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native';

import stylesPopup from './stylePopup';

import { Text, Icon } from 'Interface/Components';

/**
 * @typedef {Object} PopupSection
 * @property {string} title - Le titre de la section
 * @property {string[]} text - Les lignes de texte de la section
 */

/**
 * @typedef {Object} CollapsibleSectionProps
 * @property {PopupSection} section - Les données de la section
 * @property {boolean} isExpanded - État d'expansion de la section
 * @property {() => void} onToggle - Fonction appelée lors du toggle
 */

/**
 * @typedef {Object} CollapsiblePopupProps
 * @property {string} title - Le titre principal du popup
 * @property {PopupSection[]} sections - Les sections du popup
 */

/**
 * Section repliable avec animation
 * @param {CollapsibleSectionProps} props - Les propriétés du composant
 */
function CollapsibleSection({ section, isExpanded, onToggle }) {
    const animatedHeight = React.useRef(new Animated.Value(0)).current;
    const rotateValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: isExpanded ? 1 : 0,
                duration: 250,
                useNativeDriver: false
            }),
            Animated.timing(rotateValue, {
                toValue: isExpanded ? 1 : 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start();
    }, [isExpanded, animatedHeight, rotateValue]);

    const rotateStyle = {
        transform: [
            {
                rotate: rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg']
                })
            }
        ]
    };

    const contentStyle = {
        opacity: animatedHeight,
        maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 500]
        })
    };

    return (
        <View style={stylesPopup.section}>
            <TouchableOpacity style={stylesPopup.titleContainer} onPress={onToggle} activeOpacity={0.7}>
                <Text fontSize={18} style={stylesPopup.title}>
                    {section.title}
                </Text>
                <Animated.View style={rotateStyle}>
                    <Icon icon='chevron' size={16} />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={[stylesPopup.content, contentStyle]}>
                {section.text.map((text, i) => (
                    <Text key={i} fontSize={14} style={stylesPopup.text}>
                        {text}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
}

/**
 * Popup avec sections repliables
 * @param {CollapsiblePopupProps} props - Les propriétés du composant
 */
export function CollapsiblePopup({ title, sections }) {
    /** @type {[{[key: number]: boolean}, React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>]} */
    const [expanded, setExpanded] = React.useState({});

    return (
        <View style={stylesPopup.container}>
            <ScrollView>
                <Text fontSize={24} style={stylesPopup.popupTitle}>
                    {title}
                </Text>
                {sections.map((section, i) => (
                    <CollapsibleSection
                        key={i}
                        section={section}
                        isExpanded={expanded[i]}
                        onToggle={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
