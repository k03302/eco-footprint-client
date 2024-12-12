import { FileData } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getIdToken, getIdTokenAsync, getUserIdAsync } from '@/utils/login';
import { ImageSourcePropType } from 'react-native';

const apiRoot = "https://eccofootprint.com/api";

export async function uploadImage(
    { uri }:
        { uri: string }
): Promise<FileData | null> {
    return await filePost('file/create', uri)
}

export function getImageSource(
    { imageId }:
        { imageId: string }
): ImageSourcePropType {
    const result = {
        uri: apiRoot + 'file/' + imageId,
        headers: {
            Authorization: 'Bearer ' + getIdToken()
        }
    };
    return result;
}

export async function deleteImage(
    { imageId }:
        { imageId: string }
): Promise<boolean> {
    return axiosDelete('file/delete/' + imageId);
}