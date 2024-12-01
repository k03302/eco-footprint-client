import { Modal, View, StyleSheet } from 'react-native';



export default function SimpleModal({ modalVisible, setModalVisible, ContentComponent }:
    {
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        ContentComponent?: React.ComponentType
    }) {
    const closeModal = () => { setModalVisible(false) };

    return (<Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {
                    ContentComponent ? <ContentComponent></ContentComponent> : <></>}
            </View>
        </View>
    </Modal>);
}

const styles = StyleSheet.create({
    //modal
    centeredView: {
        flex: 1,
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
        marginTop: 230,
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
