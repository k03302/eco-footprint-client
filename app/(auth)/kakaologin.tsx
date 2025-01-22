import React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import { router } from 'expo-router'
import axios from 'axios';
import { login } from "@/utils/login";
import { isRegistered } from "@/utils/register";
import * as Crypto from 'expo-crypto';
import { getItemPoint } from "@/api/user";

const REDIRECT_URI = "https://eccofootprint.com";
const REST_API_KEY = "a0f7848c5e09023c767195b1b09be8a9";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { console.log(error) }, [error])

    const messageHandler = async (event: any) => {
        const data = event.nativeEvent.url;
        const authCode = getAuthCode(data);

        if (!authCode) {
            console.log(data);
            return;
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

            const { access_token } = res.data;

            console.log("access_token", access_token);

            const { id } = await getKaKaoUserData(access_token);

            console.log(id);

            login(id.toString());
            if (await isRegistered()) {
                router.replace('/map');
            } else {
                router.replace('/register');
            }

        } catch (error) {
            router.replace('/');
        }
    }

    const getKaKaoUserData = async (token: string) => {
        const kakaoUser = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return await kakaoUser.data
    }


    const getAuthCode = (target: string) => {
        const exp = 'code=';
        const condition = target.indexOf(exp);
        if (condition !== -1) {
            const requestCode = target.substring(condition + exp.length);
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