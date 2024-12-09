import { Modal, TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert, ImageSourcePropType } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ChallengeItem, ChallengeRecoordItem, UserItemMeta } from '@/core/model';
import { getFileSource, repo } from '@/localApi/main';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { HorizontalLine } from '@/components/HorizontalLine';
import { ChallengeGallery } from '@/components/challenge/Gallery';
import { getChallengeReward, getMyProfile } from '@/localApi/user';
import { ChallengeModal } from '@/components/challenge/ChallengeModal';
import { setApproveProofShot, uploadProofShoot } from '@/localApi/challenge';
import { getDayDifference } from '@/utils/time';
import { ThemeButton } from '@/components/ThemeButton';

const OBJECTIVE_POINT = 100;
const TOTAL_CHALLENGE_DAY = 30;


export default function ChallengeRewardScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [totalPoint, setTotalPoint] = useState<number>(0);
    const [myApprovedCount, setMyApprovedCount] = useState<number>(0);
    const [myPoint, setMyPoint] = useState<number>(0);

    const [challengeCleared, setChallengeCleared] = useState<boolean>(false);
    const [challengeInfo, setChallengeInfo] = useState<ChallengeItem | null>(null);
    const [myProfileInfo, setMyProfileInfo] = useState<UserItemMeta | null>(null);



    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const updatePageInfo = async () => {
        // redirect to register page if user didn't registered to challenge
        const userInfo = await getMyProfile();
        setMyProfileInfo(userInfo);
        let participated = false;
        if (userInfo) {
            for (const myChallengeInfo of userInfo.challengeList) {
                if (myChallengeInfo.id === challengeId) {
                    participated = true;
                }
            }
        }
        if (!participated) {
            router.replace('/challenge');
            return;
        }

        const challengeInfo = await repo.challenges.getChallenge(challengeId);
        setChallengeInfo(challengeInfo);


        const currentTimestamp = Date.now();
        const endTimestamp = new Date(challengeInfo.dateEnd).getTime();
        if (currentTimestamp < endTimestamp) {
            router.replace('/challenge');
            return;
        }


        let challengePoint = 0;
        let my
        challengeInfo.participantsRecord.forEach((recoord) => {
            if (recoord.approved) {
                challengePoint += 1;
            }
            challengePoint += 1;
            if (recoord.userId === userInfo.id) {
                if (recoord.approved) {
                    //        myPoint += 1;
                }
                //      myPoint += 1;
            }
        })
        setTotalPoint(challengePoint);
        setMyPoint(myPoint);
        //setMyApprovedCount();
        setChallengeCleared(challengePoint >= 100);




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



    if (!challengeInfo || !myProfileInfo) {
        return <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <ActivityIndicator size="large"></ActivityIndicator>
        </View>
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.container_title}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>
                        {
                            challengeCleared ? "와우~! 챌린지 클리어!" : "챌린지를 완수하지 못했어요..."
                        }
                    </Text>

                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>

                    </Text>

                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>
                        환경을 위해 앞으로도 힘 내 주세요!
                    </Text>
                </View>

                <ThemeButton title="리워드 받기" onPress={() => {
                    getChallengeReward(challengeInfo.id);
                }}></ThemeButton>
            </ScrollView>


        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container_title: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
});
