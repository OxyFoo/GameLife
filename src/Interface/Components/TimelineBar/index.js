import * as React from 'react';
import { View, Dimensions } from 'react-native';

import styles from './style';
import TimelineBarBack from './back';
import dataManager from 'Managers/DataManager';
import { Icon } from 'Interface/Components';
import { type } from '@testing-library/react-native/build/user-event/type';


/**
 * 
 */
class TimelineBar extends TimelineBarBack {

    /**
     * Returns the complementary color of the given hex color
     * 
     * @param {string} hex 
     * @returns {string} hex color
     */
    getComplementaryColor(hex) {
        // Remove the '#' if it's there
        hex = hex.replace('#', '');
      
        // Convert hex to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
      
        // Find the complementary colors by subtracting each RGB component from 255
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      
        // Convert the RGB values back to hex
        let rHex = r.toString(16).padStart(2, '0');
        let gHex = g.toString(16).padStart(2, '0');
        let bHex = b.toString(16).padStart(2, '0');
      
        // Return the formatted hex color
        return `#${rHex}${gHex}${bHex}`;
      }
      

    /**
     * Render the activity in a time line with the height and icon depending on the scroll
     * 
     * @param {boolean} isScrolled 
     */
    renderActivities(isScrolled, skillLogoID) {
        const totalMinutesInDay = 24 * 60;
        return this.state.activities.map((activity, index) => {
            const width = (activity.duration / totalMinutesInDay) * 100 + '%';
            const offset = (activity.startTime / totalMinutesInDay) * 100 + '%';
            var complement = this.getComplementaryColor(activity.color);
            console.log(complement)
            return (
                <View
                    key={index}
                    style={[
                        styles.timelineItem,
                        {
                            backgroundColor: activity.color,
                            width: width,
                            left: offset,
                        }
                    ]}
                >
                    {!isScrolled ?
                        <Icon size={14} xml={dataManager.skills.GetXmlByLogoID(activity.skillLogoID)} color={complement} />
                        : <></>
                    }
                </View>
            );
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={[
                    styles.timelineContainer,
                    this.props.isScrolled ? { height: 5 } : {}
                ]}>
                    {this.renderActivities(this.props.isScrolled)}
                </View>
            </View>


        );
    }
}

export default TimelineBar;