import { useRef, useCallback, useEffect } from 'react';
import TurndownService from 'turndown';

interface PasteHandlerOptions {
  onContentChange: (content: string) => void;
  inputRef: React.RefObject<HTMLDivElement>;
}

export const usePasteHandler = ({ onContentChange, inputRef }: PasteHandlerOptions) => {
  // Keep turndownService instance stable across renders
  const turndownService = useRef(
    new TurndownService({
      codeBlockStyle: 'fenced',
      fence: '```'
    })
  ).current;

  //configure turndown service to filter out data:images
  useEffect(() => {
    turndownService.addRule('filterImages', {
      filter: ['img'],
      replacement: function(content) {
        return '';
      }
    });
  }, [turndownService]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!inputRef.current) return;
    
    const clipboardData = e.clipboardData;
    const pastedHTML = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');
    
    let processedContent;
    if (pastedHTML) {
      try {
        const temp = document.createElement('div');
        temp.innerHTML = pastedHTML;
        
        // Transform div>code to pre>code
        const divCodes = temp.querySelectorAll('div > code');
        divCodes.forEach(code => {
          const pre = document.createElement('pre');
          pre.appendChild(code.cloneNode(true));
          code.parentElement.replaceWith(pre);
        });
        
        processedContent = turndownService.turndown(temp.innerHTML);
      } catch (error) {
        console.error('Failed to convert HTML to Markdown:', error);
        processedContent = plainText;
      }
    } else {
      processedContent = plainText;
    }
  
    // Insert at cursor position
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(processedContent));
    
    // Update cursor position
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Wait for DOM update before getting new content
    requestAnimationFrame(() => {
      const newContent = inputRef.current.textContent || '';
      onContentChange(newContent);
    });
  }, [onContentChange, inputRef]);

  return { handlePaste };
};