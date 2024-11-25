import { TouchableOpacity, Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChallengeItemMeta } from '@/core/model';
import { repo } from '@/api/main';
import { useIsFocused } from '@react-navigation/native';

export default function ChallengeScreen() {
    const [myChallengeList, setMyChallengeList] = useState<ChallengeItemMeta[]>([]);
    const [challengeList, setChallengeList] = useState<ChallengeItemMeta[]>([]);

    const isFocused = useIsFocused();

    useEffect(() => {

    }, [isFocused])

    useEffect(() => {
        (async () => {
            // const userInfo = await getMyProfile();
            // const challenges = await repo.challenges.getAllChallenges();
            // if (userInfo) {
            //     setMyChallengeList(userInfo.chellengeList);
            // }
            // if (challenges) {
            //     setChallengeList(challenges);
            // }
        })()
    }, [])

    return (
        <View style={styles.container1}>
            <ScrollView>
                {
                    myChallengeList.length > 0 ? (
                        <View style={styles.container3}>
                            <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>현재 나의 참여 챌린지</Text>
                            {
                                myChallengeList.map((challengeInfo, index) => <ChallengeCard
                                    challengeInfo={challengeInfo} key={index} isRegistered={true}>

                                </ChallengeCard>)
                            }
                        </View>
                    ) : <></>

                }

                <View style={styles.container3}>
                    <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>참여할 수 있는 챌린지</Text>
                    {
                        challengeList.length > 0 ? challengeList.map((challengeInfo, index) => {
                            for (const myChallengeInfo of myChallengeList) {
                                if (myChallengeInfo.id === challengeInfo.id) {
                                    return <View key={index}></View>
                                }
                            }
                            return <ChallengeCard
                                challengeInfo={challengeInfo} key={index} isRegistered={false}></ChallengeCard>
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

const ChallengeCard = ({ challengeInfo, isRegistered }: { challengeInfo: ChallengeItemMeta, isRegistered: boolean }) => {
    // const progressRate = Math.floor(100 * challengeInfo.currentProgress / challengeInfo.targetProgress);
    console.log(challengeInfo);
    return (
        <View style={{ width: "95%" }} >
            {/* <TouchableOpacity onPress={() => { router.push(`/challenge/${isRegistered ? "room" : "register"}/${challengeInfo.id}`) }}>

                <View style={styles.goalContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 8, marginRight: 8 }}>
                        <Image source={require("@/assets/images/goal.png")}
                            style={{ width: 32, height: 18, margin: 5 }} />
                        <Text style={{ fontSize: 15, marginRight: 5 }}>{challengeInfo.name}</Text>
                        <Text style={{ color: "gray", fontSize: 12 }}>| {challengeInfo.type}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 20, }}>
                        <Text style={{ fontSize: 13 }}>함께하는 인원 </Text>
                        <Text style={{ fontSize: 13 }}>{challengeInfo.currentParticipants}/{challengeInfo.totalParticipants}</Text>
                        <Text>   </Text>
                        <Text style={{ fontSize: 13 }}>달성률</Text>
                        <Text style={{ fontSize: 13, color: '#3E81A9' }}> {100 * challengeInfo.currentProgress / challengeInfo.targetProgress}% </Text>
                        <Text>   </Text>
                    </View>
                </View>
            </TouchableOpacity> */}
        </View>
    );
};


const styles = StyleSheet.create({

    container1: {
        width: '100%',
        height: '100%',
        backgroundColor: "white"
    },
    container2: {
        flex: 3,
        backgroundColor: 'white',
        flexWrap: 'wrap',
    },
    container3: {
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
});