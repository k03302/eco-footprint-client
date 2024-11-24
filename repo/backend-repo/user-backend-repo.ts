import { UserRepo } from "@/core/repository";
import { UserItem, NO_USER } from "@/core/model";
import { axiosPost, axiosPut, axiosGet, axiosDelete } from '@/utils/axios';


export class UserBackRepo implements UserRepo {
    async createUser(userItem: UserItem): Promise<UserItem> {
        return await axiosPost('/user/register', userItem) || NO_USER;
    }
    async getUserInfo(userId: string): Promise<UserItem> {
        return await axiosGet('/user/profile/' + userId) || NO_USER;
    }
    async updateUserInfo(userItem: UserItem): Promise<UserItem> {
        return await axiosPut('/user/profile', userItem) || NO_USER;
    }
    async deleteUser(userId: string): Promise<boolean> {
        return await axiosDelete('/user/delete/' + userId) || false;
    }
}