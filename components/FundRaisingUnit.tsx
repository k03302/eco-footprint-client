import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';
import ViewAdModal from '@/components/ViewAdModal';

export default function FundRaisingUnit() {
    const [showAdModal, setShowAdModal] = useState<boolean>(false);
    return (
        <View>
            <Button title={"광고보기"} onPress={() => { setShowAdModal(true) }}></Button>
            {
                <ViewAdModal showAdModal={showAdModal} setShowAdModal={setShowAdModal} />
            }
        </View>
    );
}