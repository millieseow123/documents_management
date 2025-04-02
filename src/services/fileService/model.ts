export enum DocumentType {
    File = "file",
    Folder = "folder",
}

export interface FileEntry {
    id: number;
    name: string;
    type: DocumentType;
    createdBy: string;
    date: string;
    size: string;
}