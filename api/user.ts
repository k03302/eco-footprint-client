import { UserItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserId } from '@/utils/login';



export async function getProfile({ myProfile = false, userId = "" }:
    { myProfile?: boolean, userId?: string }
): Promise<UserItem | null> {
    if (!myProfile && !userId) return null;
    const id = myProfile ? await getUserId() : userId;
    if (!id) return null;

    const url = 'user/profile/' + id;
    const userInfo = await axiosGet(url);
    if (userInfo) return userInfo as UserItem;
    return null;
}

export async function updateProfile(updateInfo: UserItem): Promise<UserItem | null> {
    const url = 'user/profile';
    const userInfo = await axiosPut(url, updateInfo);
    if (userInfo) return userInfo as UserItem;
    return null;
}

export async function getPoint({ point, itemId }: { point: number, itemId: string }) {

}

export async function deleteProfile({ myProfile = false, userId = "" }:
    { myProfile?: boolean, userId?: string }): Promise<boolean> {
    if (!myProfile && !userId) return false;
    const id = myProfile ? await getUserId() : userId;
    if (!id) return false;

    const url = 'user/profile/delete/' + id;
    return await axiosDelete(url);
}
