import { updateDonation } from "@/api/donation";
import { DonationItem, UserItem } from "@/core/model";
import { deleteProfile, getProfile, updateProfile } from "@/api/user";
import { deleteImage } from "@/api/file";
import { login } from "@/utils/register";
import { createChallenge, getAllChallenges } from "./challenge";
import { getTimeFromToday } from "@/utils/time";


export async function initializeTestData({ userId, deleteUser }: { userId: string, deleteUser: boolean }) {
    await login({ idToken: userId });

    const challenges = await getAllChallenges();


    const userInfo = await getProfile({ userId });
    if (deleteUser) {
        if (userInfo) {
            deleteImage({ imageId: userInfo.thumbnailId });
            deleteProfile({ userId });
        }
    } else {
        if (userInfo) {
            updateProfile({
                userId: userInfo.id, update: (userId: UserItem) => {
                    userId.point = 100000;
                    return userId;
                }
            })
        }
    }

    // 북극곰
    await updateDonation(
        {
            donationId: '67559c02103d7fd345269a6b',
            update: (donationInfo: DonationItem) => {
                donationInfo.name = "북극곰 도와주기 🐻‍❄️"
                donationInfo.totalPoint = 100000;
                donationInfo.currentPoint = 48363;
                donationInfo.description = "🌡️ 지구온난화로 북극곰들이 살 곳을 잃어가고 있어요. 여러분의 후원금은 북극곰 서식지 보호와 연구에 사용됩니다! 함께 북극곰을 지켜주세요! 💙";
                return donationInfo;
            }
        });

    // 숲 복원
    await updateDonation(
        {
            donationId: '67559c57103d7fd345269a6d',
            update: (donationInfo: DonationItem) => {
                donationInfo.name = "숲 재건하기 🌳"
                donationInfo.totalPoint = 100000;
                donationInfo.currentPoint = 68963;
                donationInfo.description = "🌲 파괴된 숲을 다시 푸르게! 여러분의 후원금은 나무 심기와 숲 복원 프로젝트에 사용됩니다. 💚🌿";
                return donationInfo;
            }
        });
    // 바다 쓰레기 치우기
    await updateDonation(
        {
            donationId: '67559c93103d7fd345269a6f',
            update: (donationInfo: DonationItem) => {
                donationInfo.name = "바다 쓰레기 청소하기 🌊"
                donationInfo.totalPoint = 100000;
                donationInfo.currentPoint = 12903;
                donationInfo.description = "🚯 해양 쓰레기를 치우고, 바다 생물을 보호해주세요. 함께 맑고 푸른 바다를 되찾아봐요! 💙🐟";
                return donationInfo;
            }
        });
}