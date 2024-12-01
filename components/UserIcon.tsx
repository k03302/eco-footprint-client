import { TouchableOpacity, Image, StyleSheet, Text, ImageSourcePropType } from "react-native";
import { repo, util } from '@/api/back';
import React, { useEffect, useState } from 'react';


enum UserIconSize {
    BIG = 2,
    SMALL = 1
}

const DEFAULT_USER_IMAGE_PATH = "@/assets/images/user.png"

export function UserIcon({ imgSource, iconSize = UserIconSize.SMALL, onPress, message = "" }
    : { imgSource?: ImageSourcePropType, iconSize?: UserIconSize, onPress?: () => void, message?: string }) {
    const size = (iconSize === UserIconSize.BIG) ? 70 : 38;


    return (<TouchableOpacity
        onPress={onPress} style={styles.profilebutton}>
        <Image
            source={imgSource ? imgSource : require(DEFAULT_USER_IMAGE_PATH)}
            style={{
                width: size,
                height: size,
                marginRight: 5,
                borderRadius: size / 2,
                marginTop: 10,
                marginLeft: 3
            }} />
        {
            message ? <Text style={{ opacity: 0.9, fontSize: 16 }}>{message}</Text> : <></>
        }
    </TouchableOpacity>);
}

const styles = StyleSheet.create({

    profilebutton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        height: 50,
    },

});