import { UserItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getIdToken } from '@/utils/login';
import * as Crypto from 'expo-crypto';

const secret = 'secret';

export async function getProfile(
    { myProfile = false, userId = "" }:
        { myProfile?: boolean, userId?: string }
): Promise<UserItem | null> {
    if (!myProfile && !userId) return null;
    const id = myProfile ? getIdToken() : userId;
    if (!id) return null;

    const url = 'user/profile/' + id;
    const userInfo = await axiosGet({ path: url, onSuccess: data => { console.log(data) } });
    return userInfo;
}

export async function updateProfile(
    { myProfile = false, userId = "", update }:
        { myProfile?: boolean, userId?: string, update: (userInfo: UserItem) => UserItem }
): Promise<UserItem | null> {
    const userInfo = await getProfile({ myProfile, userId });
    if (!userInfo) return null;
    const updatedInfo = update(userInfo);
    return axiosPut({ path: 'user/profile', body: updatedInfo });
}

export async function getItemPoint(
    { point }:
        { point: number }
): Promise<UserItem | null> {
    const userId = getIdToken();
    const itemId = Date.now();
    if (!userId) return null;
    const signatureMessage = `${userId}_${itemId}_${secret}`;
    const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        signatureMessage
    );

    console.log(signatureMessage);

    return axiosPost({
        path: 'user/point',
        body: {},
        params: {
            point, itemId, signature
        }
    });

}

// export async function getItemPoint2(
//     { point }:
//         { point: number }
// ): Promise<UserItem | null> {
//     return updateProfile({
//         myProfile: true, update: (userInfo: UserItem) => {
//             userInfo.point += point;
//             return userInfo;
//         }
//     })
// }

export async function deleteProfile(
    { myProfile = false, userId = "" }:
        { myProfile?: boolean, userId?: string }
): Promise<boolean> {
    if (!myProfile && !userId) return false;
    const id = myProfile ? getIdToken() : userId;
    if (!id) return false;

    const url = 'user/delete/' + id;
    return await axiosDelete({ path: url });
}
