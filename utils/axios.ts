import axios from 'axios';
import { getIdTokenAsync } from './login';
import * as FileSystem from 'expo-file-system';

const apiRoot = "https://eccofootprint.com/api/";

export async function filePost(path: string, fileUri: string): Promise<any> {

    const fullPath = apiRoot + path;
    const idToken = await getIdTokenAsync();

    return FileSystem.uploadAsync(apiRoot + path, fileUri, {
        httpMethod: 'POST',
        fieldName: 'file',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    }).then(response => {
        const data = JSON.parse(response.body);
        return data;
    }).catch(error => {
        return null;
    });
}

export async function axiosGet(path: string,
    onSuccess: (data: any) => void = (data: any) => { },
    onFail: (error: any) => void = (error: any) => { }
): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = await getIdTokenAsync();


    return axios.get(fullPath, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return data;
    }).catch(error => {
        onFail(error);
        return null;
    });
}

export async function axiosPost(path: string, body: any, params?: any,
    onSuccess: (data: any) => void = (data: any) => { },
    onFail: (error: any) => void = (error: any) => { }
): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = await getIdTokenAsync();

    const axiosQuery = params ? axios.post(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + idToken
        },
        params
    }) : axios.post(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    })

    return axiosQuery.then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onFail(error);
        return null;
    });
}

export async function axiosPut(path: string, body: any,
    onSuccess: (data: any) => void = (data: any) => { },
    onFail: (error: any) => void = (error: any) => { }
): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = await getIdTokenAsync();

    return axios.put(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onFail(error);
        return null;
    });
}

export async function axiosPutAdmin(path: string, body: any,
    onSuccess: (data: any) => void = (data: any) => { },
    onFail: (error: any) => void = (error: any) => { }
): Promise<any> {
    const fullPath = apiRoot + path;

    return axios.put(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + 1
        }
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onFail(error);
        return null;
    });
}


export async function axiosDelete(path: string,
    onSuccess: (data: any) => void = (data: any) => { },
    onFail: (error: any) => void = (error: any) => { }
): Promise<boolean> {
    const fullPath = apiRoot + path;
    const idToken = await getIdTokenAsync();

    return axios.delete(fullPath, {
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onFail(error);
        return false;
    });
}