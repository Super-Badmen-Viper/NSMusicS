import {NineSong_Api_Services_Web} from "../Scene/Music/NineSong_Api_Services_Web";

export class Folder_Entity_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async browseFolder_Entity(path: string): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'folders',
                {
                    path
                },
                {}
            );
            return result["ninesong-response"]["folders"] as any[]
        }catch (error) {
            console.error("Error fetching libraries:", error);
        }
        return []
    }

    public async createFolder_Entity(
        name: string, path: string, folder_type: number
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'libraries',
            {},
            {
                name,
                path,
                folder_type
            }
        );
    }
    public async updateFolder_Entity(id: string, newName: string, newFolderPath: string): Promise<any> {
        return this.sendRequest(
            'PUT',
            'libraries',
            {
                id,
                newName,
                newFolderPath
            },
            {}
        );
    }
    public async deleteFolder_Entity(id: string,): Promise<any> {
        return this.sendRequest(
            'DELETE',
            'libraries',
            {
                id,
            },
            {}
        );
    }
    public async getFolder_Entity_All(): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'libraries',
                {},
                {}
            );
            const libraries = result["ninesong-response"]["libraries"] as any[];
            return libraries.map(lib => ({
                id: lib.ID,
                name: lib.Name,
                folderPath: lib.FolderPath,
                folderType: lib.FolderType,
                status: lib.Status,
                createdAt: lib.CreatedAt,
                updatedAt: lib.UpdatedAt,
                lastScanned: lib.LastScanned,
                fileCount: lib.FileCount,
                show: false
            }));
        }catch (error) {
            console.error("Error fetching libraries:", error);
        }
        return []
    }
}