import { FileRepo } from "@/core/repository";
import { FileData, FileInput } from "@/core/model";
import AsyncStorage from '@react-native-async-storage/async-storage';

class FileLocalRepo implements FileRepo {
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
            size: file.file[0].size,
            contentType: file.file[0].type,
        };

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
            size: file.file[0].size,
            contentType: file.file[0].type,
        };

        await AsyncStorage.setItem(key, JSON.stringify(updatedFileData));
        return updatedFileData;
    }

    // Delete a file from AsyncStorage
    async deleteFile(fileInput: FileInput): Promise<FileData> {
        const key = this.generateKey(fileInput.id);
        const existingFileString = await AsyncStorage.getItem(key);

        if (!existingFileString) {
            throw new Error(`File with ID ${fileInput.id} not found.`);
        }

        // Remove the file from AsyncStorage
        await AsyncStorage.removeItem(key);

        // Return the deleted file data
        return JSON.parse(existingFileString) as FileData;
    }
}

export default FileLocalRepo;