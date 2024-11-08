import { CouponRepo } from "@/core/repository";
import { CouponItem } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class CouponJsonRepo implements CouponRepo {
    private prefix: string = 'coupon_';

    // Helper function to generate the storage key
    private generateKey(couponId: string): string {
        return `${this.prefix}${couponId}`;
    }

    // Fetch a coupon by its ID
    async getCoupon(couponId: string): Promise<CouponItem> {
        const key = this.generateKey(couponId);
        const couponString = await AsyncStorage.getItem(key);
        if (!couponString) {
            throw new Error(`Coupon with ID ${couponId} not found.`);
        }
        return JSON.parse(couponString) as CouponItem;
    }

    // Generate a new coupon for a user based on a reward
    async getNewCoupon(userId: string, rewardId: string): Promise<CouponItem> {
        const newCoupon: CouponItem = {
            id: `${userId}_${rewardId}_${Date.now()}`, // Unique ID using userId, rewardId, and timestamp
            itemName: `Reward for ${rewardId}`,
            brandName: 'BrandX',
            thumbnailId: 'default_thumbnail',
            expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 30 days
            couponId: rewardId,
        };

        const key = this.generateKey(newCoupon.id);
        await AsyncStorage.setItem(key, JSON.stringify(newCoupon));
        return newCoupon;
    }

    // Update an existing coupon
    async updateCoupon(couponItem: CouponItem): Promise<CouponItem> {
        const key = this.generateKey(couponItem.id);
        const existingCoupon = await AsyncStorage.getItem(key);

        if (!existingCoupon) {
            throw new Error(`Coupon with ID ${couponItem.id} not found.`);
        }

        const updatedCoupon = { ...JSON.parse(existingCoupon), ...couponItem };
        await AsyncStorage.setItem(key, JSON.stringify(updatedCoupon));
        return updatedCoupon;
    }

    // Delete a coupon (optional method)
    async deleteCoupon(couponId: string): Promise<boolean> {
        const key = this.generateKey(couponId);
        const coupon = await AsyncStorage.getItem(key);
        if (!coupon) {
            throw new Error(`Coupon with ID ${couponId} not found.`);
        }
        await AsyncStorage.removeItem(key);
        return true;
    }
}

export default CouponJsonRepo;