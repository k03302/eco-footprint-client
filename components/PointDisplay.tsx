import { View, Image, StyleSheet, Text } from "react-native";
import { getMyProfile } from '@/api/user';
import React, { useEffect, useState } from 'react';

export enum PointDisplaySize {
    BIG = 2,
    SMALL = 1
}

export default function PointDisplay({ pointAmount = 0, displaySize }
    : { pointAmount: number, displaySize: PointDisplaySize }) {
    const iconSize = (displaySize === PointDisplaySize.BIG) ? 70 : 35;
    const fontSize = (displaySize === PointDisplaySize.BIG) ? 30 : 15

    return (<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        <Image source={require("@/assets/images/point.png")}
            style={{ width: iconSize, height: iconSize }} />
        <Text style={{ fontSize: fontSize, margin: 8 }}> {pointAmount} </Text>
    </View>);
}

const styles = StyleSheet.create({

    profilebutton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        height: 50,
    },

});