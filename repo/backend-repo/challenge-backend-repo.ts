import { ChallengeRepo } from "@/core/repository";
import { ChallengeItem, ChallengeItemMeta, UserItemMeta, ChallengeRecoordItem } from "@/core/model";

export class ChallengeBackRepo implements ChallengeRepo {
    createChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem> {
        throw new Error("Method not implemented.");
    }
    getChallenge(challengeId: string): Promise<ChallengeItem> {
        throw new Error("Method not implemented.");
    }
    getAllChallenges(): Promise<ChallengeItemMeta[]> {
        throw new Error("Method not implemented.");
    }
    updateChallenge(challengeItem: ChallengeItem): Promise<ChallengeItem> {
        throw new Error("Method not implemented.");
    }
    deleteChallenge(challengeId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}