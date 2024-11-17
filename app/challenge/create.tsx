import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncButton from '@/components/AsyncButton';
import { router } from 'expo-router';
import { createChallenge } from '@/api/user'

export default function Screen() {
    // State variables for form inputs
    const [name, setName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [description, setDescription] = useState('');

    // Submit handler
    const handleSubmit = async () => {
        if (name.trim() === '' || selectedOption === '' || description.trim() === '') {
            Alert.alert('챌린지에 필요한 모든 정보를 입력해주세요.');
            return;
        }
        // const challengeItem = await createChallenge(name.trim(), selectedOption, description.trim());
        // if (challengeItem) {
        //     router.replace({ pathname: '/challenge/room', params: { id: challengeItem.id } });   
        // } else {
        //     Alert.alert('챌린지 생성에 실패했어요.');
        //     router.replace('/challenge');
        // }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>챌린지 이름</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>챌린지 종류</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedOption}
                    onValueChange={(itemValue) => setSelectedOption(itemValue)}
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="텀블러 이용하기" value="option1" />
                    <Picker.Item label="대중교통 이용하기" value="option2" />
                    <Picker.Item label="쓰레기 줍기" value="option3" />
                </Picker>
            </View>

            <Text style={styles.label}>챌린지 설명</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
            />

            {/* Submit Button */}
            <AsyncButton title={""} onPressAsync={handleSubmit}></AsyncButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 120,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
