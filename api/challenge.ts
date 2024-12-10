import { ChallengeItem, ChallengeItemMeta } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getUserIdAsync } from '@/utils/login';
import { getDateFromToday } from '@/utils/time';


export async function createChallenge2(
    { name, description }:
        { name: string, description: string }
): Promise<ChallengeItem | null> {
    return createChallenge({
        challengeInfo: {
            id: '',
            name: name,
            totalParticipants: 0,
            currentParticipants: 0,
            createdAt: '',
            participants: [],
            participantsRecords: [],
            dateStart: new Date(),
            dateEnd: getDateFromToday({ dayDiff: 30 }),
            description: description,
            state: 1
        }
    });
}

export async function createChallenge(
    { challengeInfo }:
        { challengeInfo: ChallengeItem }
): Promise<ChallengeItem | null> {
    return axiosPost('challenge/create', challengeInfo);
}


export async function getAllChallenges(): Promise<ChallengeItemMeta[] | null> {
    return axiosGet('challenge/all');
}

export async function getChallenge(
    { challengeId }:
        { challengeId: string }
): Promise<ChallengeItem | null> {
    return axiosGet('challenge/' + challengeId);
}

export async function participateChallenge(
    { challengeId }:
        { challengeId: string }
): Promise<ChallengeItem | null> {
    return axiosPost('challenge/' + challengeId + '/participate', {});
}

export async function addChallengeRecord(
    { challengeId, imageUri }:
        { challengeId: string, imageUri: string }
): Promise<ChallengeItem | null> {
    return null;
}


export async function setApproveState(
    { challengeId, recordId, approved }:
        { challengeId: string, recordId: string, approved: boolean }
): Promise<ChallengeItem | null> {
    return null;
}