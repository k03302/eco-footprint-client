import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType, makeRedirectUri } from 'expo-auth-session';



export default function GoogleLoginButton() {
    const [googleUserInfo, setGoogleUserInfo] = useState({});

    // Configure the Google provider
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({

        webClientId: "148447232384-19tgvdb21n6526obffcart0hg2p0jgrb.apps.googleusercontent.com",        // Web client ID for Expo Go
        // iosClientId: "YOUR_IOS_CLIENT_ID",          // iOS client ID
        androidClientId: "148447232384-mgfsgm6n8fnk2v1n0vr1m6k8id6938ro.apps.googleusercontent.com",  // Android client ID
        responseType: ResponseType.Token,
        redirectUri: makeRedirectUri()
    });

    // Handle the authentication response
    useEffect(() => {
        if (googleResponse?.type === "success") {
            const { authentication } = googleResponse;
            authentication && fetchUserInfo(authentication.accessToken);
        }
    }, [googleResponse]);

    // Function to fetch user info from Google API
    const fetchUserInfo = async (token: string) => {
        const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        setGoogleUserInfo(user);

        console.log(token);
        console.log(user);
    };
    return (
        <TouchableOpacity onPress={() => googlePromptAsync()}>
            <Image source={require("@/assets/images/google_login.png")}
                style={styles.image_login_google} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image_login_google: {
        width: 252,
        height: 54,
        marginTop: 10
    },
})