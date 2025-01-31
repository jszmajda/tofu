import { useRef, useEffect, useCallback } from 'react';
import { Conversation } from '../lib/types';

type UnsentMessagesMap = Record<string, string>;

interface InputHandlerProps {
  activeConversation: Conversation;
  unsentMessagesMap: UnsentMessagesMap;
  setUnsentMessagesMap: (value: UnsentMessagesMap | ((prev: UnsentMessagesMap) => UnsentMessagesMap)) => void;
  onSendMessage: (original: string, processed: string) => Promise<{ error?: boolean }>;
  preProcessMessage: (input: string) => Promise<string>;
}

export const useInputHandler = ({
  activeConversation,
  unsentMessagesMap,
  setUnsentMessagesMap,
  onSendMessage,
  preProcessMessage
}: InputHandlerProps) => {
  const inputRef = useRef<HTMLDivElement>(null);


  const handleInputChange = useCallback((newContent: string) => {
    if (activeConversation?.id) {
      setUnsentMessagesMap((prev: UnsentMessagesMap) => ({
        ...prev,
        [activeConversation.id]: newContent
      }));
    }
  }, [activeConversation?.id, setUnsentMessagesMap]);

  const handleSend = async () => {
    const currentContent = inputRef.current?.textContent || '';
    const processedInput = await preProcessMessage(currentContent);
    
    // Clear input immediately before sending
    inputRef.current.textContent = '';

    // Clear unsent message for this conversation
    if (activeConversation?.id) {
      setUnsentMessagesMap((prev: UnsentMessagesMap) => {
        const newMap = { ...prev };
        delete newMap[activeConversation.id];
        return newMap;
      });
    }
  
    const result = await onSendMessage(currentContent, processedInput);
  
    // If there's an error, restore the original input
    if (result.error && inputRef.current) {
      inputRef.current.textContent = currentContent;
      if (activeConversation?.id) {
        setUnsentMessagesMap((prev: UnsentMessagesMap) => ({
          ...prev,
          [activeConversation.id]: currentContent
        }));
      }
    }
  };

  // Load unsent message when conversation changes
  useEffect(() => {
    if (!activeConversation?.id) return;
  
    const savedContent = unsentMessagesMap[activeConversation.id] || '';
    inputRef.current.textContent = savedContent

    if (!inputRef.current) return;
    
    inputRef.current.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    if (selection) {
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [activeConversation?.id]);
  

  return {
    inputRef,
    handleInputChange,
    handleSend
  };
};