import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Text, View } from 'react-native';
import { adService } from '@/api/ad';


export default function ViewAd({ handleAdClose }: { handleAdClose?: () => void }) {
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [disabled]);

    adService.registerLoadedHandler(() => { setDisabled(false); });
    adService.registerEarnedHandler(({ amount, type }) => {
        setDisabled(true);
        handleAdClose && handleAdClose();
        adService.loadAd();
    });

    // 광고 열기
    const openAd = () => {
        adService.showAd(true);
        setDisabled(true);
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={openAd} disabled={disabled} title="광고 보기" />
        </View>
    );

}