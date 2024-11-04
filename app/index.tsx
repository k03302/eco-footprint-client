import React, { useEffect, useState } from 'react';
import { Button, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router'

import * as WebBrowser from 'expo-web-browser';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import KakaoLoginButton from '@/components/KakaoLoginButton';


// Allows deep linking to function properly in Expo Go
WebBrowser.maybeCompleteAuthSession();

export default function App() {


    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <GoogleLoginButton />
            <KakaoLoginButton />
            <Button title="pass" onPress={() => { router.push('/(tabs)') }} />
        </View>
    );
}