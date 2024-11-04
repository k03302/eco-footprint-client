import { Picker } from "@react-native-picker/picker";
import { useState } from "react"
import { router } from "expo-router"

export default function TestUserPicker() {
    const [user, setUser] = useState<string>("user a");
    return (
        <Picker selectedValue={user}>

        </Picker>
    )
}