interface ObsidianResult<T> {
  success: boolean;
  error?: string;
  content?: T;
}

export class ObsidianService {
  static async loadDocument(pathAndFilename: string, vaultPath: string): Promise<ObsidianResult<string>> {
    try {
      const result = await window.obsidianAPI.loadDocument(pathAndFilename, vaultPath);
      return result;
    } catch (error) {
      console.error('Failed to load document:', error);
      return { success: false, error: error.message };
    }
  }

  static async findFile(title: string, vaultPath: string): Promise<ObsidianResult<string>> {
    try {
      const result = await window.obsidianAPI.findFile(title, vaultPath);
      return result;
    } catch (error) {
      console.error('Failed to find file:', error);
      return { success: false, error: error.message };
    }
  }
}