import { TouchableOpacity, Image, Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChallengeItem, ChallengeItemMeta, UserItem } from '@/core/model';
import { useIsFocused } from '@react-navigation/native';
import { getDayDifference } from '@/utils/time';
import { getProfile } from '@/api/user';
import { getAllChallenges, getChallenge } from '@/api/challenge';

export default function ChallengeScreen() {
    const [otherChallengeList, setOtherChallengeList] = useState<ChallengeItem[]>([]);
    const [myChallengeList, setMyChallengeList] = useState<ChallengeItem[]>([]);
    const [myUserInfo, setMyUserInfo] = useState<UserItem | null>(null);
    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);

    const onFetchError = () => {
        Alert.alert('');
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
            const challenge = await getChallenge({ challengeId: challengeMeta.id });
            if (!challenge) continue;

            let participated = false;
            for (const participant of challenge.participants) {
                if (participant.id === userInfo.id) {
                    participated = true;
                }
            }

            if (participated) {
                myChallenges.push(challenge);
            } else {
                otherChallenges.push(challenge);
            }
        }

        setMyChallengeList(myChallengeList);
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
                    myChallengeList.length > 0 ? (
                        <View style={styles.challengecontainer}>
                            <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>현재 나의 참여 챌린지</Text>
                            {
                                myChallengeList.map((challengeInfo, index) => <ChallengeCard
                                    challengeInfo={challengeInfo} key={index} isParticipated={true}>

                                </ChallengeCard>)
                            }
                        </View>
                    ) : <></>

                }

                <View style={styles.challengecontainer}>
                    <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>참여할 수 있는 챌린지</Text>
                    {
                        otherChallengeList.length > 0 ? otherChallengeList.map((challengeInfo, index) => {
                            return <ChallengeCard
                                challengeInfo={challengeInfo} key={index} isParticipated={false}></ChallengeCard>
                        }

                        ) : <></>
                    }
                </View>
            </ScrollView>
            <View style={styles.floatingbutton}>
                <TouchableOpacity onPress={() => { router.push("/challenge/create") }}>
                    <Image source={require("@/assets/images/plus.png")}
                        style={{ marginRight: 10, marginBottom: 10 }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ChallengeCard = ({ challengeInfo, isParticipated: isRegistered }: { challengeInfo: ChallengeItem, isParticipated: boolean }) => {
    const [datePassed, setDatePassed] = useState<boolean>(false);
    const [dayLeft, setDayLeft] = useState<number>(0);

    useEffect(() => {
        const diff = getDayDifference({ from: new Date(), to: challengeInfo.dateEnd });
        setDayLeft(diff);
        setDatePassed(diff < 0);
    }, [challengeInfo])

    return (
        <View style={{ width: "95%" }} >
            <TouchableOpacity onPress={() => {
                if (isRegistered) {
                    if (datePassed) {
                        //router.push()
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
                            backgroundColor: datePassed ? 'red' : 'green', width: 35, height: 20, borderRadius: 7, marginRight: 3,
                            justifyContent: 'center'
                        }}>
                            <Text style={{ fontSize: 10, alignSelf: 'center', color: 'white', fontWeight: 'bold' }}>
                                {datePassed ? '종료' : '진행중'}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 15, marginRight: 5 }}>{challengeInfo.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 20, }}>
                        <Text style={{ fontSize: 13 }}>함께하는 인원 </Text>
                        <Text style={{ fontSize: 13 }}>{challengeInfo.currentParticipants}/{challengeInfo.totalParticipants}</Text>
                        <Text>   </Text>
                        <Text style={{ fontSize: 13, color: '#3E81A9' }}>마감 {dayLeft}일 전 </Text>
                        <Text>   </Text>
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
    }
});