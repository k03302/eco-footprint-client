
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getIdToken } from './login';
import { getProfile } from '@/api/user';
import { axiosGet, axiosPost, axiosPut } from './axios';
import { uploadImage } from '@/api/file';

const apiRoot = "https://eccofootprint.com/api";
const registerUrl = apiRoot + 'user/register';
const updateUserUrl = apiRoot + 'user/profile/';
const uploadFileUrl = apiRoot + 'file/create';

export async function isRegistered() {
    const idToken = getIdToken();
    if (!idToken) {
        return false;
    }
    const userInfo = await axiosGet({ path: 'user/profile/' + idToken });

    if (!userInfo || !userInfo.username || !userInfo.thumbnailId) return false;
    return true;
}

export async function register(
    {
        username,
        thumbnailUri
    }: {
        username: string,
        thumbnailUri: string
    }) {

    const idToken = getIdToken();
    if (!idToken) {
        return false;
    }
    console.log(idToken);
    const userInfo = await axiosPost({
        path: 'user/register',
        body: {
            id: idToken,
            username: username,
            point: 0,
            couponList: [],
            thumbnailId: ''
        },
        onError: error => {
            console.log(error);
        }
    });
    console.log(idToken);
    const imgInfo = await uploadImage({ uri: thumbnailUri });
    console.log(imgInfo);
    if (imgInfo) {
        const updatedUserInfo = await axiosPut({
            path: 'user/profile', body: {
                id: idToken,
                username: username,
                point: 1000,
                couponList: [],
                thumbnailId: imgInfo.id
            }
        })

    }
    console.log(idToken);
    return (userInfo !== null);
}
