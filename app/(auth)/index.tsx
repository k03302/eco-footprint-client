import React, { useEffect, useState } from 'react';
import { Button, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router'

import * as WebBrowser from 'expo-web-browser';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import KakaoLoginButton from '@/components/KakaoLoginButton';
import { getCachedPlatform } from '@/api/auth'
import TestuserButton from '@/components/TestuserButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncButton from '@/components/AsyncButton'

// Allows deep linking to function properly in Expo Go
WebBrowser.maybeCompleteAuthSession();

export default function App() {
    useEffect(() => {
        (async () => {
            const loginPlatform = await getCachedPlatform();
            if (loginPlatform) {
                router.replace('/map');
            }
        })()
    }, []);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <GoogleLoginButton />
            <KakaoLoginButton />
            <TestuserButton title="test user 1" authCodeFake="asdf" />
            <TestuserButton title="test user 2" authCodeFake="zxcv" />
            <TestuserButton title="test user 3" authCodeFake="qwer" />
            <AsyncButton title="init local store" onPressAsync={async () => {
                await AsyncStorage.clear();
            }} />
        </View>
    );
}