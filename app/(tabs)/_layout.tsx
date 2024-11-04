import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Login'
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Settings'
                }}
            />
        </Tabs>
    );
}