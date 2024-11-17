import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    Pressable,
    PressableProps,
    ViewStyle,
    ActivityIndicator,
} from 'react-native';

interface AsyncButtonProps extends PressableProps {
    title: string;
    onPressAsync: () => Promise<void>;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary';
}

const AsyncButton: React.FC<AsyncButtonProps> = ({
    title,
    onPressAsync,
    style,
    variant = 'primary',
    ...props
}) => {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        setLoading(true);
        try {
            await onPressAsync();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                variant === 'primary' ? styles.primary : styles.secondary,
                pressed && styles.pressed,
                style,
            ]}
            onPress={handlePress}
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

export default AsyncButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    primary: {
        backgroundColor: '#28a745',
    },
    secondary: {
        backgroundColor: '#28a745',
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
