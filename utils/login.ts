import { NO_USER } from '@/core/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const ID_TOKEN_KEY = 'id_token';


let idTokenCache: string | null = null;

// register api url
const url = `${process.env.EXPO_PUBLIC_SERVER_API!}${'user/register'}`;

export async function login({ idToken, useStoredToken = false }: { idToken?: string, useStoredToken?: boolean }) {
    // 저장된 토큰 사용하지 않고, idToken 제공 하지 않은 경우 리턴
    if (!useStoredToken && !idToken) return;

    // useStoredToken 값에 따라 저장된 값을 가져오거나 idToken값을 사용
    const token = useStoredToken ? await getIdToken() : (idToken || "");

    // 서버에 register 요청. data는 더미 데이터 제공
    await axios.post(url, {
        id: token,
        username: "asdf",
        point: 0,
        challengeList: [],
        couponList: [],
        thumbnailId: ""
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        // 더미 데이터로 register됨. register페이지로 이동
        AsyncStorage.setItem(ID_TOKEN_KEY, token);
        router.replace('/register');
    }).catch(error => {
        console.log(error.response);
        if (error.response.status === 409) {
            // 이미 사용자가 존재하여 더미 데이터를 등록할 수 없음. 로그인 성공
            AsyncStorage.setItem(ID_TOKEN_KEY, token);
            router.replace('/map');
        } else {
            Alert.alert("로그인에 실패했습니다.");
            router.replace('/');
        }
    });
}

export async function register({ username, thumbnailUri, idToken, useStoredToken = false }
    : { username: string, thumbnailUri: string, idToken?: string, useStoredToken?: boolean }) {
    if (!useStoredToken && !idToken) return;
    const token = (useStoredToken ? await getIdToken() : idToken) || "";



    // 서버에 register 요청. data는 더미 데이터 제공
    await axios.post(url, {
        id: token,
        username: username,
        point: 0,
        challengeList: [],
        couponList: [],
        thumbnailId: thumbnailUri
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        // 더미 데이터로 register됨. register페이지로 이동
        AsyncStorage.setItem(ID_TOKEN_KEY, token);
        router.replace('/register');
    }).catch(error => {
        console.log(error.response);
        if (error.response.status === 409) {
            // 이미 사용자가 존재하여 더미 데이터를 등록할 수 없음. 로그인 성공
            AsyncStorage.setItem(ID_TOKEN_KEY, token);
            router.replace('/map');
        } else {
            Alert.alert("로그인에 실패했습니다.");
            router.replace('/');
        }
    });
}



export async function getIdToken(): Promise<string> {
    return idTokenCache || (await AsyncStorage.getItem(ID_TOKEN_KEY)) || "";
}


export async function logout() {
    AsyncStorage.removeItem(ID_TOKEN_KEY);
    idTokenCache = null;
}
