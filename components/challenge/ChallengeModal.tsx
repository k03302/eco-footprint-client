import { Modal, Text, View, StyleSheet, ImageSourcePropType, Image, TouchableOpacity } from 'react-native';
import { ThemeButton } from '@/components/ThemeButton';


export function ChallengeModal({ modalVisible, setModalVisible, imgDate, imgSource, onPress = async () => { }, buttonTitle = '', showButton = true }:
    {
        modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        imgDate?: Date, imgSource?: ImageSourcePropType, onPress?: () => Promise<void>, buttonTitle?: string, showButton?: boolean
    }) {
    const closeModal = () => { setModalVisible(false) };

    return (<Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
    >
        <TouchableOpacity style={styles.centeredView} onPress={() => {
            setModalVisible(false)
        }}>
            <View style={styles.modalView}>
                {
                    imgDate ? <Text>{imgDate.toDateString()}</Text> : <></>
                }
                {
                    imgSource ? <Image style={styles.image} source={imgSource}></Image> :
                        <Text style={{ fontSize: 20 }}>이미지 없음</Text>
                }
            </View>
            {
                showButton ? <ThemeButton title={buttonTitle} onPress={onPress}></ThemeButton> : <></>
            }
        </TouchableOpacity>
    </Modal>);
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: 'beige'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)#",
    },
    modalView: {
        width: '90%',
        height: '60%',
        marginBottom: 50,
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
        justifyContent: 'center',
    },
});
