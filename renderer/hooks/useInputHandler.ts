import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  const updateInputContent = useCallback((content: string) => {
    setInput(content);
    if (inputRef.current) {
      inputRef.current.textContent = content;
    }
  }, []);

  const handleInputChange = useCallback((newContent: string) => {
    updateInputContent(newContent);
    if (activeConversation?.id) {
      setUnsentMessagesMap((prev: UnsentMessagesMap) => ({
        ...prev,
        [activeConversation.id]: newContent
      }));
    }
  }, [activeConversation?.id, setUnsentMessagesMap, updateInputContent]);

  const handleSend = async () => {
    const processedInput = await preProcessMessage(input);
    
    // Clear input immediately before sending
    const originalInput = input;
    updateInputContent('');

    // Clear unsent message for this conversation
    if (activeConversation?.id) {
      setUnsentMessagesMap((prev: UnsentMessagesMap) => {
        const newMap = { ...prev };
        delete newMap[activeConversation.id];
        return newMap;
      });
    }
  
    const result = await onSendMessage(originalInput, processedInput);
  
    // If there's an error, restore the original input
    if (result.error) {
      updateInputContent(originalInput);
      if (activeConversation?.id) {
        setUnsentMessagesMap((prev: UnsentMessagesMap) => ({
          ...prev,
          [activeConversation.id]: originalInput
        }));
      }
    }
  };

  // Load unsent message when conversation changes
  useEffect(() => {
    if (!activeConversation?.id) return;

    const savedContent = unsentMessagesMap[activeConversation.id] || '';
    updateInputContent(savedContent);
    
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Set cursor to end of content
      const range = document.createRange();
      const selection = window.getSelection();
      if (selection) {
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [activeConversation?.id, unsentMessagesMap, updateInputContent]);

  return {
    input,
    inputRef,
    handleInputChange,
    handleSend
  };
};