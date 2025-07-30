import * as React from 'react';
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native';

import stylesPopup from './stylePopup';

import { Text, Icon } from 'Interface/Components';
import { TimingAnimation } from 'Utils/Animations';

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

/**
 * Section repliable avec animation
 * @param {CollapsibleSectionProps} props - Les propriétés du composant
 */
function CollapsibleSection({ section, isExpanded, onToggle }) {
    const animShowSection = React.useRef(new Animated.Value(0)).current;
    const animChevron = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            TimingAnimation(animShowSection, isExpanded ? 1 : 0, 250, false),
            TimingAnimation(animChevron, isExpanded ? 1 : 0, 250)
        ]).start();
    }, [isExpanded, animShowSection, animChevron]);

    const chevronStyle = {
        transform: [
            {
                rotate: animChevron.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg']
                })
            }
        ]
    };

    const contentStyle = {
        opacity: animShowSection,
        maxHeight: animShowSection.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 500]
        })
    };

    return (
        <View style={stylesPopup.section}>
            <TouchableOpacity style={stylesPopup.titleContainer} onPress={onToggle} activeOpacity={0.7}>
                <Text fontSize={18} style={stylesPopup.title} bold>
                    {section.title}
                </Text>
                <Animated.View style={chevronStyle}>
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
