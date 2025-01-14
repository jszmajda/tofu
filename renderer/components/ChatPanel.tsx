'use client';
import { FC, useState, useRef, useEffect } from 'react';
import { AppState, Conversation, Message } from '../lib/types';
import { sendConversation } from '../lib/bedrock';
import MessageView from './MessageView';
import React from 'react';
import * as atoms from '../lib/atoms';
import { useAtom } from 'jotai';
import { buildNewMessage, updateConversationMessages } from '../lib/conversation_tools';
import { marked } from 'marked';
import NoSSR from './NoSSR';

interface Props {
}

const ChatPanel: FC<Props> = ({ }) => {
  const [input, setInput] = useState('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const responseRef = useRef(null);
  const inputRef = useRef<HTMLDivElement>(null);


  const [currentModel, ] = useAtom(atoms.currentModel);
  const [activeConversation, setActiveConversation] = useAtom(atoms.activeConversation);
  const [messages, setActiveConversationMessages]: [Message[], any] = useAtom(atoms.activeConversationMessages);
  const [systemPrompt, ] = useAtom(atoms.systemPrompt);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeConversation]);

  const responseMessage: Message = {
    id: -1,
    role: "assistant",
    content: "",
    timestamp: new Date(),
    modelId: currentModel.modelId, 
    modelName: currentModel.name,
  }

  const sendMessage = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    const originalInput = input;
    const nextMessages: Message[] = [...messages];
    const userMessage: Message = buildNewMessage(nextMessages, 'user', input, currentModel);
    const model = activeConversation.currentModel || currentModel;
    setInput('');

    // Add user message immediately
    nextMessages[userMessage.id] = userMessage;
    setActiveConversationMessages([...nextMessages]); // Create new array to trigger re-render
    const nextConversationWithUser = updateConversationMessages(activeConversation, nextMessages);
    setActiveConversation(nextConversationWithUser);

    try {
      const aiMessage: Message = buildNewMessage(nextMessages, 'assistant', '', currentModel);
      for await (const message of sendConversation(model, systemPrompt, nextMessages, aiMessage)){
        responseMessage.content = message.content;
        if (responseRef) {
          responseRef.current.innerHTML = marked.parse(message.content)
          handleScroll(null);
          scrollToBottom();
        }
      }

      nextMessages[aiMessage.id] = aiMessage;
      setActiveConversationMessages(nextMessages);
      const nextConversation = updateConversationMessages(activeConversation, nextMessages);
      setActiveConversation(nextConversation);
    } catch (error) {
      // Remove the user message from the conversation
      const messagesWithoutUser = nextMessages.slice(0, -1);
      setActiveConversationMessages(messagesWithoutUser);
      const nextConversationWithoutUser = updateConversationMessages(activeConversation, messagesWithoutUser);
      setActiveConversation(nextConversationWithoutUser);
      
      // Restore the original input
      setInput(originalInput);
      if (inputRef.current) {
        inputRef.current.textContent = originalInput;
      }
      // Set error message to be displayed
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  
  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      messagesEndRef.current.scrollIntoView();
    }
  };

  // scroll to bottom on message updates
  useEffect(() => {
    scrollToBottom();
  }, [shouldAutoScroll, messages, responseRef, activeConversation]);

  // scroll to bottom on load
  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleScroll = (e) => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // If we're not near the bottom, disable auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  return (
    <NoSSR>

      <div ref={containerRef} className="grow overflow-y-auto w-full overscroll-contain" onScroll={handleScroll}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <MessageView id={message.id.toString()} message={message} />
              { message.role === "assistant" && index < messages.length - 1 ? 
              <div className="h-4 group relative">
                <button 
                  className="scissors-icon opacity-5 hover:opacity-100 transition absolute left-1/2 transform -translate-x-1/2 hover:bg-base-200 rounded-full p-1"
                  onClick={() => {
                    const newMessages = messages.slice(0, index + 1);
                    setActiveConversationMessages(newMessages);
                    const nextConversation = updateConversationMessages(activeConversation, newMessages);
                    setActiveConversation(nextConversation);
                  }}
                >
                  <svg className="fill-base-content" width="32" height="32" viewBox="0 0 498.2 498.2">
                    <path d="M48 363H15a15 15 0 0 0 0 30h33a15 15 0 0 0 0-30zm112 0h-56a15 15 0 0 0 0 30h56a15 15 0 0 0 0-30zm112 0h-56a15 15 0 0 0 0 30h56a15 15 0 0 0 0-30zm112 0h-56a15 15 0 1 0 0 30h56a15 15 0 0 0 0-30zm89 0h-33a15 15 0 1 0 0 30h33a15 15 0 0 0 0-30zm25-93c-1-9-4-17-9-24l-11-11a65 65 0 0 0-41-12l-3 1c-8 0-16 2-24 6l-3 2c-23 12-40 17-52 19a168 168 0 0 1 36-47c5-6 10-13 13-21l1-3c6-20 3-41-8-56a47 47 0 0 0-44-18c-10 1-20 6-28 12a66 66 0 0 0-21 31c-7 20-5 42 7 57a49 49 0 0 0 11 10l-17 39-125 22h-1l-9 2c-11 4-17 14-21 21l-3 10-2 8a4 4 0 0 0 5 4l136-17-20 48h48l26-55 40-5 7 13c11 15 30 23 50 23 24 0 45-12 55-30 6-9 8-19 7-29zm-158-79-4-4c-5-6-6-16-4-23 1-9 7-17 14-23 6-5 14-6 20-3l6 5c4 5 6 13 5 21-2 10-7 20-15 25-6 4-15 7-22 2zm127 85c0 4-2 7-4 10-6 7-16 12-26 12-9 0-20-2-26-10l-1-1c-4-6-3-14 2-20 5-7 13-11 22-12h1c9-1 21 1 28 9l1 1c2 3 4 7 3 11z" />
                  </svg>
                </button>
              </div>
              : "" }
            </React.Fragment>
          ))}
          {isGenerating ? 
            <MessageView key={responseMessage.id} id={responseMessage.id.toString()} message={responseMessage} targetRef={responseRef} />
          : ""}
          <div ref={messagesEndRef} />
      </div>
      {!shouldAutoScroll && (
        <button 
          className="fixed bottom-24 left-1/2 btn btn-primary rounded-full icon-inline icon-arrow-down"
          onClick={() => {
            if (containerRef.current) {
              // Add smooth scrolling behavior
              containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
              });
              setShouldAutoScroll(true);
            }
          }}
        >
          <svg className="stroke-primary-content" width="16" height="16" viewBox="0 0 330 330"><path d="M254 234c-2-5-8-9-14-9h-60V15a15 15 0 0 0-30 0v210H90a15 15 0 0 0-11 26l75 75a15 15 0 0 0 22 0l75-75c4-5 5-11 3-17zm-89 60-39-39h78l-39 39z"/></svg>
        </button>
      )}     
      <div className="gap-4 flex-none box-border mt-3">
        {errorMessage && (
          <div className="alert alert-error mb-2">
            <span>{errorMessage}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setErrorMessage(null)}>Dismiss</button>
          </div>
        )}
        <div className="flex">
          <div
            className="flex-1 input input-primary py-2 overflow-y-auto whitespace-pre-wrap min-h-[3rem] rounded-r-none rounded-bl-none focus:-outline-offset-2"
            style={{ 
              maxHeight: '50vh',
              height: 'fit-content',
              resize: 'none'
            }}
            contentEditable={true}
            role="textbox"
            onInput={(e) => {
              setInput(e.currentTarget.textContent || '');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            // Use ref to access and clear the div
            ref={(el) => {
              inputRef.current = el;
              if (input === '' && el) {
                el.innerHTML = '';
              }
            }}
          />
          <button className="py-2 px-4 btn btn-primary rounded-l-none" onClick={sendMessage}>Send</button>
        </div>
      </div>

    </NoSSR>
  );
};

export default ChatPanel;
