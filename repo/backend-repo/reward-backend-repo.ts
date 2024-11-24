import { RewardRepo } from "@/core/repository";
import { RewardItemMeta, RewardItem, NO_REWARD } from "@/core/model";
import { axiosPost, axiosPut, axiosGet, axiosDelete } from '@/utils/axios';


export class RewardBackRepo implements RewardRepo {
    async getAllRewards(): Promise<RewardItemMeta[]> {
        return (await axiosGet('reward/all')) || [];
    }
    async getRewardInfo(rewardId: string): Promise<RewardItem> {
        return (await axiosGet('reward/' + rewardId)) || NO_REWARD;
    }
    async addReward(rewardItem: RewardItem): Promise<RewardItem> {
        return (await axiosPost('reward/create', rewardItem)) || NO_REWARD;
    }

}