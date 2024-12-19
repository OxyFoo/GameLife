import PageBase from 'Interface/FlowEngine/PageBase';

/**
 * @typedef {import('Interface/Components').ComboBox} ComboBox
 */

class BackResponsive extends PageBase {
    state = {
        scaleValue: this.fe.responsive.Get().scale.toString(),
        paddingVerticalValue: this.fe.responsive.Get().paddingVertical.toString(),
        paddingHorizontalValue: this.fe.responsive.Get().paddingHorizontal.toString()
    };

    /** @type {ComboBox['props']['onSelect']} */
    handleChangeAspectRatio = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ scaleValue: item?.value }, () => {
            this.fe.responsive.Set({
                ...this.fe.responsive.Get(),
                scale: parseFloat(item?.value) || 1
            });
        });
    };

    /** @type {ComboBox['props']['onSelect']} */
    handleChangePaddingVertical = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ paddingVerticalValue: item?.value }, () => {
            this.fe.responsive.Set({
                ...this.fe.responsive.Get(),
                paddingVertical: parseFloat(item?.value) || 0
            });
        });
    };

    /** @type {ComboBox['props']['onSelect']} */
    handleChangePaddingHorizontal = (item) => {
        if (item === null) {
            return;
        }

        this.setState({ paddingHorizontalValue: item?.value }, () => {
            this.fe.responsive.Set({
                ...this.fe.responsive.Get(),
                paddingHorizontal: parseFloat(item?.value) || 0
            });
        });
    };

    handleBackPress = () => {
        this.fe.BackHandle();
    };
}

export default BackResponsive;
