import { TouchableOpacity, Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChallengeItem, ChallengeItemMeta, UserItem } from '@/core/model';
import { repo } from '@/api/main';
import { useIsFocused } from '@react-navigation/native';
import { getMyProfile } from '@/api/user';
import { getDayDifference } from '@/utils/time';

export default function ChallengeScreen() {
    const [participatedChallList, setParticipatedChallList] = useState<ChallengeItemMeta[]>([]);
    const [allChallList, setAllChallList] = useState<ChallengeItemMeta[]>([]);
    const [myUserInfo, setMyUserInfo] = useState<UserItem | null>(null);
    const isFocused = useIsFocused();
    const [hasToUpdate, setHasToUpdate] = useState<boolean>(false);


    const updatePageInfo = async () => {
        const userInfo = await getMyProfile();
        setMyUserInfo(userInfo);
        setParticipatedChallList(userInfo.challengeList);
        setAllChallList(await repo.challenges.getAllChallenges());
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
                    participatedChallList.length > 0 ? (
                        <View style={styles.challengecontainer}>
                            <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>현재 나의 참여 챌린지</Text>
                            {
                                participatedChallList.map((challengeInfo, index) => <ChallengeCard
                                    challengeMetaInfo={challengeInfo} key={index} isParticipated={true}>

                                </ChallengeCard>)
                            }
                        </View>
                    ) : <></>

                }

                <View style={styles.challengecontainer}>
                    <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>참여할 수 있는 챌린지</Text>
                    {
                        allChallList.length > 0 ? allChallList.map((challengeInfo, index) => {
                            for (const myChallengeInfo of participatedChallList) {
                                if (myChallengeInfo.id === challengeInfo.id) {
                                    return <View key={index}></View>
                                }
                            }
                            return <ChallengeCard
                                challengeMetaInfo={challengeInfo} key={index} isParticipated={false}></ChallengeCard>
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

const ChallengeCard = ({ challengeMetaInfo, isParticipated: isRegistered }: { challengeMetaInfo: ChallengeItemMeta, isParticipated: boolean }) => {
    const [challengeInfo, setChallengeInfo] = useState<ChallengeItem>();
    const [datePassed, setDatePassed] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const result = await repo.challenges.getChallenge(challengeMetaInfo.id);
            setChallengeInfo(result);

            const currentTimestamp = Date.now();
            const endTimestamp = new Date(result.dateEnd).getTime();
            setDatePassed(currentTimestamp > endTimestamp);
        })()
    }, [])

    if (!challengeInfo) return <></>

    return (
        <View style={{ width: "95%" }} >
            <TouchableOpacity onPress={() => {
                if (isRegistered) {
                    if (datePassed) {
                        //router.push()
                    } else {
                        router.push(`/challenge/room/${challengeMetaInfo.id}`)
                    }
                } else {
                    if (!datePassed) {
                        router.push(`/challenge/register/${challengeMetaInfo.id}`)
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
                        <Text style={{ fontSize: 15, marginRight: 5 }}>{challengeMetaInfo.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 20, }}>
                        <Text style={{ fontSize: 13 }}>함께하는 인원 </Text>
                        <Text style={{ fontSize: 13 }}>{challengeMetaInfo.currentParticipants}/{challengeMetaInfo.totalParticipants}</Text>
                        <Text>   </Text>
                        <Text style={{ fontSize: 13, color: '#3E81A9' }}>마감 {getDayDifference(new Date(challengeMetaInfo.dateEnd), new Date())}일 전 </Text>
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