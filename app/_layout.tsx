import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="kakaologin" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}