import { Button } from 'react-native';
import { testLogin } from '@/api/auth';
import { useState } from 'react';
import { router } from 'expo-router';

export default function TestuserButton(prop: { title: string, authCodeFake: string }) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const handlePress = async () => {
        setDisabled(false);
        await testLogin.login(prop.authCodeFake);
        if (await testLogin.isRegistered()) {
            router.replace('/map');
        } else {
            router.push('/register');
        }
    }

    return (
        <Button title={prop.title} onPress={handlePress} disabled={disabled}></Button>
    );
}