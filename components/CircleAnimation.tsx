import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Button, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

const CircleAnimation = ({ playAnimation, setPlayAnimation }: { playAnimation: boolean, setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!playAnimation) return;
        scale.setValue(0);
        opacity.setValue(1);

        // Start the animation
        Animated.parallel([
            Animated.timing(scale, {
                toValue: 3,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
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
                        opacity,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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