import * as React from 'react';
import { Dimensions } from 'react-native';


import { GetDate, GetTime, GetTimeZone } from 'Utils/Time';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import { act } from 'react-test-renderer';



/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Class/Activities').Activity} Activity
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Activity[]} */
    activities: [],

    /** @type {null} */
    ref: null
}

class ActivityTimelineBack extends React.Component {

    constructor(props) {
        super(props);
        this.refActivityTimeline = React.createRef();
    }

    state = {
        activities: [],
        isScrolled: false
    }

    timeLineOpened = true;

    /**
     * Handle the scroll of the flatlist in Calendar
     * 
     * @param {any} event TODO : le type jsp ce que je dois mettre Gerem, je met any par défaut mdr  
     */
    handleScroll = (event) => {

        const isScrolled = event.nativeEvent.contentOffset.y > 0;

        if (isScrolled && this.timeLineOpened) {
            console.log("on ferme")
            this.setState({ isScrolled: true });
        } 
        else if (!isScrolled && !this.timeLineOpened){
            console.log("on ouvre")
            this.setState({ isScrolled: false });
        }

    };

    prepareActivities() {
        let tempActivities = [];

        for (const activity of this.props.activities) {
            const skill = dataManager.skills.GetByID(activity.skillID);
            const LogoID = skill.LogoID;
            const CategoryID = skill.CategoryID;
            const color = dataManager.skills.GetCategoryByID(CategoryID).Color;

            const startDate = GetDate(activity.startTime + GetTimeZone() * 3600);
            const startUtcTime = startDate.getUTCHours() * 60 + startDate.getUTCMinutes();

            tempActivities.push({
                color: color,
                startTime: startUtcTime,
                duration: activity.duration,
                skillLogoID: LogoID,
                marginLeft: 0
            })
        }

        return tempActivities;
    }

    prepareUIActivities(activities) {
        const screenWidth = Dimensions.get('window').width - 34; // Assuming full screen width - 32 cause border radius is 16 both side and 2 gray borders are 1 each 
        const totalMinutesInDay = 24 * 60;

        let lastWidth = 0;
        let tempActivities = [];
        for (const activity of activities) {

            const activityWidth = (activity.duration / totalMinutesInDay) * screenWidth;
            activity.width = activityWidth;

            const marginLeftScreen = (activity.startTime / totalMinutesInDay) * screenWidth;
            activity.marginLeft = marginLeftScreen - lastWidth;

            lastWidth = marginLeftScreen + activityWidth;

            activity.logo = dataManager.skills.GetXmlByLogoID(activity.skillLogoID);

            activity.logoColor = this.getComplementaryColor(activity.color);

            tempActivities.push(activity);
        }
        return activities
    }

    compute() {
        let activities;
        activities = this.prepareActivities();
        activities = this.prepareUIActivities(activities);

        this.setState({ activities: activities });
    }

    componentDidMount() {
        this.compute();
    } s

    componentDidUpdate(prevProps, prevState) {
        // this activates only if the activities array changes (we don't need to recompute anything if the scroll changes for example)
        if (this.props.activities !== prevProps.activities) {
            this.compute();
        }
    }

    /*
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
}

ActivityTimelineBack.prototype.props = InputProps;
ActivityTimelineBack.defaultProps = InputProps;

export default ActivityTimelineBack;