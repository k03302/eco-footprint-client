import { NO_USER } from '@/core/model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { repo } from '@/api/main';

const ID_TOKEN_KEY = 'id_token';
const USER_ACCOUNT_KEY_PREFIX = 'user_account_';

let idTokenCache: string | null = null;
let userIdCache: string | null = null;

export async function login({ idToken: _idToken, useStoredToken = false }: { idToken?: string, useStoredToken?: boolean }) {
    // 저장된 토큰 사용하지 않고, idToken 제공 하지 않은 경우 리턴
    if (!useStoredToken && !_idToken) return;

    // useStoredToken 값에 따라 저장된 값을 가져오거나 idToken값을 사용
    const idToken = useStoredToken ? await getIdToken() : (_idToken || "");
    if (!idToken) {
        alert("로그인에 실패했습니다.");
        router.replace('/');
    }

    try {
        const userKey = USER_ACCOUNT_KEY_PREFIX + idToken?.slice(0, 10);
        const userId = await AsyncStorage.getItem(userKey);
        console.log("userId", userId);
        if (userId) {
            setIdToken(idToken);
            userIdCache = userId;
            router.replace('/map');
        } else {
            setIdToken(idToken);
            router.replace('/register');
        }
    } catch (error) {
        console.log(error);
    }

}

export async function register({ username, thumbnailUri, idToken: _idToken, useStoredToken = false }
    : { username: string, thumbnailUri: string, idToken?: string, useStoredToken?: boolean }) {
    if (!useStoredToken && !_idToken) return;
    const idToken = (useStoredToken ? await getIdToken() : _idToken) || "";

    if (!idToken) {
        alert("프로필 등록에 실패했습니다.");
        router.replace('/');
    }

    try {
        const newUserId = idToken.slice(0, 10);
        const userKey = USER_ACCOUNT_KEY_PREFIX + newUserId;
        const userId = await AsyncStorage.getItem(userKey);
        if (userId) {
            setIdToken(idToken);
            userIdCache = userId;
            router.replace('/map');
        } else {
            await AsyncStorage.setItem(userKey, newUserId);
            userIdCache = newUserId;


            await repo.files.uploadFile({
                id: newUserId + Date.now(),
                name: 'profile',
                fileUri: thumbnailUri
            })

            await repo.users.createUser({
                id: newUserId,
                username: username,
                point: 0,
                challengeList: [],
                couponList: [],
                thumbnailId: thumbnailUri
            });

            router.replace('/map');
        }
    } catch (error) {
        console.log(error);
    }
}

export function getUserId(): string | null {
    return userIdCache;
}

export async function getIdToken(): Promise<string> {
    if (idTokenCache) return idTokenCache;
    idTokenCache = await AsyncStorage.getItem(ID_TOKEN_KEY) || "";
    return idTokenCache;
}

export async function setIdToken(idToken: string): Promise<void> {
    idTokenCache = idToken;
    await AsyncStorage.setItem(ID_TOKEN_KEY, idToken);
}

export async function logout() {
    AsyncStorage.removeItem(ID_TOKEN_KEY);
    idTokenCache = null;
}
