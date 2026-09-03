import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * ComboBox is a function component, so its props type is imported directly
 * instead of going through `ComboBox['props']`.
 * @typedef {import('Interface/Components/ComboBox/back').ComboBoxPropsType} ComboBoxPropsType
 * @typedef {NonNullable<ComboBoxPropsType['onSelect']>} ComboBoxOnSelect
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

    /** @type {ComboBoxOnSelect} */
    handleChangeAspectRatio = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ scaleValue: item?.value }, () => {
            this.fe.SetResponsive({ scale: parseFloat(item?.value) || 1 });
        });
    };

    /** @type {ComboBoxOnSelect} */
    handleChangePaddingVertical = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ paddingVerticalValue: item?.value }, () => {
            this.fe.SetResponsive({ paddingVertical: parseFloat(item?.value) || 0 });
        });
    };

    /** @type {ComboBoxOnSelect} */
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
