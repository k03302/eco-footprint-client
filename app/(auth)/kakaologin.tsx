import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { router } from 'expo-router'


const REST_API_KEY = 'a0f7848c5e09023c767195b1b09be8a9';
const REDIRECT_URI = 'http://localhost:8081';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {

    function KakaoLoginWebView(data: string) {
        const exp = "code=";
        var condition = data.indexOf(exp);
        if (condition != -1) {
            var authorize_code = data.substring(condition + exp.length);
            console.log(authorize_code);

            router.push('/map');
            return;
        }

        var errorIdx = data.indexOf("error=");
        if (errorIdx != -1) {
            router.push('/');
            return;
        }
    }

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
                onMessage={event => { KakaoLoginWebView(event.nativeEvent["url"]); }}
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