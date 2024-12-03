import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Button, Easing } from 'react-native';

const DURATION = 500;

const CircleAnimation = ({ playAnimation, setPlayAnimation }: { playAnimation: boolean, setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const borderWidth = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!playAnimation) return;
        scale.setValue(0);
        opacity.setValue(1);
        borderWidth.setValue(1);

        // Start the animation
        Animated.parallel([
            Animated.timing(scale, {
                toValue: 5,
                duration: DURATION,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(borderWidth, {
                toValue: 0,
                duration: DURATION,
                useNativeDriver: true,
            }),
        ]).start();

        setPlayAnimation(false);
    }, [playAnimation])


    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.circle,
                    {
                        transform: [{ scale }],
                        opacity: opacity
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'green',
        position: 'absolute',
    },
});

export default CircleAnimation;