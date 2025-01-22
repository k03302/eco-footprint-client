import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, Text, Image, StyleSheet, View, Pressable, LogBox, Alert } from 'react-native';
import { router } from 'expo-router'

import * as WebBrowser from 'expo-web-browser';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { KakaoLoginFakeButton } from '@/components/auth/KakaoLoginFakeButton';
import { ThemeButton } from '@/components/ThemeButton';
import { initializeTestData } from '@/api/test';

LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Allows deep linking to function properly in Expo Go
WebBrowser.maybeCompleteAuthSession();



export default function App() {
    const fakeIdToken = "12345678";
    return (

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold' }}>환경발자국</Text>
            <Image source={require("@/assets/images/icon_2.png")}
                style={[styles.image_icon, { resizeMode: 'contain' }]} />
            <Image source={require("@/assets/images/line_login.png")}
                style={[styles.image_line_login, { resizeMode: 'contain' }]} />

            <KakaoLoginButton />
            <KakaoLoginFakeButton fakeIdToken={fakeIdToken} />
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
        margin: 50
    },
    image_line_login: {
        height: 22,
        width: 290,
        marginBottom: 50
    },
});
