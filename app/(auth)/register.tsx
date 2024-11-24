import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { register } from '@/api/auth';

export default function UserProfile() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');

    // Function to pick an image from the gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
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
            alert('닉네임을 입력해주세요.');
            return;
        }

        if (imageUri === null) {
            alert('썸네일을 선택해주세요');
            return;
        }

        await register({ username: username, thumbnailUri: imageUri, useStoredToken: true })

        // repo.users.updateUserInfo();

        // if (await loginPlatform.register(username, imageUri)) {
        //     router.replace('/map');
        //     return;
        // } else {
        //     alert("가입 실패. 다시 입력해주세요.");
        //     setImageUri(null);
        //     setUsername("");
        // }
    };

    return (
        <View style={styles.container}>
            {/* Picture Selector */}
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={120} color="#ccc" />
                    )}
                    {/* Camera Icon */}
                    <View style={styles.cameraIcon}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Username Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />

            {/* Submit Button */}
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    imageContainer: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageButton: {
        position: 'relative',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
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
        backgroundColor: '#007AFF',
        borderRadius: 15,
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
});