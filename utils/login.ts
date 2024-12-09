import { FileData, FileInput, NO_USER, UserItem } from '@/core/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const ID_TOKEN_KEY = 'id_token';
const USER_ID_KEY = 'user_id';


let idTokenCache: string | null = null;
let userIdCache: string | null = null;


const apiRoot = process.env.EXPO_PUBLIC_SERVER_API!;
const registerUrl = apiRoot + 'user/register';
const updateUserUrl = apiRoot + 'user/profile/';
const uploadFileUrl = apiRoot + 'file/create';

export async function login({ idToken, useStoredToken = false }: { idToken?: string, useStoredToken?: boolean }) {
    // 저장된 토큰 사용하지 않고, idToken 제공 하지 않은 경우 리턴
    if (!useStoredToken && !idToken) return;

    // useStoredToken 값에 따라 저장된 값을 가져오거나 idToken값을 사용
    const token = useStoredToken ? await getIdToken() : idToken;
    if (!token) {
        Alert.alert("로그인에 실패했습니다.");
        router.replace('/');
        return;
    }

    // 서버에 register 요청. data는 더미 데이터 제공
    await axios.post(registerUrl, {
        id: token,
        username: "",
        point: 0,
        challengeList: [],
        couponList: [],
        thumbnailId: ""
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        const userInfo = res.data as UserItem;
        userIdCache = userInfo.id;
        return AsyncStorage.setItem(USER_ID_KEY, userInfo.id);
    }).then(() => {
        idTokenCache = token;
        return AsyncStorage.setItem(ID_TOKEN_KEY, token);
    }).then(() => {
        router.replace('/register');
    }).catch(error => {
        console.log(error.response);
        if (error.response.status === 409) {
            idTokenCache = token;
            AsyncStorage.setItem(ID_TOKEN_KEY, token)
                .then(() => {
                    userIdCache = token;
                    console.log("userIdCache", userIdCache);
                    return AsyncStorage.setItem(USER_ID_KEY, token);
                }).then(() => {
                    router.replace('/map');
                });

        } else {
            Alert.alert("로그인에 실패했습니다.");
            router.replace('/');
        }
    });
}

export async function register({ username, thumbnailUri, idToken, useStoredToken = false }
    : { username: string, thumbnailUri: string, idToken?: string, useStoredToken?: boolean }) {
    if (!useStoredToken && !idToken) return;
    const token = useStoredToken ? await getIdToken() : idToken;
    if (!token) {
        Alert.alert("회원가입에 실패했습니다.");
        router.replace('/');
        return;
    }




    // 서버에 register 요청. data는 더미 데이터 제공
    await axios.post(registerUrl, {
        id: token,
        username: "",
        point: 0,
        challengeList: [],
        couponList: [],
        thumbnailId: ""
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        const userInfo = res.data as UserItem;
        userIdCache = userInfo.id;
        console.log("userIdCache", userIdCache);
        return AsyncStorage.setItem(USER_ID_KEY, userInfo.id);
    }).then(() => {
        idTokenCache = token;
        return AsyncStorage.setItem(ID_TOKEN_KEY, token);
    }).then(() => {
        return FileSystem.uploadAsync(uploadFileUrl, thumbnailUri, {
            httpMethod: 'POST',
            fieldName: 'file',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(response => {
        const imgData = JSON.parse(response.body) as FileData;
        const userId = getUserId();
        return axios.post(updateUserUrl + userId, {
            id: token,
            username: username,
            point: 0,
            challengeList: [],
            couponList: [],
            thumbnailId: imgData.id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }).then(() => {
        router.replace('/map');
    }).catch(error => {
        console.log(error.response);
        if (error.response.status === 409) {
            idTokenCache = token;
            AsyncStorage.setItem(ID_TOKEN_KEY, token)
                .then(() => {
                    userIdCache = token;
                    console.log("userIdCache", userIdCache);
                    return AsyncStorage.setItem(USER_ID_KEY, token)
                }).then(() => {
                    router.replace('/map');
                });
        } else {
            Alert.alert("회원가입에 실패했습니다.");
            router.replace('/');
        }
    });
}



export async function getIdToken(): Promise<string | null> {
    if (!idTokenCache) {
        idTokenCache = await AsyncStorage.getItem(ID_TOKEN_KEY);
    }
    return idTokenCache;
}

export async function getUserId(): Promise<string | null> {
    if (!userIdCache) {
        userIdCache = await AsyncStorage.getItem(USER_ID_KEY);
    }
    return userIdCache;
}


export async function logout() {
    await AsyncStorage.removeItem(ID_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_ID_KEY);
    idTokenCache = null;
    userIdCache = null;
}
