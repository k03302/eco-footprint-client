import { TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { repo, util } from '@/api/main';
import { getMyProfile } from '@/api/user';
import React, { useEffect, useState } from 'react';

enum UserIconSize {
    BIG = 2,
    SMALL = 1
}

export default function UserIcon({ isMyIcon = true, userId, iconSize = UserIconSize.SMALL, onPress,
    message
}:
    { isMyIcon?: boolean, userId?: string, iconSize?: UserIconSize, onPress?: () => void, message?: string }) {

    const [imageFileId, setImageFileId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    const size = (iconSize === UserIconSize.BIG) ? 70 : 35;


    useEffect(() => {
        (async () => {
            if (isMyIcon) {
                const myProfile = await getMyProfile();
                if (!myProfile) return;
                setImageFileId(myProfile.thumbnailId);
                setUserName(myProfile.name);
            } else if (userId) {
                const profile = await repo.users.getUserInfo(userId);
                if (!profile) return;
                setImageFileId(profile.thumbnailId);
                setUserName(profile.name);
            }
        })();
    }, [userId]);

    return (<TouchableOpacity
        onPress={onPress} style={styles.profilebutton}>
        <Image source={imageFileId ? util.getFileSource(imageFileId)
            : require("@/assets/images/user.png")}
            style={{
                width: size,
                height: size,
                marginRight: 5,
                borderRadius: size / 2
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