import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import langManager from '../../Managers/LangManager';

import { Text, Icon } from '../Components';

const PageHeaderProps = {
    style: {},
    hideHelp: false,
    onBackPress: () => {},
    onHelpPress: () => {}
}

class PageHeader extends React.Component {
    render() {
        const { onBackPress, onHelpPress} = this.props;
        const T_back = langManager.curr['modal']['back'];

        return (
            <View style={[styles.header, this.props.style]}>
                <TouchableOpacity style={styles.headerLeft} activeOpacity={.5} onPress={onBackPress}>
                    <Icon style={styles.headerLeftArrow} icon='arrowLeft' size={30} />
                    <Text fontSize={16}>{T_back}</Text>
                </TouchableOpacity>
                {!this.props.hideHelp && <Icon onPress={onHelpPress} icon='info' size={30} />}
            </View>
        );
    }
}

PageHeader.prototype.props = PageHeaderProps;
PageHeader.defaultProps = PageHeaderProps;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginTop: 24,
        marginBottom: 48,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        elevation: 1000,
        zIndex: 1000
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerLeftArrow: {
        marginRight: 12
    }
});

export default PageHeader;