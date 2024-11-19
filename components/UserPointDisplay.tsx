import { View, Image, StyleSheet, Text } from "react-native";
import { getMyProfile } from '@/api/user';
import React, { useEffect, useState } from 'react';
import PointDisplay, { PointDisplaySize } from "@/components/PointDisplay";



export default function UserPointDisplay({ displaySize }: { displaySize: PointDisplaySize }) {

    const [point, setPoint] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const myProfile = await getMyProfile();
            if (!myProfile) return;
            setPoint(myProfile.currentPoints);
        })();
    }, []);

    return <PointDisplay pointAmount={point} displaySize={displaySize} ></PointDisplay>
}

const styles = StyleSheet.create({

    profilebutton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        height: 50,
    },

});