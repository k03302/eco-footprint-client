import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, TextInput, Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';


export default function ChallengeScreen() {
    const [challengeName, setChallengeName] = useState<string>('');
    const [challengeType, setChallengeType] = useState<string>('');
    const [challengeDescription, setChallengeDescription] = useState<string>('');

    const isFocused = useIsFocused();

    useEffect(() => {

    }, [isFocused])

    const handleSubmit = async () => {
        const name = challengeName.trim();
        const type = challengeType.trim();
        const description = challengeDescription.trim();

        if (name === '' || type === '' || description === '') {
            Alert.alert('챌린지에 필요한 모든 정보를 입력해주세요.');
            return;
        }

        // const challengeItem = await createChallenge(name, type, description);
        // if (challengeItem) {
        //     router.replace({ pathname: '/challenge/room/[id]', params: { id: challengeItem.id } });
        // } else {
        //     Alert.alert('챌린지 생성에 실패했어요.');
        //     router.replace('/challenge');
        // }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 9 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 10, marginLeft: 15 }}>챌린지</Text>
                    <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 15 }}>챌린지 이름</Text>
                    <View style={styles.container}>
                        <TextInput
                            onChangeText={(input) => { setChallengeName(input) }}
                            value={challengeName}
                            placeholder="챌린지 이름을 입력하세요."
                            style={styles.nameinput}
                        />
                    </View>
                    <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 15 }}>챌린지 종류</Text>
                    <View style={styles.container}>
                        <Picker
                            style={styles.pickerinput}
                            selectedValue={challengeType}
                            onValueChange={(input) => { setChallengeType(input) }}
                        >
                            <Picker.Item label="" value="" />
                            <Picker.Item label="친환경 식단하기" value="친환경 식단하기" />
                            <Picker.Item label="텀블러 이용하기" value="텀블러 이용하기" />
                            <Picker.Item label="대중교통 이용하기" value="대중교통 이용하기" />
                            <Picker.Item label="쓰레기 줍기" value="쓰레기 줍기" />
                        </Picker>
                    </View>
                    <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 15 }}>챌린지 설명</Text>
                    <View style={styles.container}>
                        <TextInput
                            editable
                            multiline
                            numberOfLines={20}
                            maxLength={1000}
                            onChangeText={(input) => { setChallengeDescription(input) }}
                            value={challengeDescription}
                            placeholder="챌린지 설명을 입력하세요."
                            style={styles.descriptioninput}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>

                    <TouchableOpacity onPress={handleSubmit}>
                        <Image source={require("@/assets/images/makechallengebutton.png")}
                            style={{ width: 265, height: 41, marginTop: 10, marginLeft: 3 }} />
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>

    )
}


const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    nameinput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    descriptioninput: {
        height: 400,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        textAlign: 'left', // Aligns text to the left horizontally
        textAlignVertical: 'top', // Aligns text to the top vertically
    },
    pickerinput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    pickercontainer: {

        borderWidth: 0.7,
        marginBottom: 20,
        justifyContent: "center",
        borderColor: 'gray',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        height: 50,
        width: "100%",

    },
});