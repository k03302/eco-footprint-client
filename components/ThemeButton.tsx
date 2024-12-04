import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    Pressable,
    PressableProps,
    ViewStyle,
    ActivityIndicator,
} from 'react-native';

interface ButtonProps extends PressableProps {
    title: string;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary';
}

export const ThemeButton: React.FC<ButtonProps> = ({
    title,
    style,
    variant = 'primary',
    ...props
}) => {
    const [loading, setLoading] = useState(false);

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                variant === 'primary' ? styles.primary : styles.secondary,
                pressed && styles.pressed,
                style,
            ]}
            onPress={props.onPress}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    );
};


const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    primary: {
        backgroundColor: '#849C6A',
    },
    secondary: {
        backgroundColor: 'lightgray',
    },
    pressed: {
        opacity: 0.75,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
