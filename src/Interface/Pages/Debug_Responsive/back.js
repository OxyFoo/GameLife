import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * @typedef {import('Interface/Components').ComboBox} ComboBox
 */

class BackResponsive extends PageBase {
    /** @param {object} props */
    constructor(props) {
        super(props);

        const responsive = this.fe.GetResponsive();
        this.state = {
            scaleValue: responsive.scale.toString(),
            paddingVerticalValue: responsive.paddingVertical.toString(),
            paddingHorizontalValue: responsive.paddingHorizontal.toString()
        };
    }

    /** @type {ComboBox['props']['onSelect']} */
    handleChangeAspectRatio = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ scaleValue: item?.value }, () => {
            this.fe.SetResponsive({ scale: parseFloat(item?.value) || 1 });
        });
    };

    /** @type {ComboBox['props']['onSelect']} */
    handleChangePaddingVertical = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ paddingVerticalValue: item?.value }, () => {
            this.fe.SetResponsive({ paddingVertical: parseFloat(item?.value) || 0 });
        });
    };

    /** @type {ComboBox['props']['onSelect']} */
    handleChangePaddingHorizontal = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ paddingHorizontalValue: item?.value }, () => {
            this.fe.SetResponsive({ paddingHorizontal: parseFloat(item?.value) || 0 });
        });
    };

    handleBackPress = () => {
        this.fe.BackHandle();
    };
}

export default BackResponsive;
