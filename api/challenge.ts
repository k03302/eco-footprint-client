import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { getLoggedInPlatform } from '@/api/auth'
import { ChallengeItem, UserItem } from '@/core/model';
import { useRenderStore } from '@/store/useRenderStore';
import { getUserId } from './user';


const MAX_DEFAULT_POINT = 3;
const MIN_DEFAULT_POINT = 1;
const CHALLENGE_REWARD_POINT = 100;
const AD_REWARD_POINT = 20;


export async function participateChallenge(challengeId: string): Promise<ChallengeItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;

    const challengeInfo = await repo.challenges.getChallenge(challengeId);
    if (challengeInfo.totalParticipants <= challengeInfo.currentParticipants) return null;

    challengeInfo.currentParticipants += 1;
    challengeInfo.participants.push({
        name: userInfo.name,
        id: userInfo.id,
        thumbnailId: userInfo.thumbnailId
    });
    userInfo.chellengeList.push({
        id: challengeInfo.id,
        name: challengeInfo.name,
        totalParticipants: challengeInfo.totalParticipants,
        currentParticipants: challengeInfo.currentParticipants,
        dateEnd: challengeInfo.dateEnd
    });

    await repo.users.updateUserInfo(userInfo);
    await repo.challenges.updateChallenge(challengeInfo);

    return challengeInfo;
}

export async function createChallenge(name: string, type: string, description: string): Promise<ChallengeItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;

    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);

    const challengeInfo = await repo.challenges.createChallenge({
        id: userInfo.name + Date.now(),
        name: name,
        type: type,
        totalParticipants: 4,
        currentParticipants: 1,
        createdBy: userInfo.id,
        participants: [{
            name: userInfo.name,
            id: userInfo.id,
            thumbnailId: userInfo.thumbnailId
        }],
        participantsRecord: [],
        dateStart: currentDate,
        dateEnd: futureDate,
        description: description
    });

    userInfo.chellengeList.push({
        id: challengeInfo.id,
        name: challengeInfo.name,
        totalParticipants: challengeInfo.totalParticipants,
        currentParticipants: challengeInfo.currentParticipants,
        dateEnd: challengeInfo.dateEnd
    });

    await repo.users.updateUserInfo(userInfo);

    return challengeInfo;
}


export async function uploadProofShoot(challengeId: string, imgUri: string): Promise<ChallengeItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;
    const challengeInfo = await repo.challenges.getChallenge(challengeId);


    const recordId = `${userId}${challengeId}${Date.now()}`
    await repo.files.updateFile({
        id: recordId,
        name: recordId,
        fileUri: imgUri
    });

    challengeInfo.participantsRecord.push({
        userId: userId,
        recordId: recordId,
        uploadDate: new Date(),
        approved: false
    })

    await repo.challenges.updateChallenge(challengeInfo);
    return challengeInfo;
}

export async function approveProofShot(challengeId: string, recoordId: string): Promise<ChallengeItem | null> {
    const userId = await getUserId();
    if (!userId) return null;
    const userInfo = await repo.users.getUserInfo(userId);
    if (!userInfo) return null;
    const challengeInfo = await repo.challenges.getChallenge(challengeId);
    for (const recoord of challengeInfo.participantsRecord) {
        if (recoord.recordId === recoordId) {
            if (recoord.approved) return null;
            recoord.approved = true;
            break;
        }
    }
    await repo.challenges.updateChallenge(challengeInfo);
    return challengeInfo;
}