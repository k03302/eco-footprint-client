import React, { useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';
import ViewAd from '@/components/ViewAd';

export default function ViewAdModal({ showAdModal, setShowAdModal }: { showAdModal: boolean, setShowAdModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [adWatchFinished, setAdWatchFinished] = useState<boolean>(false);
    return (<View>
        <Modal
            animationType="fade"
            visible={showAdModal}
            transparent={true}
            onRequestClose={() => { setShowAdModal(false); }}>
            <View style={styles.modalOverlay}>
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

        </Modal>
    </View>)
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 10, // Shadow for Android
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
