import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router'



export default function VersionScreen() {

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, marginLeft: 20, marginTop: 20 }}>{process.env.EXPO_PUBLIC_APP_VERSION}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

});
