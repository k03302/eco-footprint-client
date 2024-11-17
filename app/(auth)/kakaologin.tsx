import React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { router } from 'expo-router'
import axios from 'axios';
import { kakaoLogin } from '@/api/auth'





const REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI!;
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const [showButton, setShowButton] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const messageHandler = async (event: any) => {
        const data = event.nativeEvent.url;
        const authCode = getAuthCode(data);
        if (!authCode) return;
        await kakaoLogin.login(authCode);
        if (await kakaoLogin.isRegistered()) {
            router.replace('/map');
        } else {
            router.replace('/register');
        }
    }

    const getAuthCode = (target: string) => {
        const exp = 'code=';
        const condition = target.indexOf(exp);
        if (condition !== -1) {
            const requestCode = target.substring(condition + exp.length);
            console.log('access code: ', requestCode);
            setShowButton(false);
            return requestCode;
        }

        const errorExp = 'error=';
        const errorCondition = target.indexOf(errorExp);
        if (errorCondition !== -1) {
            setError(target);
        }
        return null;
    };


    return (
        <View style={Styles.container}>
            {
                showButton ? <WebView
                    style={{ flex: 1 }}
                    originWhitelist={['*']}
                    scalesPageToFit={false}
                    source={{
                        uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
                    }}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    javaScriptEnabled
                    onMessage={messageHandler}
                /> : <></>
            }
        </View>
    )
}

export default KaKaoLogin;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        backgroundColor: '#fff',
    },
});