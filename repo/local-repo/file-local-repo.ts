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
        console.log('uploadFile');
        const key = this.generateKey(file.id);

        // Prepare the file data
        const fileData: FileData = {
            id: file.id,
            name: file.name,
            size: 0,
            contentType: file.fileUri.split('.').pop() || "",
            owner: "",
            date: "",
            file: ""
        };
        if (file.localLocation) {
            await FileSystem.copyAsync({
                from: file.fileUri,
                to: filePath + file.id,
            });
            console.log(FileSystem.documentDirectory);
        }
        const fileInfo = await FileSystem.getInfoAsync(filePath + file.id);
        console.log("fileInfo", fileInfo);

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
            date: "",
            file: ""
        };

        await FileSystem.copyAsync({
            from: file.fileUri,
            to: filePath + file.id,
        });


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
    donation1: require("@/assets/datas/donation1.png"),
    donation2: require("@/assets/datas/donation2.png"),
    recoord1: require("@/assets/datas/recoord1.png"),
    recoord2: require("@/assets/datas/recoord2.png"),
    recoord3: require("@/assets/datas/recoord3.png"),
    reward1: require("@/assets/datas/reward1.png"),
    reward2: require("@/assets/datas/reward2.png"),
}

export default FileLocalRepo;