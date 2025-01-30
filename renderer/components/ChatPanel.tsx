'use client';
import { FC, useRef, useEffect } from 'react';
import React from 'react';
import * as atoms from '../lib/atoms';
import { useAtom } from 'jotai';
import { updateConversationMessages } from '../lib/conversation_tools';
import NoSSR from './NoSSR';
import { useScrollBehavior } from '../hooks/useScrollBehavior';
import { useObsidianProcessor } from '../hooks/useObsidianProcessor';
import { Message } from '../lib/types';
import { MessageHandlerActions, MessageHandlerContext } from '../types/chat';
import { useMessageHandler } from '../hooks/useMessageHandler';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useInputHandler } from '../hooks/useInputHandler';

interface Props {
}

const ChatPanel: FC<Props> = ({ }) => {
  const [unsentMessagesMap, setUnsentMessagesMap] = useAtom(atoms.unsentMessages);
  const responseRef = useRef(null);
  const [currentModel, ] = useAtom(atoms.currentModel);
  const [activeConversation, setActiveConversation] = useAtom(atoms.activeConversation);
  const [messages, setActiveConversationMessages]: [Message[], any] = useAtom(atoms.activeConversationMessages);
  const [systemPrompt, ] = useAtom(atoms.systemPrompt);
  const [obsidianVaultPath, ] = useAtom(atoms.obsidianVaultPath);

  const { preProcessMessage } = useObsidianProcessor(obsidianVaultPath);

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      messagesEndRef.current.scrollIntoView();
    }
  };

  const {
    containerRef,
    messagesEndRef,
    shouldAutoScroll,
    handleScroll,
    scrollToBottomSmooth
  } = useScrollBehavior({
    messages,
    responseRef,
    activeConversation
  });

  const messageHandlerContext: MessageHandlerContext = {
    activeConversation,
    currentModel,
    systemPrompt,
    responseRef,
    scrollHandlers: {
      handleScroll,
      scrollToBottom
    }
  };

  const messageHandlerActions: MessageHandlerActions = {
    setActiveConversation,
    setActiveConversationMessages,
    setUnsentMessagesMap
  };

  const {
    sendMessage,
    isGenerating,
    errorMessage,
    setErrorMessage,
    responseMessage
  } = useMessageHandler(messageHandlerContext, messageHandlerActions);

  const handleTruncate = (newMessages: Message[]) => {
    setActiveConversationMessages(newMessages);
    const nextConversation = updateConversationMessages(activeConversation, newMessages);
    setActiveConversation(nextConversation);
  };

  const {
    input,
    inputRef,
    handleInputChange,
    handleSend
  } = useInputHandler({
    activeConversation,
    unsentMessagesMap,
    setUnsentMessagesMap,
    onSendMessage: sendMessage,
    preProcessMessage
  });

  return (
    <NoSSR>

      <div ref={containerRef} className="grow overflow-y-auto w-full overscroll-contain" onScroll={handleScroll}>
      <MessageList 
          messages={messages}
          isGenerating={isGenerating}
          responseMessage={responseMessage}
          responseRef={responseRef}
          messagesEndRef={messagesEndRef}
          onTruncate={handleTruncate}
        />
      </div>
      {!shouldAutoScroll && (
        <button 
          className="fixed bottom-24 left-1/2 btn btn-primary rounded-full icon-inline icon-arrow-down"
          onClick={scrollToBottomSmooth}
        >
          <svg className="stroke-primary-content" width="16" height="16" viewBox="0 0 330 330"><path d="M254 234c-2-5-8-9-14-9h-60V15a15 15 0 0 0-30 0v210H90a15 15 0 0 0-11 26l75 75a15 15 0 0 0 22 0l75-75c4-5 5-11 3-17zm-89 60-39-39h78l-39 39z"/></svg>
        </button>
      )}     

      <ChatInput
        input={input}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onSend={handleSend}
        errorMessage={errorMessage}
        onDismissError={() => setErrorMessage(null)}
      />
    </NoSSR>
  );
};

export default ChatPanel;
