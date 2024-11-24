import { View, Image, StyleSheet, Text, Animated } from "react-native";
import React, { useEffect, useState } from 'react';
import PointDisplay, { PointDisplaySizeLevel } from "@/components/PointDisplay";


export function UserPointDisplay({ displaySizeLevel, }: { displaySizeLevel: PointDisplaySizeLevel }) {

    const [point, setPoint] = useState<number>(0);
    // const profile = useProfileStore((state) => state.profile);

    useEffect(() => {
        (async () => {
            // const myProfile = await getMyProfile();
            // if (!myProfile) return;
            // setPoint(myProfile.currentPoints);
        })();
    }, []);

    // useEffect(() => {
    //     if (profile) {
    //         setPoint(profile?.currentPoints);
    //     }
    //     console.log("profileCache", profile);
    // }, [profile])

    return <PointDisplay pointAmount={point} displaySizeLevel={displaySizeLevel} ></PointDisplay>
}

const styles = StyleSheet.create({

    profilebutton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        height: 50,
    },

});