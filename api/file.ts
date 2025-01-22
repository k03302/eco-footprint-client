import { FileData } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete, filePut } from '@/utils/axios';
import { getIdToken } from '@/utils/login';
import { ImageSourcePropType } from 'react-native';

const apiRoot = process.env.EXPO_PUBLIC_SERVER_API;

export async function uploadImage(
    { uri }:
        { uri: string }
): Promise<FileData | null> {
    return await filePost({ path: 'file/create', fileUri: uri })
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

export async function updateImage({ imageId, uri }: { imageId: string, uri: string }) {
    return await filePut({ path: 'file/update/' + imageId, fileUri: uri, params: { fileId: imageId } });
}

export async function deleteImage(
    { imageId }:
        { imageId: string }
): Promise<boolean> {
    return axiosDelete({ path: 'file/delete/' + imageId });
}