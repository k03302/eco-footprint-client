import React, { useEffect, useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as Device from 'expo-device'
import {
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';


/*
const adUnitId: string = __DEV__ || Device.osName !== 'Android'
    ? TestIds.REWARDED
    : process.env.EXPO_PUBLIC_ADMOB_ANDROID_API_KEY || "";
*/

const adUnitId: string = "ca-app-pub-5756122103903893/4303746169";

export default function ViewAd() {
    const [loaded, setLoaded] = useState(false);
    const rewardedRef = useRef<RewardedAd | null>(null);

    useEffect(() => {
        // 광고 생성
        const rewarded = RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true, // 맞춤형 광고 여부
            keywords: ['fashion', 'clothing'], // 광고 카테고리 고르기
        });
        //생성된 광고는 ref 변수로 관리
        rewardedRef.current = rewarded;

        // 광고 로드 이벤트 리스너
        const unsubscribeLoaded = rewarded.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                setLoaded(true);
            },
        );

        // 라워드를 받았을 때 이벤트 리스너
        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                rewarded.removeAllListeners();
                console.log(reward.amount);
            },
        );

        rewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
        };
    }, []);

    // 광고 열기
    const openAd = () => {
        if (rewardedRef.current !== null) {
            rewardedRef.current.show();
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={openAd} disabled={!loaded} title="광고 보기" />
        </View>
    );

}