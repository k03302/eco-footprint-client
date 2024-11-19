import { Button, View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { getLoggedInPlatform } from '@/api/auth'
import { useState } from 'react'
import { router, Link } from 'expo-router'


export default function ProfileScreen() {
    const logoutHandler = async () => {
        const platform = await getLoggedInPlatform();
        if (platform) {
            platform.logout();
        }
        router.replace('/');
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_profile}>
                <Image source={require("@/assets/images/user.png")}
                    style={[styles.image_profile, { resizeMode: 'contain' }]} />
                <Text style={{ fontSize: 20, marginLeft: 10 }}>내이름</Text>
            </View>

            <Text style={{ fontSize: 20, marginLeft: 20 }}>관리</Text>
            <TouchableOpacity>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/mail.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>친구 초대</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/alarm.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>알림 설정</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/couponbox.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>내 쿠폰함</Text>
                </View>
            </TouchableOpacity>


            <Text style={{ fontSize: 20, marginLeft: 20, marginTop: 20 }}>서비스</Text>
            <TouchableOpacity>
                <View style={styles.row}>
                    <Image source={require("@/assets/images/world.png")}
                        style={[styles.image, { resizeMode: 'contain' }]} />
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>버전 정보</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={logoutHandler}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>로그아웃</Text>
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
