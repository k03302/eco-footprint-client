import { Modal, TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert, ImageSourcePropType } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ChallengeItem, ChallengeRecoordItem, UserItemMeta } from '@/core/model';
import { getFileSource, repo } from '@/api/main';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { HorizontalLine } from '@/components/HorizontalLine';
import { ChallengeGallery } from '@/components/challenge/Gallery';
import { getMyProfile } from '@/api/user';
import { ChallengeModal } from '@/components/challenge/ChallengeModal';
import { setApproveProofShot, uploadProofShoot } from '@/api/challenge';
import { getDayDifference } from '@/utils/time';
import { ThemeButton } from '@/components/ThemeButton';

const OBJECTIVE_POINT = 100;
const TOTAL_CHALLENGE_DAY = 30;


export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [totalPoint, setTotalPoint] = useState<number>(0);


    const [showMyImageModal, setShowMyImageModal] = useState<boolean>(false);
    const [showMemImageModal, setShowMemImageModal] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [imgDate, setImgDate] = useState<Date | undefined>(undefined);
    const [memButtonTitle, setMemButtonTitle] = useState<string>('');
    const [selectedMemRecoord, setSelectedMemRecoord] = useState<ChallengeRecoordItem | null>(null);
    const [modalImage, setModalImage] = useState<ImageSourcePropType | undefined>(undefined);




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
            router.replace({ pathname: '/challenge/register/[id]', params: { id: challengeId } });
            return;
        }

        const challengeInfo = await repo.challenges.getChallenge(challengeId);
        setChallengeInfo(challengeInfo);

        let approvedCount = 0;
        challengeInfo.participantsRecord.forEach((recoord) => {
            if (recoord.approved) {
                approvedCount += 1;
            }
        })
        setTotalPoint(challengeInfo.participantsRecord.length + approvedCount);
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



    const takePhotoAndUpload = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('인증을 위해 카메라 권한이 필요합니다.');
            return;
        }

        // Launch the camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Allow the user to crop the image
            quality: 1, // Set the image quality (1 is best)
        });

        if (!result.canceled) {
            await uploadProofShoot(challengeId, result.assets[0].uri);
        }

        setHasToUpdate(true);
        setShowMyImageModal(false);
    };

    const toggleApproveState = async (recoord: ChallengeRecoordItem) => {
        const newApprovedState = !recoord.approved;
        await setApproveProofShot(challengeId, recoord.recordId, newApprovedState);
        setHasToUpdate(true);
        setShowButton(false);
        setShowMyImageModal(false);
    }


    const onMyTodayImagePress = (recoord?: ChallengeRecoordItem) => {
        if (recoord) {
            setModalImage(getFileSource(recoord.recordId));
            setImgDate(new Date(recoord.uploadDate));
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
        }
        setShowMyImageModal(true);
        setShowButton(true);
    }

    const onMemTodayImagePress = (recoord?: ChallengeRecoordItem) => {
        if (recoord) {
            setModalImage(getFileSource(recoord.recordId));
            setImgDate(new Date(recoord.uploadDate));
            setShowButton(true);
            setMemButtonTitle(recoord.approved ? '승인 해제하기' : '인증사진 승인하기');
            setSelectedMemRecoord(recoord);
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
            setShowButton(false);
            setSelectedMemRecoord(null);
        }
        setShowMemImageModal(true);
    }

    const onMyDatedImagePress = (recoord?: ChallengeRecoordItem) => {
        if (recoord) {
            setModalImage(getFileSource(recoord.recordId));
            setImgDate(new Date(recoord.uploadDate));
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
        }

        setShowButton(false);
        setShowMyImageModal(true);
    }

    const onMemDatedImagePress = (recoord?: ChallengeRecoordItem) => {
        if (recoord) {
            setModalImage(getFileSource(recoord.recordId));
            setImgDate(new Date(recoord.uploadDate));
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
        }
        setShowButton(false);
        setShowMemImageModal(true);
    }



    if (!challengeInfo || !myProfileInfo) {
        return <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <ActivityIndicator size="large"></ActivityIndicator>
        </View>
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.container_title}>
                    <HorizontalLine />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>{challengeInfo.name}</Text>
                    <Text style={{ fontSize: 18, margin: 20 }}>{challengeInfo.description}</Text>
                    <HorizontalLine />
                </View>
                <View style={styles.container_progress}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>현재 챌린지 진행률</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Progress.Bar
                            progress={totalPoint / OBJECTIVE_POINT}
                            width={300}
                            height={30}
                            borderRadius={8}
                            color="#849C6A"
                            style={styles.progressBar}
                            borderWidth={0}

                            unfilledColor='lightgray'
                        />
                    </View>
                    <Text> {totalPoint} / {OBJECTIVE_POINT} </Text>
                    <HorizontalLine />
                </View>
                <View style={styles.container_progress}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>챌린지 마감기한</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Progress.Bar
                            progress={getDayDifference(new Date(), new Date(challengeInfo.dateStart)) / TOTAL_CHALLENGE_DAY}
                            width={300}
                            height={30}
                            borderRadius={8}
                            color="#849C6A"
                            style={styles.progressBar}
                            borderWidth={0}

                            unfilledColor='lightgray'
                        />
                    </View>
                    <Text>챌린지 마감 {getDayDifference(new Date(), new Date(challengeInfo.dateStart))}일 전</Text>
                    <HorizontalLine />
                </View>
                <View style={styles.recordcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>나의 챌린지 기록</Text>
                    <ChallengeGallery yes={true} userInfo={myProfileInfo} challengeInfo={challengeInfo}
                        onTodayImagePress={onMyTodayImagePress} onDatedImagePress={onMyDatedImagePress} />
                    <View style={{ alignItems: 'center' }}>
                        <ThemeButton title="오늘 챌린지 기록하기" onPress={takePhotoAndUpload}></ThemeButton>
                    </View>
                    <HorizontalLine />
                </View>
                <View style={styles.recordcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>멤버의 기록을 확인하세요!</Text>
                    {
                        challengeInfo.participants.map((participant, index) => {
                            if (participant.id === myProfileInfo.id) {
                                return <View key={participant.id + index}></View>
                            }
                            return <ChallengeGallery
                                yes={false}
                                userInfo={participant}
                                challengeInfo={challengeInfo}
                                onTodayImagePress={onMemTodayImagePress}
                                onDatedImagePress={onMemDatedImagePress}
                                key={participant.id + index}
                            ></ChallengeGallery>
                        })
                    }
                </View>
            </ScrollView>
            <ChallengeModal
                modalVisible={showMyImageModal}
                setModalVisible={setShowMyImageModal} imgSource={modalImage}
                buttonTitle="새로운 사진 인증하기" onPress={takePhotoAndUpload} showButton={showButton}
                imgDate={imgDate} />
            <ChallengeModal
                modalVisible={showMemImageModal}
                setModalVisible={setShowMemImageModal} imgSource={modalImage}
                buttonTitle={memButtonTitle} onPress={async () => {
                    selectedMemRecoord && toggleApproveState(selectedMemRecoord);
                }} showButton={showButton}
                imgDate={imgDate} />


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
    container_progress: {
        margin: 10,
        alignItems: 'center'
    },
    recordcontainer: {
        margin: 20
    },
    container_button: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },
    text_1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    goalContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#FAF7F7',
        borderRadius: 10,
        height: 65
    },
    goalrowContainer: {
        flexDirection: 'row',
    },


    //modal
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
        marginTop: 230,
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    failModalView: {
        marginTop: 230,
        margin: 30,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'black',
    },
    modalTextStyle: {
        color: '#17191c',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50
    },
    image_modal: {
        width: 300,
        height: 320,
    },
    progressBar: {
        marginBottom: 5,
    },
});

function useCallback(arg0: () => void, arg1: never[]) {
    throw new Error('Function not implemented.');
}
function setAllChallList(arg0: import("@/core/model").ChallengeItemMeta[]) {
    throw new Error('Function not implemented.');
}

