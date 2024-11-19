import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';
import ViewAd from '@/components/ViewAd';

export default function ViewAdModal({ showAdModal, setShowAdModal }: { showAdModal: boolean, setShowAdModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [adWatchFinished, setAdWatchFinished] = useState<boolean>(false);
    return (
        <Modal
            animationType="fade"
            visible={showAdModal}
            transparent={true}
            onRequestClose={() => { setShowAdModal(false); }}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={styles.modalView}>
                <View>
                    {
                        adWatchFinished ? (
                            <>
                                <Button title={"리워드 받기"} onPress={() => setShowAdModal(false)}></Button>
                            </>
                        ) : (
                            <>
                                <Button title={"건너뛰기"} onPress={() => setShowAdModal(false)}></Button>
                                <ViewAd handleAdClose={() => { setAdWatchFinished(true); }}></ViewAd>
                            </>
                        )

                    }
                </View>
            </View>
        </Modal>)
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        marginVertical: 100,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
