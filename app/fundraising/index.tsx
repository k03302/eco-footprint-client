import { Modal, Text, TouchableOpacity, ImageBackground, ScrollView, Image, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { repo } from '@/localApi/main';
import { DonationItem, DonationItemMeta, NO_DONATION, NO_USER, UserItem } from '@/core/model';
import { adService } from '@/service/ad';
import { useIsFocused } from '@react-navigation/native';
import { DonationUnit } from '@/components/donation/DonationUnit';
import { getMyProfile, participateDonation } from '@/localApi/user';
import { PointDisplay } from '@/components/PointDisplay';
import { DonationModal } from '@/components/donation/DonationModal';


export default function DonationScreen() {
    const [fundraisingList, setFundraisingList] = useState<DonationItemMeta[] | null>(null);
    const [userPoint, setUserPoint] = useState<number>(0);
    const [selectedDonationInfo, setSelectedDonationInfo] = useState<DonationItem>(NO_DONATION);
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const updatePageInfo = async () => {
        if (!adService.isAdLoaded() && !adService.isAdOnLoading()) {
            adService.loadAd();
        }
        const donationList = await repo.donations.getAllDonations();
        setFundraisingList(donationList);
        const newPoint = (await getMyProfile()).point;
        setUserPoint(newPoint);
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
                <PointDisplay pointAmount={userPoint} displaySizeLevel={2} pointAnimationOption={2}></PointDisplay>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
                <View style={styles.donationcontainer}>
                    {
                        fundraisingList.map((fundraisingInfo, index) => {
                            if (fundraisingInfo.currentPoint >= fundraisingInfo.targetPoint) {
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
            <DonationModal modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                donationInfo={selectedDonationInfo}
                earnedHandler={earnedHandler}
            ></DonationModal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'white'
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
