import { View, StyleSheet, Animated, Dimensions, Button, Easing, Image, Text } from "react-native";
import React, { useEffect, useRef, useState } from 'react';

const DURATION = 1000;

export enum PointDisplaySizeLevel {
    BIG = 2,
    SMALL = 1
}

export enum PointAnimationOption {
    NONE = 0,
    MOVE_UP = 1,
    MOVE_DOWN = 2
}

export function PointDisplay({ pointAmount = 0, displaySizeLevel, pointAnimationOption }
    : { pointAmount: number, displaySizeLevel: PointDisplaySizeLevel, pointAnimationOption: PointAnimationOption }) {
    const iconSize = (displaySizeLevel === PointDisplaySizeLevel.BIG) ? 25 : 15;
    const fontSize = (displaySizeLevel === PointDisplaySizeLevel.BIG) ? 18 : 15;

    const [isFirst, setIsFirst] = useState<boolean>(true);
    const [currentPoint, setCurrentPoint] = useState<number>(0);
    const [pointDiff, setPointDiff] = useState<number>(0);


    const opacity = useRef(new Animated.Value(0)).current;
    const yDiff = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const diff = pointAmount - currentPoint
        setPointDiff(diff);
        setCurrentPoint(pointAmount);

        const first = isFirst;
        console.log("first", first, pointAmount);

        setIsFirst(false);
        if (first) return;
        if (diff === 0) return;
        if (pointAnimationOption === PointAnimationOption.NONE) return;

        opacity.setValue(1);
        yDiff.setValue(1);

        // Start the animation
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(yDiff, {
                toValue: pointAnimationOption === PointAnimationOption.MOVE_UP ? -50 : 50,
                duration: DURATION,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [pointAmount]);


    return (<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, zIndex: 1000 }}>
        <Image source={require("@/assets/images/point.png")}
            style={{ width: iconSize, height: iconSize }} />
        <Text style={{ fontSize: fontSize, margin: 8, fontWeight: 'bold' }}> {currentPoint} </Text>
        <Animated.Text style={{
            position: "absolute",
            fontSize: fontSize,
            margin: 8,
            color: pointDiff >= 0 ? 'green' : 'red',
            opacity: opacity,
            justifyContent: "center",
            right: 10,
            top: pointAnimationOption === PointAnimationOption.MOVE_UP ? -20 : 20,
            fontWeight: 'bold',
            transform: [
                { translateY: yDiff },
            ],
        }}>{pointDiff >= 0 ? '+' : ''}{pointDiff}
        </Animated.Text>
    </View>);
}