import axios from 'axios';
import { getIdToken } from './login';
import * as FileSystem from 'expo-file-system';

const apiRoot = process.env.EXPO_PUBLIC_SERVER_API!;

export async function filePost(path: string, fileUri: string): Promise<any> {

    const fullPath = apiRoot + path;
    const idToken = await getIdToken();
    console.log("[filePost]", fullPath, idToken);

    return FileSystem.uploadAsync(apiRoot + path, fileUri, {
        httpMethod: 'POST',
        fieldName: 'file',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    }).then(response => {
        const data = JSON.parse(response.body);
        console.log("---->[response] success");
        return data;
    }).catch(error => {
        console.log("---->[error]", error.status, error.message);
        return null;
    });
}

export async function axiosGet(path: string): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = await getIdToken();
    console.log("[axiosGet]", fullPath, idToken);


    return axios.get(fullPath, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error.response.data.message, error.response.status);
        return null;
    });
}

export async function axiosPost(path: string, body: any) {
    const fullPath = apiRoot + path;
    const idToken = await getIdToken();
    console.log("[axiosPost]", fullPath, idToken);


    return axios.post(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error.response.data.message, error.response.status);
        return null;
    });
}

export async function axiosPut(path: string, body: any) {
    const fullPath = apiRoot + path;
    const idToken = await getIdToken();
    console.log("[axiosPut]", fullPath, idToken);


    return axios.put(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error.response.data.message, error.response.status);
        return null;
    });
}

export async function axiosDelete(path: string) {
    const fullPath = apiRoot + path;
    const idToken = await getIdToken();
    console.log("[axiosDelete]", fullPath, idToken);


    return axios.get(fullPath, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        console.log(response.data);
        return response.data;
    }).catch(error => {
        console.error(error.response.data.message, error.response.status);
        return null;
    });
}