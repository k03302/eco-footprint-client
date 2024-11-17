import ViewAd from '@/components/ViewAd';
import { Text, View } from 'react-native';
import FundRaisingUnit from '@/components/FundRaisingUnit';

export default function Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FundRaisingUnit />
        </View>
    );
}