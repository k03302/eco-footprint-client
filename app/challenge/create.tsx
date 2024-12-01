import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, TextInput, Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { createChallenge } from '@/api/challenge';


const challengeTypeInfo: Record<string, { name: string, description: string }> = {
    'eco_food': {
        'name': '친환경 식단하기 🌱🍴',
        'description':
            `🌍 지구를 위한 한 끼, 얼마나 멋진 일일까요? 🥗

이번 챌린지는 육류를 잠시 쉬게 하고, 채식 위주의 한 끼를 실천하는 거예요! 🥕🥬 맛있는 샐러드, 고소한 두부 요리, 색색의 과일 플레이트로 나만의 그린 플레이팅을 만들어보세요. 💚 지구도 살리고 건강도 챙기는 일석이조!

📸 목표: 환경을 보호하고 지속 가능한 식습관을 만들기 위해 채식 위주의 식단을 하기!
📸 방식: 고기가 들어가지 않은 채식 위주의 식단을 먹은 후 사진을 찍어 인증해주세요!`
    },

    'using_tumblers': {
        'name': '텀블러 이용하기 ☕🌏',
        'description':
            `👋 일회용 컵은 이제 그만~! 🛑

텀블러 하나면 쓰레기를 줄이고 환경 보호에 기여할 수 있어요. 🥤 예쁜 텀블러에 좋아하는 음료를 담아 나만의 스타일을 뽐내 보세요! 😎💖 텀블러를 사용하면 할인도 받을 수 있다는 꿀팁은 덤!

📸 목표: 일회용 컵 사용을 줄이고 텀블러를 사용해 지속 가능한 소비를 실천하기!
📸 방식: 텀블러에 음료가 담겨있는 모습이나 텀블러로 음료를 마시는 순간을 사진으로 남겨주세요!`
    },

    'public_transportation': {
        'name': '대중교통 이용하기 🚌🚉',
        'description':
            `🚶‍♀️🚶‍♂️ 걸어서 또는 대중교통으로 이동하며 지구와의 약속을 지켜볼까요? 🛤️

차 대신 지하철, 버스, 자전거를 이용하면 온실가스를 줄이고, 도시가 더 깨끗해져요! 🚋💨 오늘은 편리함보다 환경을 생각하며 발걸음을 내딛어 보세요. 😊💪

📸 목표: 대중교통을 이용해 탄소 배출을 줄이고 깨끗한 환경 만들기!
📸 방식: 대중교통을 이용하는 순간, 티켓 또는 풍경 사진으로 인증해주세요!`
    },

    'flocking': {
        'name': '쓰레기 줍기 🗑️🌿',
        'description':
            `💚 당신의 손길로 깨끗해질 세상을 상상해보세요! 🌟

가까운 공원, 해변, 산책로에서 쓰레기 하나를 줍는 것만으로도 큰 변화를 만들 수 있어요. 🌼 환경은 물론 보는 사람들에게도 감동을 전하는 멋진 행동이에요! 🧤🪣

📸 목표: 쓰레기를 수거하여 자연을 깨끗하게 만들고 주변에 환경 보호의 중요성을 알리기!
📸 방식: 쓰레기를 줍는 모습이나 정리된 쓰레기봉투를 사진으로 찍어 인증해주세요!`
    },
}



export default function ChallengeScreen() {
    const [challengeType, setChallengeType] = useState<string>('');



    const handleSubmit = async () => {
        if (challengeType === '') {
            alert('챌린지 유형을 선택해주세요');
            return;
        }

        const { name, description } = challengeTypeInfo[challengeType];
        const challengeItem = await createChallenge(name, description);
        if (challengeItem) {
            router.replace({ pathname: '/challenge/room/[id]', params: { id: challengeItem.id } });
        } else {
            alert('챌린지 생성에 실패했어요.');
            router.replace('/challenge');
        }
    };

    const pickHandler = (input: string) => {
        setChallengeType(input);
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 9, width: '100%' }}>
                <Text style={{ fontSize: 30, marginTop: 50, marginLeft: 15, marginBottom: 50 }}>어떤 챌린지를 만들고 싶은가요?</Text>
                <View style={styles.pickercontainer}>
                    <Picker
                        style={styles.pickerinput}
                        selectedValue={challengeType}
                        onValueChange={(input) => { setChallengeType(input) }}
                    >
                        <Picker.Item key={-1} label="선택없음" value="" />
                        {
                            Object.keys(challengeTypeInfo).map((type: string, index: number) => {
                                return <Picker.Item key={index} label={challengeTypeInfo[type].name} value={type} />
                            })
                        }
                    </Picker>
                </View>

            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>

                <TouchableOpacity onPress={handleSubmit}>
                    <Image source={require("@/assets/images/makechallengebutton.png")}
                        style={{ width: 265, height: 41, marginTop: 10, marginLeft: 3 }} />
                </TouchableOpacity>

            </View>
        </View>

    )
}


const styles = StyleSheet.create({

    container: { backgroundColor: 'white', alignItems: 'center', width: '100%', height: '100%' },
    pickerinput: {
        height: "100%",
        width: "90%",
    },
    pickercontainer: {
        margin: 20,
        borderWidth: 0.7,
        borderColor: 'gray',
        backgroundColor: '#fff',
        height: 50,
        width: '90%',
        alignItems: 'center'
    },
});