import React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import { router } from 'expo-router'
import axios from 'axios';
import { login } from "@/utils/login";

const REDIRECT_URI = "https://eccofootprint.com/api/kakaologin";
const REST_API_KEY = "a0f7848c5e09023c767195b1b09be8a9";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const [showButton, setShowButton] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const messageHandler = async (event: any) => {
        const data = event.nativeEvent.url;
        const authCode = getAuthCode(data);
        if (!authCode) {
            Alert.alert('로그인에 실패했습니다.', data);
            router.replace('/');
        }

        try {
            const res = await axios({
                method: 'post',
                url: 'https://kauth.kakao.com/oauth/token',
                params: {
                    grant_type: 'authorization_code',
                    client_id: REST_API_KEY,
                    redirect_uri: REDIRECT_URI,
                    code: authCode
                }
            })

            const { id_token } = res.data;
            login({
                idToken: id_token.substring(0, 8), onLoginFail: () => {
                    Alert.alert('로그인에 실패했습니다.');
                    router.replace('/');
                }, onLoginSuccess: () => {
                    router.replace('/map');
                }, onNeedRegister: () => {
                    router.push('/register');
                }
            });
        } catch (error) {
            router.replace('/');
        }
    }

    const getAuthCode = (target: string) => {
        const exp = 'code=';
        const condition = target.indexOf(exp);
        if (condition !== -1) {
            const requestCode = target.substring(condition + exp.length);
            console.log('access code: ', requestCode);
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
            <WebView
                style={{ flex: 1 }}
                originWhitelist={['*']}
                scalesPageToFit={false}
                source={{
                    uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
                }}
                injectedJavaScript={INJECTED_JAVASCRIPT}
                javaScriptEnabled
                onMessage={messageHandler}
            />
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