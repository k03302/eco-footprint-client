import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { getAdminIdToken, getIdToken } from './login';

const apiRoot = "https://eccofootprint.com/api/";

export async function filePost(
    {
        path, fileUri, params,
        onSuccess = (data) => { },
        onError = (error) => { }
    }: {
        path: string, fileUri: string, params?: any,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }): Promise<any> {

    const fullPath = apiRoot + path;
    const idToken = getIdToken();

    return FileSystem.uploadAsync(apiRoot + path, fileUri, {
        httpMethod: 'POST',
        fieldName: 'file',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
            Authorization: 'Bearer ' + idToken
        },
        parameters: params
    }).then(response => {
        const data = JSON.parse(response.body);
        onSuccess(data);
        return data;
    }).catch(error => {
        onError(error);
        return null;
    });
}

export async function filePut(
    {
        path, fileUri, params,
        onSuccess = (data) => { },
        onError = (error) => { }
    }: {
        path: string, fileUri: string, params?: any,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }): Promise<any> {

    const fullPath = apiRoot + path;
    const idToken = getIdToken();

    return FileSystem.uploadAsync(apiRoot + path, fileUri, {
        httpMethod: 'PUT',
        fieldName: 'file',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
            Authorization: 'Bearer ' + idToken
        },
        parameters: params
    }).then(response => {
        const data = JSON.parse(response.body);
        onSuccess(data);
        return data;
    }).catch(error => {
        onError(error);
        return null;
    });
}

export async function axiosGet(
    {
        path, params,
        admin = false,
        onSuccess = (data) => { },
        onError = (error) => { }
    }: {
        path: string, params?: any
        admin?: boolean,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }): Promise<any> {

    const fullPath = apiRoot + path;
    const idToken = getIdToken();
    const adminIdToken = getAdminIdToken();

    return axios.get(fullPath, {
        headers: {
            Authorization: 'Bearer ' + (admin ? adminIdToken : idToken)
        },
    }).then(response => {
        const data = response.data;
        onSuccess(fullPath);
        return data;
    }).catch(error => {
        onError(error);
        return null;
    });
}

export async function axiosPost(
    {
        path, body, params,
        admin = false,
        onSuccess = (data: any) => { },
        onError = (error: any) => { }
    }: {
        path: string, body: any, params?: any,
        admin?: boolean,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = getIdToken();
    const adminIdToken = getAdminIdToken();


    return axios.post(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + (admin ? adminIdToken : idToken)
        },
        params
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onError(error);
        return null;
    });
}

export async function axiosPut(
    {
        path, body, params,
        admin = false,
        onSuccess = (data: any) => { },
        onError = (error: any) => { }
    }: {
        path: string, body: any, params?: any,
        admin?: boolean
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }
): Promise<any> {
    const fullPath = apiRoot + path;
    const idToken = getIdToken();
    const adminIdToken = getAdminIdToken();

    return axios.put(fullPath, body, {
        headers: {
            Authorization: 'Bearer ' + (admin ? adminIdToken : idToken)
        },
        params
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onError(error);
        return null;
    });
}


export async function axiosDelete(
    {
        path, params,
        admin = false,
        onSuccess = (data) => { },
        onError = (error) => { }
    }: {
        path: string, params?: any,
        admin?: boolean
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    }
): Promise<boolean> {
    const fullPath = apiRoot + path;
    const idToken = getIdToken();
    const adminIdToken = getAdminIdToken();

    return axios.delete(fullPath, {
        headers: {
            Authorization: 'Bearer ' + (admin ? adminIdToken : idToken)
        }
    }).then(response => {
        const data = response.data;
        onSuccess(data);
        return response.data;
    }).catch(error => {
        onError(error);
        return false;
    });
}