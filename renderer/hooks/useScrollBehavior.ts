import { useEffect, useRef, useState, useCallback } from 'react';
import { Conversation, Message } from '../lib/types';

interface ScrollBehaviorOptions {
  messages: Message[]; 
  responseRef: React.RefObject<HTMLElement>;
  activeConversation: Conversation;
}

export const useScrollBehavior = ({ 
  messages, 
  responseRef, 
  activeConversation 
}: ScrollBehaviorOptions) => {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [shouldAutoScroll]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  }, []);

  const scrollToBottomSmooth = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShouldAutoScroll(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, messages, responseRef, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return {
    containerRef,
    messagesEndRef,
    shouldAutoScroll,
    handleScroll,
    scrollToBottomSmooth
  };
};
