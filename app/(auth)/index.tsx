import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, Image, StyleSheet, View, Pressable, LogBox } from 'react-native';
import { router } from 'expo-router'

import * as WebBrowser from 'expo-web-browser';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { getIdToken, login } from '@/localApi/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialize } from '@/localApi/main';
import { KakaoLoginFakeButton } from '@/components/auth/KakaoLoginFakeButton';

LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Allows deep linking to function properly in Expo Go
WebBrowser.maybeCompleteAuthSession();

export default function App() {
    useEffect(() => {
        (async () => {
            // if (await getIdToken()) {
            //     router.replace('/map');
            // }


        })()
    }, []);

    return (

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image source={require("@/assets/images/icon_2.png")}
                style={[styles.image_icon, { resizeMode: 'contain' }]} />
            <Image source={require("@/assets/images/line_login.png")}
                style={[styles.image_line_login, { resizeMode: 'contain' }]} />


            <GoogleLoginButton />
            {/* <KakaoLoginButton/> */}
            <KakaoLoginFakeButton />

            <Button title="init" onPress={() => {
                initialize();
            }}></Button>

        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#849C6A',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
    image_icon: {
        height: 172,
        width: 172,
        margin: 100
    },
    image_line_login: {
        height: 22,
        width: 290,
        marginBottom: 50
    },
});
