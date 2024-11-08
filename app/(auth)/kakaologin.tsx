import React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { router } from 'expo-router'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




const REST_API_KEY = 'a0f7848c5e09023c767195b1b09be8a9';
const REDIRECT_URI = 'http://localhost:8081';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);


    const getCode = (target: string) => {
        const exp = 'code=';
        const condition = target.indexOf(exp);
        if (condition !== -1) {
            const requestCode = target.substring(condition + exp.length);
            console.log('access code: ', requestCode);
            requestToken(requestCode);
        }
    };

    const requestToken = async (authorize_code: string) => {
        axios({
            method: 'post',
            url: 'https://kauth.kakao.com/oauth/token',
            params: {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code: authorize_code
            }
        }).then((res) => {
            setAccessToken(res.data.access_token);
            setIdToken(res.data.access_token);
            console.log("id token: ", idToken);
            console.log("access token: ", accessToken);
        }).catch(function (error) {
            console.log('error', error);
        })
    };

    useEffect(() => {
        router.push('/map');
    }, [idToken])



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
                onMessage={event => {
                    const data = event.nativeEvent.url;
                    getCode(data);
                }}
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