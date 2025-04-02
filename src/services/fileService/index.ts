//import { DocumentType, FileEntry } from "./model";

/* Mock API below, uncomment for mock data */
// export async function getAllDocuments(): Promise<FileEntry[]> {
//     const mockData: FileEntry[] = Array.from({ length: 50 }, (_, i) => {
//         const isFolder = i % 3 === 0;
//         const date = new Date(2024, Math.floor(i / 4) % 12, (i % 28) + 1);
//         return {
//             id: i + 1,
//             name: isFolder
//                 ? `Folder ${i + 1}`
//                 : `2024_0${(i % 9) + 1}_${(i % 28) + 1}_Document_${i + 1}.pdf`,
//             type: isFolder ? DocumentType.Folder : DocumentType.File,
//             createdBy: `User ${i + 1}`,
//             date: date.toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//             }),
//             size: isFolder ? "-" : `${(Math.random() * 5 + 0.5).toFixed(1)} KB`,
//         };
//     });

//     return Promise.resolve(mockData);
// }

export async function getAllDocuments() {
    const res = await fetch('/api');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
}
