import { FileRepo } from "@/core/repository";
import { FileData, FileInput } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const filePath = FileSystem.documentDirectory + "image/";

class FileLocalRepo implements FileRepo {
    async getFile(fileId: string): Promise<FileData> {
        throw new Error("Method not implemented.");
    }
    private prefix: string = 'file_';

    // Helper function to generate storage keys
    private generateKey(fileId: string): string {
        return `${this.prefix}${fileId}`;
    }

    // Upload a new file to AsyncStorage
    async uploadFile(file: FileInput): Promise<FileData> {

        const key = this.generateKey(file.id);

        // Prepare the file data
        const fileData: FileData = {
            id: file.id,
            name: file.name,
            size: 0,
            contentType: file.fileUri.split('.').pop() || "",
            owner: "",
            file: "",
            isPrivate: false
        };
        if (!file.localLocation && file.fileUri) {
            await FileSystem.copyAsync({
                from: file.fileUri,
                to: filePath + file.id,
            });
        }
        const fileInfo = await FileSystem.getInfoAsync(filePath + file.id);


        console.log("from", file.fileUri);
        console.log("to", filePath + file.id);

        // Save the file metadata in AsyncStorage
        await AsyncStorage.setItem(key, JSON.stringify(fileData));
        return fileData;
    }

    // Update an existing file in AsyncStorage
    async updateFile(file: FileInput): Promise<FileData> {
        const key = this.generateKey(file.id);
        const existingFileString = await AsyncStorage.getItem(key);

        if (!existingFileString) {
            throw new Error(`File with ID ${file.id} not found.`);
        }

        // Update file metadata
        const updatedFileData: FileData = {
            id: file.id,
            name: file.name,
            size: 0,
            contentType: file.fileUri.split('.').pop() || "",
            owner: "",
            file: "",
            isPrivate: false
        };

        if (!file.localLocation && file.fileUri) {
            await FileSystem.copyAsync({
                from: file.fileUri,
                to: filePath + file.id,
            });
        }


        await AsyncStorage.setItem(key, JSON.stringify(updatedFileData));
        return updatedFileData;
    }

    // Delete a file from AsyncStorage
    async deleteFile(fileId: string): Promise<boolean> {
        const key = this.generateKey(fileId);
        const existingFileString = await AsyncStorage.getItem(key);

        if (!existingFileString) {
            throw new Error(`File with ID ${fileId} not found.`);
        }

        // Remove the file from AsyncStorage
        await AsyncStorage.removeItem(key);

        // Return the deleted file data
        return true;
    }
}

export function getFileSource(fileId: string) {
    if (bundledImageMap[fileId]) return bundledImageMap[fileId];
    return {
        uri: filePath + fileId
    };
}

const bundledImageMap: { [key: string]: any } = {
    thumbnail1: require("@/assets/images/thumbnail1.png"),
    thumbnail2: require("@/assets/images/thumbnail2.png"),
    thumbnail3: require("@/assets/images/thumbnail3.png"),



    donation1: require("@/assets/images/donation1.png"),
    donation2: require("@/assets/images/donation2.png"),



    recoord1: require("@/assets/images/recoord1.png"),
    recoord2: require("@/assets/images/recoord2.png"),
    recoord3: require("@/assets/images/recoord3.png"),
    recoord4: require("@/assets/images/recoord4.png"),
    recoord5: require("@/assets/images/recoord5.png"),
    recoord6: require("@/assets/images/recoord6.png"),
    recoord7: require("@/assets/images/recoord7.png"),
    recoord8: require("@/assets/images/recoord8.png"),
    recoord9: require("@/assets/images/recoord9.png"),
    recoord10: require("@/assets/images/recoord10.png"),
    recoord11: require("@/assets/images/recoord11.png"),



    reward1: require("@/assets/images/reward1.png"),
    reward2: require("@/assets/images/reward2.png"),
    reward3: require("@/assets/images/reward3.png"),
    reward4: require("@/assets/images/reward4.png"),
    reward5: require("@/assets/images/reward5.png"),
    reward6: require("@/assets/images/reward6.png"),
    reward7: require("@/assets/images/reward7.png"),
}

export default FileLocalRepo;