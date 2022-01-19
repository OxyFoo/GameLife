import * as React from 'react';
import { StyleSheet } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Icon from './Icon';
import Button from './Button';
import { IsUndefined } from '../../Functions/Functions';

const IconCheckableProps = {
    style: {},
    xml: '',
    size: 24,
    colorOn: 'main1',
    colorOff: 'backgroundGrey',
    id: 0,
    checked: undefined,
    onPress: (id, checked) => {},
    pressable: true
}

class IconCheckable extends React.Component {
    constructor(props) {
        super(props);

        this.rippleRef = React.createRef(); 
        this.state = { checked: false };
    }

    componentDidUpdate(prevProps) {
        if (!IsUndefined(this.props.checked)) {
            if (this.props.checked !== this.state.checked) {
                this.setState({ checked: this.props.checked });
            }
        }
    }

    switch = () => {
        const { id } = this.props;
        const { checked } = this.state;

        if (this.props.pressable) {
            this.setState({ checked: !checked });
            this.props.onPress(id, !checked);
        }
    }

    render() {
        const hexOn = themeManager.GetColor(this.props.colorOn);
        const hexOff = themeManager.GetColor(this.props.colorOff);
        const iconColor = this.state.checked ? hexOff : hexOn;
        const backgroundColor = this.state.checked ? hexOn : hexOff;

        const padding = 6;
        const btnSize = this.props.size + padding*2;
        const buttonStyle = [ styles.box, { height: btnSize, paddingVertical: padding, paddingHorizontal: padding }, this.props.style ];

        return (
            <>
                <Button
                    style={buttonStyle}
                    color={backgroundColor}
                    borderRadius={10}
                    onPress={this.switch}
                >
                    <Icon
                        xml={this.props.xml}
                        color={iconColor}
                        size={this.props.size} 
                    />
                </Button>
            </>
        );
    }
}

IconCheckable.prototype.props = IconCheckableProps;
IconCheckable.defaultProps = IconCheckableProps;

const styles = StyleSheet.create({
    box: {
        aspectRatio: 1
    }
});

export default IconCheckable;