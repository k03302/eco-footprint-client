import { View, Image } from "react-native";


export const HorizontalLine = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image source={require("@/assets/images/line.png")}
                style={{ width: 325, height: 1, marginTop: 15, borderRadius: 10 }} />
        </View>
    );
};