import { FileRepo } from "@/core/repository";
import { FileData, FileInput, NO_FILE } from "@/core/model";
import { axiosPost, axiosPut, axiosGet, axiosDelete } from '@/utils/axios';


export class FileBackRepo implements FileRepo {
    async uploadFile(file: FileInput): Promise<FileData> {
        return (await axiosPost('file/create', file.file)) || NO_FILE;
    }
    async getFile(fileId: string): Promise<FileData> {
        return (await axiosGet('file/' + fileId)) || NO_FILE;
    }
    async updateFile(file: FileData): Promise<FileData> {
        return (await axiosPut('file/update' + file.id, file)) || NO_FILE;
    }
    async deleteFile(fileId: string): Promise<boolean> {
        return (await axiosDelete('file/delete/' + fileId)) || false;
    }

}