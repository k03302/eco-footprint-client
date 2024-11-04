import React, { useEffect, useState } from 'react';
import { Button, Text, View, Pressable } from 'react-native';
import { Picker } from "@react-native-picker/picker";

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
            <Picker>
                <Picker.Item label="User A" value="A" />
            </Picker>
        </View>
    );
}