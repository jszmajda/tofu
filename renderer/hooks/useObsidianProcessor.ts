import { useCallback } from 'react';
import { ObsidianService } from '../lib/obsidianService';

export const useObsidianProcessor = (vaultPath: string | null) => {
  const preProcessMessage = useCallback(async (message: string): Promise<string> => {
    if (!vaultPath) {
      return message;
    }

    // Match !!load followed by text until either a newline or closing tag
    const regex = /!!load\s+([^<>\n]+?)(?=\s*$|\s*<|[\n])/g;
    let processedMessage = message;
    let match;

    while ((match = regex.exec(message)) !== null) {
      const filename = match[1];
      const fileResult = await ObsidianService.findFile(filename, vaultPath);
      
      if (fileResult.success && fileResult.content) {
        const documentResult = await ObsidianService.loadDocument(fileResult.content, vaultPath);
        if (documentResult.success && documentResult.content) {
          processedMessage = processedMessage.replace(match[0], documentResult.content);
        }
      }
    }

    return processedMessage;
  }, [vaultPath]);

  return { preProcessMessage };
};