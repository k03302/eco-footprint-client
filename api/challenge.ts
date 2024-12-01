import AsyncStorage from '@react-native-async-storage/async-storage';
import { repo } from '@/api/main';
import axios from 'axios';
import { ChallengeItem, NO_USER, UserItem } from '@/core/model';
import { getMyProfile } from '@/api/user';
import { hasDatePassed } from '@/utils/time';
import { getUserId } from './auth';

const MAX_DEFAULT_POINT = 3;
const MIN_DEFAULT_POINT = 1;
const CHALLENGE_REWARD_POINT = 100;
const AD_REWARD_POINT = 20;


export async function participateChallenge(challengeId: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;

        const challengeInfo = await repo.challenges.getChallenge(challengeId);
        if (challengeInfo.totalParticipants <= challengeInfo.currentParticipants) return false;

        challengeInfo.currentParticipants += 1;
        challengeInfo.participants.push({
            username: userInfo.username,
            id: userInfo.id,
            thumbnailId: userInfo.thumbnailId
        });
        userInfo.challengeList.push({
            id: challengeInfo.id,
            name: challengeInfo.name,
            totalParticipants: challengeInfo.totalParticipants,
            currentParticipants: challengeInfo.currentParticipants,
            dateEnd: challengeInfo.dateEnd
        });

        await repo.users.updateUserInfo(userInfo);
        await repo.challenges.updateChallenge(challengeInfo);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export async function createChallenge(name: string, description: string): Promise<ChallengeItem | null> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return null;

        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 30);

        const challengeInfo = await repo.challenges.createChallenge({
            id: userInfo.username + Date.now(),
            name: name,
            totalParticipants: 4,
            currentParticipants: 1,
            createdBy: userInfo.id,
            participants: [{
                username: userInfo.username,
                id: userInfo.id,
                thumbnailId: userInfo.thumbnailId
            }],
            participantsRecord: [],
            dateStart: currentDate,
            dateEnd: futureDate,
            description: description
        });

        userInfo.challengeList.push({
            id: challengeInfo.id,
            name: challengeInfo.name,
            totalParticipants: challengeInfo.totalParticipants,
            currentParticipants: challengeInfo.currentParticipants,
            dateEnd: challengeInfo.dateEnd
        });

        await repo.users.updateUserInfo(userInfo);

        return challengeInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function uploadProofShoot(challengeId: string, imgUri: string): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;
        const challengeInfo = await repo.challenges.getChallenge(challengeId);


        const recordId = `${userInfo.id}${challengeId}${Date.now()}`
        await repo.files.uploadFile({
            id: recordId,
            name: recordId,
            fileUri: imgUri
        });

        const myUserId = await getUserId();

        let replacedRecoord = false;
        for (const recoord of challengeInfo.participantsRecord) {
            if (myUserId === recoord.userId) {
                const uploadDate = new Date(recoord.uploadDate);
                if (!hasDatePassed(uploadDate)) {
                    recoord.userId = userInfo.id;
                    recoord.recordId = recordId;
                    recoord.uploadDate = new Date();

                    replacedRecoord = true;
                    break;
                }
            }
        }

        if (!replacedRecoord) {
            challengeInfo.participantsRecord.push({
                userId: userInfo.id,
                recordId: recordId,
                uploadDate: new Date(),
                approved: false
            })
        }

        await repo.challenges.updateChallenge(challengeInfo);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function setApproveProofShot(challengeId: string, recoordId: string, isApproved: boolean): Promise<boolean> {
    try {
        const userInfo = await getMyProfile();
        if (userInfo === NO_USER) return false;
        const challengeInfo = await repo.challenges.getChallenge(challengeId);
        for (const recoord of challengeInfo.participantsRecord) {
            if (recoord.recordId === recoordId) {
                if (recoord.approved === isApproved) return false;
                recoord.approved = isApproved;
                break;
            }
        }
        await repo.challenges.updateChallenge(challengeInfo);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}