export {}; 

declare global {
  interface Window {
    obsidianAPI?: {
      loadDocument: (pathAndFilename: string, vaultPath: string) => Promise<ObsidianResult<string>>;
      findFile: (title: string, vaultPath: string) => Promise<ObsidianResult<string>>;
    };
  }
}