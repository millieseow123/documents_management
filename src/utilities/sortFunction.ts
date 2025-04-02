import { FileEntry } from '@/services/fileService/model';

export function sortByDate(data: FileEntry[], direction: 'asc' | 'desc'): FileEntry[] {
    return [...data].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
    });
}

export function sortByName(data: FileEntry[], direction: 'asc' | 'desc'): FileEntry[] {
    return [...data].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return direction === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });
}
