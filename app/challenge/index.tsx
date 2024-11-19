import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChallengeItemMeta } from '@/core/model';
import { repo } from '@/api/main';
import { getMyProfile } from '@/api/user';

export default function ChallengeScreen() {
    const [myChallengeList, setMyChallengeList] = useState<ChallengeItemMeta[]>([]);
    const [challengeList, setChallengeList] = useState<ChallengeItemMeta[]>([]);

    useEffect(() => {
        (async () => {
            const userInfo = await getMyProfile();
            const challenges = await repo.challenges.getAllChallenges();
            if (userInfo) {
                setMyChallengeList(userInfo.chellengeList);
            }
            if (challenges) {
                setChallengeList(challenges);
            }
        })()
    }, [])

    return (
        <View style={styles.container1}>
            {
                myChallengeList.length > 0 ? (
                    <View style={styles.container2}>
                        <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>현재 나의 참여 챌린지</Text>
                        {
                            myChallengeList.map((challengeInfo, index) => <ChallengeCard
                                challengeInfo={challengeInfo} key={index}>

                            </ChallengeCard>)
                        }
                    </View>
                ) : <></>

            }

            <View style={styles.container3}>
                <Text style={{ fontSize: 15, marginTop: 10, marginLeft: 10 }}>참여할 수 있는 챌린지</Text>
                {
                    challengeList.length > 0 ? challengeList.map((challengeInfo, index) => <ChallengeCard
                        challengeInfo={challengeInfo} key={index}>

                    </ChallengeCard>) : <></>
                }
            </View>
            <View style={styles.floatingbutton}>
                <Link href="/challenge/create">
                    <Image source={require("@/assets/images/plus.png")}
                        style={{ marginRight: 10, marginBottom: 10 }} />
                </Link>
            </View>
        </View>
    )
}

const ChallengeCard = ({ challengeInfo }: { challengeInfo: ChallengeItemMeta }) => {
    const dueDate = challengeInfo.dateEnd.getFullYear() + '/' + challengeInfo.dateEnd.getMonth() + '/' + challengeInfo.dateEnd.getDay();
    return (
        <View style={{ width: "100%" }} >
            <Link href={`/challenge/room/${challengeInfo.id}`}>
                <TouchableOpacity>
                    <View style={styles.goalContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 8, marginRight: 8 }}>
                            <Image source={require("@/assets/images/goal.png")}
                                style={{ width: 32, height: 18, margin: 5 }} />
                            <Text style={{ fontSize: 15 }}>{challengeInfo.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 20, }}>
                            <Text style={{ fontSize: 13 }}>함께하는 인원 </Text>
                            <Text style={{ fontSize: 13 }}>{challengeInfo.currentParticipants}/{challengeInfo.totalParticipants}</Text>
                            <Text>   </Text>
                            <Text style={{ fontSize: 13 }}>마감일</Text>
                            <Text style={{ fontSize: 13, color: '#3E81A9' }}> {dueDate}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};


const styles = StyleSheet.create({

    container1: {
        flexWrap: 'wrap',
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