import { FileData, UserItem } from '@/core/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const ID_TOKEN_KEY = 'id_token';
const USER_ID_KEY = 'user_id';


let idTokenCache: string | null = null;
let userIdCache: string | null = null;


const apiRoot = "https://eccofootprint.com/api";
const registerUrl = apiRoot + 'user/register';
const updateUserUrl = apiRoot + 'user/profile/';
const uploadFileUrl = apiRoot + 'file/create';

export async function login(
    {
        idToken,
        useStoredToken = false,
        onLoginFail = () => { },
        onNeedRegister = () => { },
        onLoginSuccess = () => { }
    }:
        {
            idToken?: string,
            useStoredToken?: boolean,
            onLoginFail?: () => void,
            onNeedRegister?: () => void,
            onLoginSuccess?: () => void
        }) {
    // 저장된 토큰 사용하지 않고, idToken 제공 하지 않은 경우 리턴
    if (!useStoredToken && !idToken) return;

    // useStoredToken 값에 따라 저장된 값을 가져오거나 idToken값을 사용
    const token = useStoredToken ? await getIdTokenAsync() : idToken;
    if (!token) {
        Alert.alert("로그인에 실패했습니다. 토큰 없음");
        // router.replace('/');
        //onLoginFail();
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
        //router.replace('/register');
        onNeedRegister();
    }).catch(error => {
        if (error.response.status === 409) {
            idTokenCache = token;
            AsyncStorage.setItem(ID_TOKEN_KEY, token)
                .then(() => {
                    userIdCache = token;
                    return AsyncStorage.setItem(USER_ID_KEY, token);
                }).then(() => {
                    //router.replace('/map');
                    onLoginSuccess();
                });

        } else {
            Alert.alert("로그인에 실패했습니다." + registerUrl + error.response.message + error.response.status + token);
            // router.replace('/');
            //onLoginFail();
        }
    });
}

async function registerProcess(
    {
        username,
        thumbnailUri,
        idToken,
        onRegisterSuccess = () => { }
    }:
        {
            username: string,
            thumbnailUri: string,
            idToken: string,
            onRegisterSuccess: () => void
        }) {

    const userId = idToken;

    return Promise.resolve().then(() => {
        userIdCache = userId;
        return AsyncStorage.setItem(USER_ID_KEY, userId);
    }).then(() => {
        idTokenCache = idToken;
        return AsyncStorage.setItem(ID_TOKEN_KEY, idToken);
    }).then(() => {
        return FileSystem.uploadAsync(uploadFileUrl, thumbnailUri, {
            httpMethod: 'POST',
            fieldName: 'file',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        })
    }).then(response => {
        const imgData = JSON.parse(response.body) as FileData;
        const userId = getUserId();

        return axios.put(updateUserUrl, {
            id: idToken,
            username: username,
            point: 0,
            couponList: [],
            thumbnailId: imgData.id
        }, {
            headers: {
                Authorization: 'Bearer ' + idToken
            }
        });
    }).then((userInfo) => {
        //console.log("userInfo", userInfo);
        //router.replace('/map');
        onRegisterSuccess();
    })
}


export async function register(
    {
        username,
        thumbnailUri,
        idToken,
        useStoredToken = false,
        onRegisterFail = () => { },
        onRegisterSuccess = () => { }
    }: {
        username: string,
        thumbnailUri: string,
        idToken?: string,
        useStoredToken?: boolean,
        onRegisterFail?: () => void,
        onRegisterSuccess?: () => void
    }) {
    if (!useStoredToken && !idToken) return;
    const token = useStoredToken ? await getIdTokenAsync() : idToken;
    if (!token) {
        // Alert.alert("회원가입에 실패했습니다.");
        // router.replace('/');
        onRegisterFail();
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
        return registerProcess({ username, thumbnailUri, idToken: token, onRegisterSuccess });
    }).catch(error => {

        if (error.response.status === 409) {
            registerProcess({ username, thumbnailUri, idToken: token, onRegisterSuccess }).catch(error => {
                //console.log(error);
            });
        } else {
            onRegisterFail();
        }
    });
}

export function getIdToken(): string | null {
    return idTokenCache;
}

export function getUserId(): string | null {
    return userIdCache;
}


export async function getIdTokenAsync(): Promise<string | null> {
    if (!idTokenCache) {
        idTokenCache = await AsyncStorage.getItem(ID_TOKEN_KEY);
    }
    return idTokenCache;
}

export async function getUserIdAsync(): Promise<string | null> {
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
