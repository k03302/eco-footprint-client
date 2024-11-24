import { Modal, TouchableOpacity, ScrollView, Image, Text, View, StyleSheet, ActivityIndicator, Alert, ImageSourcePropType } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ChallengeItem, ChallengeRecoordItem, UserItemMeta } from '@/core/model';
import { repo, util } from '@/service/main';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons';


const DrawLine = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image source={require("@/assets/images/line.png")}
                style={{ width: 325, height: 1, marginTop: 15, borderRadius: 10 }} />
        </View>
    );
};

const ChallengeImage = ({ imgSource, approved }: { imgSource: ImageSourcePropType, approved: boolean }) => {
    return <View style={styles.imageWrapper}>
        <Image
            source={imgSource} // Replace with your image URI
            style={styles.image}
        />
        <MaterialIcons
            name="star"
            size={24}
            color={approved ? "gold" : "gray"}
            style={styles.icon}
        />
    </View>
}

const ChallengeImageTouchable = ({ onPress, imgSource, approved }: { onPress: () => void, imgSource: ImageSourcePropType, approved: boolean }) => {
    return <TouchableOpacity onPress={onPress}>
        <ChallengeImage imgSource={imgSource} approved={approved}></ChallengeImage>
    </TouchableOpacity>
}

const MyChallengeGallery = ({ userInfo, challengeItem }: {
    userInfo: UserItemMeta, challengeItem: ChallengeItem
}) => {
    const challengeRecoords = challengeItem.participantsRecord;
    const myRecoords = challengeRecoords.filter((recoord) => {
        return recoord.userId === userInfo.id
    }).sort((a, b) => {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    })
    const first4 = myRecoords.slice(0, 4);

    return (
        <View>
            <Image source={require("@/assets/images/user.png")}
                style={{ width: 38, height: 38, marginTop: 10, marginBottom: 5, marginLeft: 5 }} />
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
                    <Text style={{ marginLeft: 10 }}> </Text>
                    {
                        // first4.map((recoord, index) => {
                        //     return <ChallengeImage imgSource={util.getFileSource(recoord.recordId)}
                        //         approved={recoord.approved} key={index}></ChallengeImage>
                        // })
                    }
                </ScrollView>
            </View>
        </View>
    );
};



const MemberChallengeGallery = ({ userInfo, challengeItem, setChallengeItem }: {
    userInfo: UserItemMeta, challengeItem: ChallengeItem,
    setChallengeItem: React.Dispatch<React.SetStateAction<ChallengeItem | null>>
}) => {
    const [isModalVisible, setisModalVisible] = useState<boolean>(false);
    const [selectedRecoord, setSelectedRecoord] = useState<ChallengeRecoordItem | null>(null);

    const approveHandler = () => {
        setisModalVisible(false);
        for (const recoord of challengeItem.participantsRecord) {
            if (recoord.uploadDate === selectedRecoord?.uploadDate) {
                recoord.approved = true;
                setChallengeItem(challengeItem);
                return;
            }
        }

    }

    const challengeRecoords = challengeItem.participantsRecord;
    const myRecoords = challengeRecoords.filter((recoord) => {
        return recoord.userId === userInfo.id
    }).sort((a, b) => {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    })
    const first4 = myRecoords.slice(0, 4);

    return (
        <View>
            <Image source={require("@/assets/images/user.png")}
                style={{ width: 38, height: 38, marginTop: 10, marginBottom: 5, marginLeft: 5 }} />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginLeft: 10 }}> </Text>
                {
                    // first4.map((recoord, index) => {
                    //     if (recoord.approved) {
                    //         return <ChallengeImage imgSource={util.getFileSource(recoord.recordId)}
                    //             approved={true}></ChallengeImage>
                    //     }
                    //     return <ChallengeImageTouchable imgSource={util.getFileSource(recoord.recordId)}
                    //         onPress={() => {
                    //             setisModalVisible(true);
                    //             setSelectedRecoord(recoord);
                    //         }} approved={false} key={index}>

                    //     </ChallengeImageTouchable>
                    // })
                }
            </View>
            <Modal
                animationType="slide"
                visible={isModalVisible}
                transparent={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* {selectedRecoord ? <>
                            <Image source={util.getFileSource(selectedRecoord?.recordId)}
                                style={[styles.image_modal, { resizeMode: 'contain' }]} />
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={approveHandler}>
                                    <Image source={require("@/assets/images/agreechallengebutton.png")}
                                        style={{ width: 265, height: 41, marginTop: 50, marginLeft: 3 }} />
                                </TouchableOpacity>
                            </View>
                        </> : <></>} */}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default function ChallengeScreen() {
    const challengeId = useLocalSearchParams().id as string;
    const [challengeItem, setChallengeItem] = useState<ChallengeItem | null>(null);
    const [myProfileInfo, setMyProfileInfo] = useState<UserItemMeta | null>(null);


    useEffect(() => {
        (async () => {

            // // redirect to register page if user didn't registered to challenge
            // const userInfo = await getMyProfile();
            // setMyProfileInfo(userInfo);
            // let participated = false;
            // if (userInfo) {
            //     for (const myChallengeInfo of userInfo.chellengeList) {
            //         if (myChallengeInfo.id === challengeId) {
            //             participated = true;
            //         }
            //     }
            // }
            // if (!participated) {
            //     router.replace({ pathname: '/challenge/register/[id]', params: { id: challengeId } });
            //     return;
            // }

            // const challengeInfo = await repo.challenges.getChallenge(challengeId);
            // setChallengeItem(challengeInfo);
        })();
    }, []);


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
            // await uploadProofShoot(challengeId, result.assets[0].uri);
        }
    };

    if (!challengeItem || !myProfileInfo) {
        return <ActivityIndicator size="large"></ActivityIndicator>
    }
    console.log(challengeItem.currentProgress);
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container_title}>
                    <DrawLine />
                    <Text style={{ fontSize: 22, fontWeight: 'bold', margin: 20 }}>{challengeItem.type}</Text>
                    <Text style={{ fontSize: 15 }}>{challengeItem.description}</Text>
                    <DrawLine />
                </View>
                <View style={styles.container_progress}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>현재 챌린지 진행률</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Progress.Bar
                            progress={challengeItem.currentProgress / challengeItem.targetProgress}
                            width={150}
                            color="#3b5998"
                            style={styles.progressBar}
                        />
                    </View>
                    <Text> {challengeItem.currentProgress} / {challengeItem.targetProgress} </Text>
                    <DrawLine />
                </View>
                <View style={styles.container_myrecord}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>나의 챌린지 기록</Text>
                    <MyChallengeGallery userInfo={myProfileInfo} challengeItem={challengeItem} />
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={takePhotoAndUpload}>
                            <Image source={require("@/assets/images/writechallengebutton.png")}
                                style={{ width: 265, height: 41, marginTop: 20, marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>
                    <DrawLine />
                </View>
                <View style={styles.container_memberrecord}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 13 }}>멤버의 기록을 확인하세요!</Text>
                    </View>
                    {
                        challengeItem.participants.map((participant, index) => {
                            console.log(participant);
                            if (participant.id === myProfileInfo.id) {
                                return <View key={index}></View>
                            }
                            return <MemberChallengeGallery userInfo={participant}
                                challengeItem={challengeItem}
                                setChallengeItem={setChallengeItem}></MemberChallengeGallery>
                        })
                    }
                </View>
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
    image: {
        width: 72, height: 75, marginLeft: 3,
        borderRadius: 8, // Optional, for rounded corners
    },
    icon: {
        position: 'absolute',
        top: 8, // Distance from the top of the image
        right: 8, // Distance from the right of the image
    },
    container_progress: {
        margin: 10,
        alignItems: 'center'
    },
    container_myrecord: {
        margin: 10
    },
    container_memberrecord: {
        margin: 10
    },
    container_button: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },
    imageWrapper: {
        position: 'relative', // Allows absolute positioning within this container
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
