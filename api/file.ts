import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getIdToken, getUserId } from '@/utils/login';
import { ImageSourcePropType } from 'react-native';

const apiRoot = process.env.EXPO_PUBLIC_SERVER_API!;

export async function uploadImage({ uri }: { uri: string }): Promise<boolean> {
    const result = filePost('file/create', uri);
    return result !== null;
}

export async function getImageSoucre({ imageId }: { imageId: string }): Promise<ImageSourcePropType> {
    return {
        uri: apiRoot + 'file/' + imageId,
        headers: {
            Authorization: 'Bearer ' + getIdToken()
        }
    }
}

export async function deleteImage({ imageId }: { imageId: string }) {
    return axiosDelete('file/delete/' + imageId);
}