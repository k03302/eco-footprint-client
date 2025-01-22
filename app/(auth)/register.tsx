import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AsyncThemeButton } from '@/components/AsyncThemeButton';
import { register } from '@/utils/register';

export default function UserProfile() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');

    // Function to pick an image from the gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (username.trim() === '') {
            Alert.alert('닉네임을 입력해주세요.');
            return;
        }

        if (imageUri === null) {
            Alert.alert('썸네일을 선택해주세요');
            return;
        }

        if (await register({
            username: username,
            thumbnailUri: imageUri,
        })) {
            router.push('/map');
        } else {
            Alert.alert('회원가입에 실패했어요');
            router.push('/');
        }
    };

    return (
        <View style={styles.container}>

            {/* Picture Selector */}
            <View style={styles.row}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        ) : (
                            <Ionicons name="person-circle-outline" size={120} color="#8F95B2" />
                        )}
                    </TouchableOpacity>
                    {/* Camera Icon */}
                    <View style={styles.cameraIcon}>
                        <Ionicons name="camera" size={32} color="#8F95B2" />
                    </View>
                </View>

                <Text
                    style={styles.textProfile}>
                    프로필 이미지를 {"\n"}선택해주세요
                </Text>
            </View>



            {/* Username Input */}
            <Text style={styles.textName}>
                이름
            </Text>
            <TextInput
                style={styles.input}
                placeholder="사용하실 이름을 입력해주세요"
                value={username}
                onChangeText={setUsername}
            />

            {/* Submit Button */}
            <AsyncThemeButton title="시작하기" onPressAsync={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 20,
        backgroundColor: 'white',
    },
    row: {
        margin: 20,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    column: {
        alignSelf: 'flex-start',
        flexDirection: 'column'
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageButton: {
        position: 'relative',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#c4c4c4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
        resizeMode: 'cover',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    textProfile: {
        marginTop: 50,
        marginLeft: 20,
        fontSize: 20,
    },
    textName: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10
    }
});
