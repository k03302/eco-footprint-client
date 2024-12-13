import { Modal, TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert, ImageSourcePropType } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ChallengeItem, ChallengeRecordItem, UserItem, UserItemMeta } from '@/core/model';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { useIsFocused } from '@react-navigation/native';
import { HorizontalLine } from '@/components/HorizontalLine';
import { ChallengeGallery } from '@/components/challenge/Gallery';
import { ChallengeModal } from '@/components/challenge/ChallengeModal';
import { getDayDifference } from '@/utils/time';
import { ThemeButton } from '@/components/ThemeButton';
import { getProfile } from '@/api/user';
import { addChallengeRecord, getChallenge, setApproveState } from '@/api/challenge';
import { getImageSource } from '@/api/file';

const OBJECTIVE_POINT = 100;
const TOTAL_CHALLENGE_DAY = 30;


export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [totalPoint, setTotalPoint] = useState<number>(0);

    const [dayLeft, setDayLeft] = useState<number>(0);
    const [showMyImageModal, setShowMyImageModal] = useState<boolean>(false);
    const [showMemImageModal, setShowMemImageModal] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [imgDate, setImgDate] = useState<Date | undefined>(undefined);
    const [memButtonTitle, setMemButtonTitle] = useState<string>('');
    const [selectedMemRecord, setSelectedMemRecord] = useState<ChallengeRecordItem | null>(null);
    const [modalImage, setModalImage] = useState<ImageSourcePropType | undefined>(undefined);




    const [challengeInfo, setChallengeInfo] = useState<ChallengeItem | null>(null);
    const [myProfileInfo, setMyProfileInfo] = useState<UserItem | null>(null);

    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const onFetchError = () => {
        Alert.alert('에러가 발생했어요.');
        router.back();
    }

    const updatePageInfo = async () => {
        // redirect to register page if user didn't registered to challenge
        const userInfo = await getProfile({ myProfile: true });
        const challInfo = await getChallenge({ challengeId });
        if (!userInfo || !challInfo) {
            onFetchError();
            return;
        }

        setMyProfileInfo(userInfo);
        setChallengeInfo(challInfo);

        setDayLeft(getDayDifference({ from: Date.now(), to: Number(challInfo.dateEnd) * 1000 }));
        let participated = false;
        for (const participant of challInfo.participants) {
            if (participant.id = userInfo.id) {
                participated = true;
                break;
            }
        }
        if (!participated) {
            router.replace({ pathname: '/challenge/register/[id]', params: { id: challengeId } });
            return;
        }


        let approvedCount = 0;
        challInfo.participantRecords.forEach((record) => {
            if (record.approved) {
                approvedCount += 1;
            }
        })
        setTotalPoint(challInfo.participantRecords.length + approvedCount);
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
            const uploadResult = await addChallengeRecord({ challengeId: challengeId, imageUri: result.assets[0].uri });
            //console.log(uploadResult);
        }

        setHasToUpdate(true);
        setShowMyImageModal(false);
    };

    const toggleApproveState = async (record: ChallengeRecordItem) => {
        const approved = !record.approved;
        const recordId = record.id;
        await setApproveState({ challengeId, recordId, approved });
        setHasToUpdate(true);
        setShowButton(false);
        setShowMyImageModal(false);
    }


    const onMyTodayImagePress = (record?: ChallengeRecordItem) => {
        if (record) {
            setModalImage(getImageSource({ imageId: record.imageId }));
            setImgDate(new Date(record.date));
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
        }
        setShowMyImageModal(true);
        setShowButton(true);
    }

    const onMemTodayImagePress = (record?: ChallengeRecordItem) => {
        if (record) {
            setModalImage(getImageSource({ imageId: record.imageId }));
            setImgDate(new Date(record.date));
            setShowButton(true);
            setMemButtonTitle(record.approved ? '승인 해제하기' : '인증사진 승인하기');
            setSelectedMemRecord(record);
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
            setShowButton(false);
            setSelectedMemRecord(null);
        }
        setShowMemImageModal(true);
    }

    const onMyDatedImagePress = (record?: ChallengeRecordItem) => {
        if (record) {
            setModalImage(getImageSource({ imageId: record.imageId }));
            setImgDate(new Date(record.date));
        } else {
            setModalImage(undefined);
            setImgDate(undefined);
        }

        setShowButton(false);
        setShowMyImageModal(true);
    }

    const onMemDatedImagePress = (record?: ChallengeRecordItem) => {
        if (record) {
            setModalImage(getImageSource({ imageId: record.imageId }));
            setImgDate(new Date(record.date));
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
                            progress={(TOTAL_CHALLENGE_DAY - dayLeft) / TOTAL_CHALLENGE_DAY}
                            width={300}
                            height={30}
                            borderRadius={8}
                            color="#849C6A"
                            style={styles.progressBar}
                            borderWidth={0}

                            unfilledColor='lightgray'
                        />
                    </View>
                    <Text>챌린지 마감 {dayLeft}일 전</Text>
                    <HorizontalLine />
                </View>
                <View style={styles.recordcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>나의 챌린지 기록</Text>
                    <ChallengeGallery userInfo={myProfileInfo} challengeInfo={challengeInfo}
                        onTodayImagePress={onMyTodayImagePress} onDatedImagePress={onMyDatedImagePress} />
                    <View style={{ alignItems: 'center' }}>
                        <ThemeButton title="오늘 챌린지 기록하기" onPress={takePhotoAndUpload}></ThemeButton>
                    </View>
                    <HorizontalLine />
                </View>
                <View style={styles.recordcontainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>멤버의 기록을 확인하세요!</Text>
                    {
                        challengeInfo.participants
                            .map((participant, index) => {
                                return <ChallengeGallery
                                    userInfo={participant}
                                    challengeInfo={challengeInfo}
                                    onTodayImagePress={onMemTodayImagePress}
                                    onDatedImagePress={onMemDatedImagePress}
                                    key={index}
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
                    selectedMemRecord && toggleApproveState(selectedMemRecord);
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

