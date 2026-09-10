import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import BackDisplay from './back';

import { Text, Icon, Button, Zap } from 'Interface/Components';

class Display extends BackDisplay {
    render() {
        const { icon, text, button, button2, additionalContent, additionalButton } = this.props.args;

        return (
            <View style={styles.page}>
                <View style={styles.iconParent}>
                    <Animated.View style={{ transform: [{ scale: this.state.anim }] }}>
                        {icon === 'zap' ? (
                            <Zap style={{ width: this.iconWidth, height: this.iconWidth }} />
                        ) : (
                            <Icon icon={icon} size={this.iconWidth} />
                        )}
                    </Animated.View>
                    <Animated.View style={{ transform: [{ scale: this.state.anim }] }}>
                        <Text style={styles.title}>{text}</Text>
                    </Animated.View>

                    {additionalContent && <View style={styles.additionalContent}>{additionalContent}</View>}
                </View>

                {this.quote !== null && (
                    <View style={styles.quoteContainer}>
                        <Text fontSize={16} color={'light'} style={styles.quote}>
                            {this.quote.text}
                        </Text>
                        <Text fontSize={14} color={'secondary'} style={styles.quote}>
                            {this.quote.author}
                        </Text>
                    </View>
                )}

                <View style={styles.doubleButtons}>
                    {additionalButton}

                    <View style={styles.buttonsRow}>
                        {button2 && this.callback2 && (
                            <Button
                                style={[styles.button, styles.buttonRowItem]}
                                appearance='outline'
                                fontSize={14}
                                onPress={this.callback2}
                            >
                                {button2}
                            </Button>
                        )}
                        <Button style={[styles.button, styles.buttonRowItem]} fontSize={14} onPress={this.callback}>
                            {button}
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconParent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginTop: 16,
        fontSize: 24,
        fontWeight: 'bold'
    },
    additionalContent: {
        marginTop: 24
    },

    doubleButtons: {
        width: '100%'
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12
    },
    button: {
        marginBottom: 12,
        paddingHorizontal: 12
    },
    buttonRowItem: {
        flex: 1,
        justifyContent: 'center'
    },

    quoteContainer: {
        paddingVertical: 42,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    quote: {
        fontStyle: 'italic'
    }
});

export default Display;
