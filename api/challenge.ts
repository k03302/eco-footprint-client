import { ChallengeItem, ChallengeItemMeta, ChallengeRecordItem } from '@/core/model';
import { filePost, axiosPost, axiosGet, axiosPut, axiosDelete } from '@/utils/axios';
import { getTimeFromToday, hasDatePassed } from '@/utils/time';
import { updateImage, uploadImage } from '@/api/file';
import { getIdToken } from '@/utils/login';


export async function createChallenge2(
    { name, description }:
        { name: string, description: string }
): Promise<ChallengeItem | null> {
    return createChallenge({
        challengeInfo: {
            id: '',
            name: name,
            totalParticipants: 5,
            currentParticipants: 3,
            createdAt: (getTimeFromToday({ dayDiff: -30 }) / 1000).toString(),
            participants: [],
            participantRecords: [],
            dateStart: (getTimeFromToday({ dayDiff: -30 }) / 1000).toString(),
            dateEnd: (getTimeFromToday({ dayDiff: 0 }) / 1000).toString(),
            description: description,
            state: 1
        }
    });
}

export async function createChallenge(
    { challengeInfo }:
        { challengeInfo: ChallengeItem }
): Promise<ChallengeItem | null> {
    return axiosPost({ path: 'challenge/create', body: challengeInfo });
}


export async function getAllChallenges(): Promise<ChallengeItemMeta[] | null> {
    return axiosGet({ path: 'challenge/all' });
}

export async function getChallenge(
    { challengeId }:
        { challengeId: string }
): Promise<ChallengeItem | null> {
    return axiosGet({ path: 'challenge/' + challengeId });
}

export async function participateChallenge(
    { challengeId }:
        { challengeId: string }
): Promise<ChallengeItem | null> {
    return axiosPost({
        path: 'challenge/' + challengeId + '/participate',
        body: {},
        params: {
            challengeId: challengeId
        },
        onSuccess: () => { },
        onError: error => { console.log(error.response.status, error.response.message) }
    });
}

export async function addChallengeRecord(
    { challengeId, imageUri }:
        { challengeId: string, imageUri: string }
): Promise<ChallengeItem | null> {
    console.log('ok');


    const challengeInfo = await getChallenge({ challengeId });
    if (!challengeInfo) return null;

    const userId = getIdToken();
    if (!userId) return null;


    for (const record of challengeInfo.participantRecords) {
        if (record.userId === userId) {
            const timestamp = (new Date(record.date)).getTime();
            if (!hasDatePassed(timestamp)) {
                return null;
            }
        }
    }

    const imgInfo = await uploadImage({ uri: imageUri });

    if (!imgInfo) return null;

    const imageId = imgInfo.id;
    return axiosPost({
        path: `challenge/${challengeId}/add/${imageId}`,
        body: {},
        params: { challengeId, imageId },
        onSuccess: () => { },
        onError: error => { console.log(error.response.status) }
    })
}


export async function setApproveState(
    { challengeId, recordId, approved }:
        { challengeId: string, recordId: string, approved: boolean }
): Promise<ChallengeItem | null> {
    return axiosPut({
        path: `challenge/${challengeId}/record/${recordId}/approve`,
        body: {},
        params: { 'approve': approved },
        onSuccess: () => { },
        onError: error => { console.log(error.response.status) }
    });
}

export async function getChallengeReward(
    { challengeId }: { challengeId: string }
): Promise<ChallengeItem | null> {
    return axiosGet({
        path: `challenge/${challengeId}/clear`,
        params: {
            challengeId, userId: getIdToken()
        }
    })
}