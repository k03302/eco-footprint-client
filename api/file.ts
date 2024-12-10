import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getIdToken, getIdTokenAsync, getUserIdAsync } from '@/utils/login';
import { ImageSourcePropType } from 'react-native';

const apiRoot = process.env.EXPO_PUBLIC_SERVER_API!;

export async function uploadImage(
    { uri }:
        { uri: string }
): Promise<boolean> {
    const result = filePost('file/create', uri);
    return result !== null;
}

export function getImageSoucre(
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