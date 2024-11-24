import axios from 'axios';
import { getIdToken } from './login';

export async function axiosGet(path: string) {
    console.log(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`);
    console.log(await getIdToken());
    await axios.get(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, {
        headers: {
            Authorization: `Bearer ${await getIdToken()}`
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
    });
    return null;
}

export async function axiosPost(path: string, body: any) {
    console.log(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, body);
    console.log(await getIdToken());
    await axios.post(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, body, {
        headers: {
            Authorization: `Bearer ${await getIdToken()}`
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
    })
    return null;
}

export async function axiosPut(path: string, body: any) {
    console.log(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, body);
    console.log(await getIdToken());
    await axios.put(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, body, {
        headers: {
            Authorization: `Bearer ${await getIdToken()}`
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
    })
    return null;
}

export async function axiosDelete(path: string) {
    console.log(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`);
    console.log(await getIdToken());
    await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_API!}${path}`, {
        headers: {
            Authorization: `Bearer ${await getIdToken()}`
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error);
    })
    return null;
}