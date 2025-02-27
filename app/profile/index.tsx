import { Button, View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { UserIcon } from '@/components/UserIcon';
import { logout } from '@/utils/login';
import { useIsFocused } from '@react-navigation/native';
import { UserItem } from '@/core/model';
import { deleteProfile, getProfile } from '@/api/user';
import { getImageSource } from '@/api/file';


export default function ProfileScreen() {
    const isFocused = useIsFocused();
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);

    useEffect(() => {
        (async () => {
            const info = await getProfile({ myProfile: true });
            console.log(info);
            setUserInfo(info);
        })()
    }, [isFocused]);

    const logoutHandler = async () => {
        logout();
        router.replace('/');
    }

    const unregisterHandler = async () => {
        Alert.alert("정말로 회원 탈퇴하시겠습니까?", "", [
            {
                text: "확인",
                onPress: async () => {
                    await deleteProfile({ myProfile: true });
                    logoutHandler();
                }
            },
            {
                text: "취소"
            }
        ])
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_profile}>
                <UserIcon
                    imgSource={userInfo && userInfo.thumbnailId ? getImageSource({ imageId: userInfo.thumbnailId }) : undefined}
                    message={userInfo ? userInfo.username : ""} />
            </View>

            <Text style={{ fontSize: 20, marginLeft: 20 }}>관리</Text>

            <TouchableOpacity onPress={() => { router.push('/shop/coupons') }}>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/couponbox.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>내 쿠폰함</Text>
                </View>
            </TouchableOpacity>


            <Text style={{ fontSize: 20, marginLeft: 20, marginTop: 20 }}>서비스</Text>
            <TouchableOpacity onPress={() => { router.push('/profile/version') }}>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/world.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>버전 정보</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={logoutHandler}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={unregisterHandler}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>회원탈퇴</Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    row_profile: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginTop: 10
    },
    image_profile: {
        width: 38,
        height: 38,
    },
    image: {
        width: 20,
        height: 20,
    }
});
