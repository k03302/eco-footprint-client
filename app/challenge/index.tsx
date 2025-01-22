import { TouchableOpacity, Image, Text, View, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChallengeItem, ChallengeItemMeta, ItemState, UserItem } from '@/core/model';
import { useIsFocused } from '@react-navigation/native';
import { getDayDifference } from '@/utils/time';
import { getProfile } from '@/api/user';
import { getAllChallenges, getChallenge, getChallengeReward } from '@/api/challenge';
import { ThemeButton } from '@/components/ThemeButton';

function challengeMalformCheck(challengeMeta: ChallengeItemMeta): boolean {
    if (challengeMeta.id === '675bc8bc3abe8b1db7ff4f7f') return true;
    if (challengeMeta.id === '675c08a23abe8b1db7ff4f85') return true;
    if (challengeMeta.totalParticipants <= 0) return true;
    if (challengeMeta.totalParticipants < challengeMeta.currentParticipants) return true;

    const endDate = Number(challengeMeta.dateEnd) * 1000;
    if (isNaN(endDate)) return true;

    const nowDate = Date.now();
    const dayDifference = getDayDifference({ from: nowDate, to: endDate });
    if (dayDifference > 30 || dayDifference < 0) return true;

    return false;
}

function participated(userId: string, challengeInfo: ChallengeItem): boolean {
    let _participated = false;
    for (const participant of challengeInfo.participants) {
        if (participant.id === userId) {
            _participated = true;
        }
    }
    return _participated;
}

export default function ChallengeScreen() {
    const [otherChallengeList, setOtherChallengeList] = useState<ChallengeItem[] | null>(null);
    const [myChallengeList, setMyChallengeList] = useState<ChallengeItem[] | null>(null);
    const [myUserInfo, setMyUserInfo] = useState<UserItem | null>(null);
    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);
    const [rewardChallenge, setRewardChallenge] = useState<ChallengeItem | null>(null);
    const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

    const onFetchError = () => {
        Alert.alert('에러가 발생했어요');
        router.back();
    }

    const updatePageInfo = async () => {
        const userInfo = await getProfile({ myProfile: true });
        setMyUserInfo(userInfo);
        if (!userInfo) {
            onFetchError();
            return;
        }

        const myChallenges = [];
        const otherChallenges = [];
        const allChallengeMetas = await getAllChallenges();
        if (!allChallengeMetas) {
            onFetchError();
            return;
        }

        for (const challengeMeta of allChallengeMetas) {
            if (challengeMalformCheck(challengeMeta)) continue;

            const challenge = await getChallenge({ challengeId: challengeMeta.id });
            if (!challenge) continue;

            if (challenge.state !== ItemState.ACTIVE) continue;

            if (participated(userInfo.id, challenge)) {
                myChallenges.push(challenge);
            } else {
                if (challenge.currentParticipants < challenge.totalParticipants)
                    otherChallenges.push(challenge);
            }
        }

        setMyChallengeList(myChallenges);
        setOtherChallengeList(otherChallenges);
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

    return (
        <View style={styles.container}>
            <ScrollView>
                {
                    myChallengeList && myChallengeList.length > 0 &&
                    <View style={styles.challengecontainer}>
                        <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>현재 나의 참여 챌린지</Text>
                        {
                            myChallengeList.map((challengeInfo, index) => <ChallengeCard
                                challengeInfo={challengeInfo} key={index} isParticipated={true}
                                setRewardChallenge={setRewardChallenge}
                            >

                            </ChallengeCard>)
                        }
                    </View>

                }

                <View style={styles.challengecontainer}>
                    <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>참여할 수 있는 챌린지</Text>
                    {
                        otherChallengeList ? otherChallengeList.map((challengeInfo, index) => {
                            return <ChallengeCard
                                challengeInfo={challengeInfo} key={index} isParticipated={false}
                                setRewardChallenge={setRewardChallenge}

                            ></ChallengeCard>
                        }

                        ) : <ActivityIndicator size={'large'} />
                    }
                </View>

                {/* <ThemeButton title={"test"} onPress={() => { myChallengeList && myChallengeList.length > 0 && setRewardChallenge(myChallengeList[0]) }} /> */}
            </ScrollView>
            <View style={styles.floatingbutton}>
                <TouchableOpacity onPress={() => { router.push("/challenge/create") }}>
                    <Image source={require("@/assets/images/plus.png")}
                        style={{ marginRight: 10, marginBottom: 10 }} />
                </TouchableOpacity>
            </View>

            <Modal
                visible={rewardChallenge !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    console.log('close');
                    setRewardChallenge(null);
                }}>

                <View style={styles.centeredView}>
                    {
                        rewardChallenge && <View style={styles.modalView}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{rewardChallenge.name} 챌린지를 완료했어요!</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', alignSelf: 'center' }}>
                                <Image style={{ width: 100, height: 100, margin: 5 }} source={{ uri: 'https://cdn.hankyung.com/photo/202006/99.21251182.1.jpg' }} />
                                <Image style={{ width: 100, height: 100, margin: 5 }} source={{ uri: 'https://daily.hankooki.com/news/photo/202001/20200112_1_bodyFimg_638253.jpg' }} />
                                <Image style={{ width: 100, height: 100, margin: 5 }} source={{ uri: 'https://www.nanumnews.com/imgdata/nanumnews_com/201201/2012012455053921.jpg' }} />
                                <Image style={{ width: 100, height: 100, margin: 5 }} source={{ uri: 'https://image.lawtimes.co.kr/images/120029.jpg' }} />
                            </View>
                            <Text style={{ fontSize: 30, color: 'forestgreen' }}>환경을 위해 애쓰는 당신은 멋쟁이!</Text>
                            <Text style={{ fontSize: 20, color: 'forestgreen' }}>1376<Image source={require("@/assets/images/point.png")}
                                style={{ width: 20, height: 20 }} />만큼 보상으로 드려요!</Text>
                            <ThemeButton title="보상 받기" onPress={async () => {
                                if (await getChallengeReward({ challengeId: rewardChallenge.id }) === null) {
                                    Alert.alert("1376 리워드 획득!");
                                }
                                setRewardChallenge(null);
                            }} />
                        </View>
                    }
                </View>


            </Modal>
        </View>
    )
}

const ChallengeCard = (
    { challengeInfo, isParticipated: isRegistered, setRewardChallenge }:
        {
            challengeInfo: ChallengeItem, isParticipated: boolean
            setRewardChallenge: React.Dispatch<React.SetStateAction<ChallengeItem | null>>
        }) => {
    const [datePassed, setDatePassed] = useState<boolean>(false);
    const [dayLeft, setDayLeft] = useState<number>(0);
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
        const diff = getDayDifference({ from: Date.now(), to: Number(challengeInfo.dateEnd) * 1000 });
        setDayLeft(diff);
        setDatePassed(diff <= 0);
    }, [challengeInfo])

    if (!show) return <></>

    return (
        <View style={{ width: "95%" }} >
            <TouchableOpacity onPress={() => {
                if (dayLeft <= 0) {
                    setShow(false);
                }
                if (isRegistered) {
                    if (datePassed) {
                        setRewardChallenge(challengeInfo);
                    } else {
                        router.push(`/challenge/room/${challengeInfo.id}`)
                    }
                } else {
                    if (!datePassed) {
                        router.push(`/challenge/register/${challengeInfo.id}`)
                    }
                }

            }}>

                <View style={styles.goalContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 8, marginRight: 8 }}>
                        <View style={{
                            backgroundColor: datePassed ? 'blue' : 'green', width: 45, height: 20, borderRadius: 7, marginRight: 3,
                            justifyContent: 'center'
                        }}>
                            <Text style={{ fontSize: 10, alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>
                                {datePassed ? '보상받기' : '진행중'}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 15, marginRight: 5 }}>{challengeInfo.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 20, }}>
                        <Text style={{ fontSize: 13 }}>함께하는 인원 </Text>
                        <Text style={{ fontSize: 13 }}>{challengeInfo.currentParticipants}/{challengeInfo.totalParticipants}</Text>
                        <Text>   </Text>
                        <Text style={{ fontSize: 13, color: dayLeft > 0 ? '#3E81A9' : 'red' }}>{dayLeft > 0 ? `마감 ${dayLeft}일 전` : '챌린지 마감'}</Text>
                        <Text>   </Text>
                        {
                            dayLeft <= 0 && <Text style={{ fontSize: 13, color: 'forestgreen' }}>
                                1376<Image source={require("@/assets/images/point.png")}
                                    style={{ width: 13, height: 13 }} />
                            </Text>

                        }
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "white"
    },
    challengecontainer: {
        flex: 5,
        flexDirection: 'column'
    },
    floatingbutton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        zIndex: 100,
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
    goalrowContainer: {
        flexDirection: 'row',
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
        height: 65,
        width: '100%',
    },
    centeredView: {
        flex: 1,
        alignContent: "center",
        justifyContent: 'center',
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
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
});