import { View, Image, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from 'react';



export enum PointDisplaySizeLevel {
    BIG = 2,
    SMALL = 1
}

export function PointDisplay({ pointAmount = 0, displaySizeLevel }
    : { pointAmount: number, displaySizeLevel: PointDisplaySizeLevel }) {
    const iconSize = (displaySizeLevel === PointDisplaySizeLevel.BIG) ? 25 : 15;
    const fontSize = (displaySizeLevel === PointDisplaySizeLevel.BIG) ? 18 : 15




    return (<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        <Image source={require("@/assets/images/point.png")}
            style={{ width: iconSize, height: iconSize }} />
        <Text style={{ fontSize: fontSize, margin: 8 }}> {pointAmount} </Text>
    </View>);
}