import { ChallengeItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserId } from '@/utils/login';


export async function createChallenge(challengeInfo: ChallengeItem): Promise<ChallengeItem | null> {
    return axiosPost('challenge/create', challengeInfo);
}

export async function getAllChallenges() {
    return axiosGet('challenge/all');
}

export async function getChallenge(challengeId: string) {
    return axiosGet('challenge/' + challengeId);
}

export async function participateChallenge(challengeId: string): Promise<ChallengeItem | null> {
    return axiosPost('challenge/' + challengeId + '/participate', {});
}

export async function addChallengeRecord(challengeId: string, recordId: string) {

}