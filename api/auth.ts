import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';

const REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI!;


const LOGIN_PLATFORM_LOCAL = 'login_platform_type';

enum LoginPlatformType {
    Google = 'google',
    Kakao = 'kakao',
    Test = 'test'
}

class LoginPlatform {
    private access_token_key: string;
    private refresh_token_key: string;
    private login_platform_type: LoginPlatformType;
    protected user_info_cache: any = null;
    private static loggedIn: boolean = false;

    constructor(access_token_key: string, refresh_token_key: string, login_platform_type: LoginPlatformType) {
        this.login_platform_type = login_platform_type;
        this.access_token_key = access_token_key;
        this.refresh_token_key = refresh_token_key;
    }


    async login(authCode: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async register(username: string, thumbnailUri: string | null): Promise<boolean> {
        try {
            const platformType = await this.getLoginPlatform();
            if (platformType !== this.login_platform_type) return false;

            const userId = await this.getUserId();
            if (!userId) return false;

            /// register API
            await repo.users.createUser({
                id: userId,
                name: username,
                currentPoints: 0,
                chellengeList: [],
                couponList: [],
                thumbnailId: thumbnailUri
            });
            /// register API

        } catch (error) {
            console.error(error);
        }

        return true;
    }
    async getUserInfo(): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async getUserId(): Promise<string | null> {
        throw new Error('Method not implemented.');
    }

    async setToken(accessToken: string, refreshToken: string): Promise<boolean> {
        try {
            AsyncStorage.setItem(this.access_token_key, accessToken);
            AsyncStorage.setItem(this.refresh_token_key, refreshToken);
            AsyncStorage.setItem(LOGIN_PLATFORM_LOCAL, this.login_platform_type);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }

    async logout(): Promise<boolean> {
        this.user_info_cache = null;
        try {
            AsyncStorage.removeItem(this.access_token_key);
            AsyncStorage.removeItem(this.refresh_token_key);
            AsyncStorage.removeItem(LOGIN_PLATFORM_LOCAL);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem(this.access_token_key);
    }
    async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem(this.refresh_token_key);
    }
    async getLoginPlatform(): Promise<string | null> {
        return await AsyncStorage.getItem(LOGIN_PLATFORM_LOCAL);
    }
    async isRegistered(): Promise<boolean> {
        try {
            const accessToken = await this.getAccessToken();
            const loginPlatform = await this.getLoginPlatform();
            if (!accessToken || loginPlatform !== this.login_platform_type) return false;

            const userInfo = await repo.users.getUserInfo(accessToken);
            if (!userInfo) return false;
        } catch (error) {
            //console.error(error);
            return false;
        }

        return true;
    }
    async isLoggedIn(): Promise<boolean> {
        try {
            const accessToken = await this.getAccessToken();
            const loginPlatform = await this.getLoginPlatform();
            if (!accessToken || loginPlatform !== this.login_platform_type) return false;
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
}



class KakaoLogin extends LoginPlatform {
    async login(authCode: string): Promise<boolean> {
        try {
            ////// get token
            const res = await axios({
                method: 'post',
                url: 'https://kauth.kakao.com/oauth/token',
                params: {
                    grant_type: 'authorization_code',
                    client_id: REST_API_KEY,
                    redirect_uri: REDIRECT_URI,
                    code: authCode
                }
            });
            ////// get token


            const { access_token, refresh_token } = res.data;
            console.log(access_token, " ", refresh_token);

            this.setToken(access_token, refresh_token);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }

    async getUserId() {
        if (this.user_info_cache) {
            return this.user_info_cache.id;
        }
        return (await this.getUserInfo()).id;
    }

    async getUserInfo() {
        if (this.user_info_cache) return this.user_info_cache;
        const accessToken = await this.getAccessToken();
        if (!accessToken) return null;
        try {
            const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { id, properties, kakao_account } = response.data;
            console.log("User ID:", id);  // User ID (unique identifier)
            console.log("Nickname:", properties.nickname);  // User's nickname
            console.log("Profile Image:", properties.profile_image);  // Profile image URL
            console.log("Email:", kakao_account.email);  // User's email (if authorized)
            this.user_info_cache = {
                userId: id,
                nickname: properties.nickname,
                profileImage: properties.profile_image,
                email: kakao_account.email,
            }
            return this.user_info_cache;
        } catch (error) {
            console.error("Error fetching Kakao user info:", error);
        }

        return null;
    }
}

class TestLogin extends LoginPlatform {
    async login(authCode: string) {
        try {
            this.setToken(authCode, authCode);
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }


    async getUserId() {
        return (await this.getAccessToken());
    }
}






export const kakaoLogin = new KakaoLogin('kakao_token_token', 'kakao_refresh_token', LoginPlatformType.Kakao);
export const testLogin = new TestLogin('test_access_token', 'test_refresh_token', LoginPlatformType.Test);

export async function getLoggedInPlatform(): Promise<LoginPlatform | null> {
    const platforms = [kakaoLogin, testLogin];
    for (const p of platforms) {
        if (await p.isLoggedIn()) {
            return p;
        }
    }
    return null;
}

export async function getCachedPlatform(): Promise<LoginPlatform | null> {
    const platforms = [kakaoLogin, testLogin];
    for (const p of platforms) {
        if (await p.isRegistered()) {
            return p;
        }
    }
    return null;
}


// export function isRegistered() {
//     return isRegisteredWithKakao()
// }

// export function getAccessToken() {
//     return AsyncStorage.getItem(ACCESS_TOKEN_LOCAL);
// }

// export function getRefreshToken() {
//     return AsyncStorage.getItem(REFRESH_TOKEN_LOCAL);
// }

// export async function logout() {
//     try {
//         AsyncStorage.removeItem(ACCESS_TOKEN_LOCAL);
//         AsyncStorage.removeItem(REFRESH_TOKEN_LOCAL);
//         AsyncStorage.removeItem(LOGIN_PLATFORM_LOCAL);
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
// }

// export async function register(username: string, thumbnailUri?: string) {
//     const loginPlatform = await AsyncStorage.getItem(LOGIN_PLATFORM_LOCAL);
//     if (loginPlatform === LoginPlatformType.Kakao) {
//         return await registerWithKakao(username, thumbnailUri);
//     } else if (loginPlatform === LoginPlatformType.Test) {
//         return await registerTest(username, thumbnailUri);
//     }
//     return false;
// }





// export async function loginTest(userCode: string) {
//     try {
//         await AsyncStorage.setItem(LOGIN_PLATFORM_LOCAL, LoginPlatformType.Test);
//         await AsyncStorage.setItem(ACCESS_TOKEN_LOCAL, userCode);
//         await AsyncStorage.setItem(REFRESH_TOKEN_LOCAL, userCode);
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function registerTest(username: string, thumbnailUri?: string) {
//     try {
//         const userCode = await AsyncStorage.getItem(ACCESS_TOKEN_LOCAL);
//         if (!userCode) return false;

//         await repo.users.createUser({
//             id: userCode,
//             name: username || userCode,
//             currentPoints: 0,
//             chellengeList: [],
//             couponList: [],
//             thumbnailId: thumbnailUri || null
//         });
//         /// register API

//     } catch (error) {
//         console.error(error);
//     }

//     return true;
// }







// export async function loginWithKakao(authCode: string) {
//     try {
//         ////// get token
//         const res = await axios({
//             method: 'post',
//             url: 'https://kauth.kakao.com/oauth/token',
//             params: {
//                 grant_type: 'authorization_code',
//                 client_id: REST_API_KEY,
//                 redirect_uri: REDIRECT_URI,
//                 code: authCode
//             }
//         });
//         ////// get token


//         const { access_token, refresh_token } = res.data;
//         console.log(access_token, " ", refresh_token);

//         await AsyncStorage.setItem(LOGIN_PLATFORM_LOCAL, LoginPlatformType.Kakao);
//         await AsyncStorage.setItem(ACCESS_TOKEN_LOCAL, access_token);
//         await AsyncStorage.setItem(REFRESH_TOKEN_LOCAL, refresh_token);
//     } catch (error) {
//         console.error(error);
//         return false;
//     }
//     return true;
// }

// async function getUserWithKakao() {
//     const accessToken = await getAccessToken();
//     if (!accessToken) return null;

//     try {
//         const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         const { id, properties, kakao_account } = response.data;
//         console.log("User ID:", id);  // User ID (unique identifier)
//         console.log("Nickname:", properties.nickname);  // User's nickname
//         console.log("Profile Image:", properties.profile_image);  // Profile image URL
//         console.log("Email:", kakao_account.email);  // User's email (if authorized)

//         return {
//             userId: id,
//             nickname: properties.nickname,
//             profileImage: properties.profile_image,
//             email: kakao_account.email,
//         };
//     } catch (error) {
//         console.error("Error fetching Kakao user info:", error);
//     }
// }

// export async function registerWithKakao(username: string, thumbnailUri?: string) {
//     try {
//         const info = await getUserWithKakao();
//         if (!info) return false;

//         /// register API
//         await repo.users.createUser({
//             id: info.userId,
//             name: username,
//             currentPoints: 0,
//             chellengeList: [],
//             couponList: [],
//             thumbnailId: thumbnailUri || info.profileImage || null
//         });
//         /// register API

//     } catch (error) {
//         console.error(error);
//     }

//     return true;
// }


// export async function isRegisteredWithKakao() {
//     try {
//         const info = await getUserWithKakao();
//         if (!info) return false;

//         const res = await repo.users.getUserInfo(info.userId);
//         if (res) return true;
//     } catch (error) {
//         console.error(error);
//     }
//     return false;
// }