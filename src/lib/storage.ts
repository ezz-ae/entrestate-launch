export interface UploadResult {
  url: string;
  path: string;
}

export const ProjectLibrary = {
  /**
   * Uploads a file to the specific project folder.
   */
  uploadAsset: async (
    projectId: string,
    file: File,
    type: 'images' | 'brochures' | 'floorplans'
  ): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('type', type);

    const response = await fetch('/api/storage/project', {
      method: 'POST',
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error?.message || 'Failed to upload asset.');
    }
    return payload.data as UploadResult;
  },

  /**
   * Lists all assets for a project.
   */
  getAssets: async (projectId: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `/api/storage/project?projectId=${encodeURIComponent(projectId)}&type=images`
      );
      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        console.error('Error fetching assets:', payload?.error || response.statusText);
        return [];
      }
      return payload.data.urls || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  },

  /**
   * "Purification" Helper: Takes a scraped URL, downloads it, and uploads to our storage.
   */
  migrateExternalAsset: async (
    projectId: string,
    externalUrl: string,
    type: 'images' | 'brochures'
  ): Promise<string> => {
    try {
      const response = await fetch(externalUrl);
      const blob = await response.blob();
      const ext = externalUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const filename = `imported-${Date.now()}.${ext}`;
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      const { url } = await ProjectLibrary.uploadAsset(projectId, file, type);
      return url;
    } catch (error) {
      console.error(`Failed to migrate asset for ${projectId}:`, error);
      return externalUrl;
    }
  },
};
