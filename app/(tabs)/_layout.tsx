import { Tabs } from 'expo-router'
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <>
            <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        href: null
                    }}
                />
                <Tabs.Screen
                    name="chellenge"
                    options={{
                        title: 'Chellenge'
                    }}
                />
                <Tabs.Screen
                    name="fundraising"
                    options={{
                        title: 'Fundraising'
                    }}
                />
                <Tabs.Screen
                    name="shop"
                    options={{
                        title: 'Shop'
                    }}
                />

            </Tabs>

        </>
    );
}