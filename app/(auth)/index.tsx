import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, Image, StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router'

import * as WebBrowser from 'expo-web-browser';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import KakaoLoginButton from '@/components/KakaoLoginButton';
import { getIdToken, login } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            <KakaoLoginButton />
            <Button title="test" onPress={() => {
                login({ idToken: "1234" });
            }}></Button>
            <Button title="pass" onPress={() => {
                router.push('/map');
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
