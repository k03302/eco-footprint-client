import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { DonationItem, DonationItemMeta, UserItem } from '@/core/model';
import { adService } from '@/service/ad';
import { useIsFocused } from '@react-navigation/native';
import { DonationUnit } from '@/components/donation/DonationUnit';
import { PointDisplay } from '@/components/PointDisplay';
import { DonationModal } from '@/components/donation/DonationModal';
import { getProfile } from '@/api/user';
import { router } from 'expo-router';
import { getAllDonations } from '@/api/donation';


export default function DonationScreen() {
    const [fundraisingList, setFundraisingList] = useState<DonationItemMeta[] | null>(null);
    const [userPoint, setUserPoint] = useState<number>(0);
    const [selectedDonationInfo, setSelectedDonationInfo] = useState<DonationItem | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);

    const onFetchError = () => {
        Alert.alert('에러가 발생했습니다.');
        router.push('/map');
    }

    const updatePageInfo = async () => {
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }
        const donationList = await getAllDonations();
        const userInfo = await getProfile({ myProfile: true });
        if (!donationList || !userInfo) {
            onFetchError();
            return;
        }
        setFundraisingList(donationList);
        setUserPoint(userInfo.point);
        console.log(donationList);
    }

    useEffect(() => {
        if (!isFocused) return;
        updatePageInfo();
    }, [isFocused]);

    useEffect(() => {
        if (!hasToUpdate) return;
        updatePageInfo().then(() => {
            setHasToUpdate(false);
        });
    }, [hasToUpdate]);


    const onDonationSelected = (donationInfo: DonationItem) => {
        setSelectedDonationInfo(donationInfo);
        setModalVisible(true);
    }

    const earnedHandler = () => {
        console.log('earned');
        setHasToUpdate(true);
    }


    if (!fundraisingList) {
        return <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <ActivityIndicator size="large"></ActivityIndicator>
        </View>
    }


    return (
        <View style={styles.container}>
            <View style={styles.pointdisplay}>
                <PointDisplay pointAmount={userPoint} displaySizeLevel={2} pointAnimationOption={0}></PointDisplay>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
                <View style={styles.donationcontainer}>
                    {
                        fundraisingList.map((fundraisingInfo, index) => {
                            if (fundraisingInfo.currentPoint >= fundraisingInfo.totalPoint) {
                                return <View key={index}></View>
                            }
                            return <DonationUnit
                                donationMetaInfo={fundraisingInfo}
                                key={index}
                                onSelected={onDonationSelected}
                            ></DonationUnit>
                        })
                    }
                </View>
            </ScrollView>
            {
                selectedDonationInfo && <DonationModal modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    donationInfo={selectedDonationInfo}
                    earnedHandler={earnedHandler}
                ></DonationModal>
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'forestgreen'
    },
    donationcontainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointdisplay: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    }
});
