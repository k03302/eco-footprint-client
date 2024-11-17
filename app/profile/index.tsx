import { Button, View } from 'react-native';
import { logoutUser } from '@/api/auth'
import { useState } from 'react'
import { router } from 'expo-router'


export default function ProfileScreen() {
    const [logoutActive, setLogoutActive] = useState<boolean>(true);
    const logoutHandler = async () => {
        setLogoutActive(false);
        await logoutUser();
        router.replace('/');
    }

    return (
        <View>
            {
                logoutActive ? <Button title="logout" onPress={logoutHandler} ></Button> : <></>
            }
        </View>
    );
}