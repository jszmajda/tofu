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

interface Props {
}

const ChatPanel: FC<Props> = ({ }) => {
  const [input, setInput] = useState('');
  // const [responseMessage, setResponseMessage] = useState(initialMessage);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const responseRef = useRef(null);

  const [currentModel, ] = useAtom(atoms.currentModel);
  const [activeConversation, setActiveConversation] = useAtom(atoms.activeConversation);
  const [messages, setActiveConversationMessages]: [Message[], any] = useAtom(atoms.activeConversationMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const responseMessage: Message = {id: -1, role: "assistant", content: "", timestamp: new Date(), modelId: currentModel.modelId}

  const sendMessage = async () => {
    setIsGenerating(true);
    const nextMessages: Message[] = [...messages];
    const userMessage: Message = buildNewMessage(nextMessages, 'user', input, currentModel);
    nextMessages[userMessage.id] = userMessage;
    setActiveConversationMessages(nextMessages);

    const aiMessage: Message = buildNewMessage(nextMessages, 'assistant', '', currentModel);
    const model = activeConversation.currentModel || currentModel;
    setInput('');

    // setMessages(nextMessages);

    for await (const message of sendConversation(model, nextMessages, aiMessage)){
      responseMessage.content = message.content;
      if (responseRef) {
        responseRef.current.innerHTML = marked.parse(message.content)
        handleScroll(null);
        scrollToBottom();
      }
    }

    setIsGenerating(false);

    nextMessages[aiMessage.id] = aiMessage;
    setActiveConversationMessages(nextMessages);
    const nextConversation = updateConversationMessages(activeConversation, nextMessages);
    setActiveConversation(nextConversation);
  };

  
  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      messagesEndRef.current.scrollIntoView();
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [shouldAutoScroll, messages, responseRef, activeConversation]);

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
    <React.Fragment>
      <div ref={containerRef} className="grow overflow-y-auto w-full overscroll-contain" onScroll={handleScroll}>
          {messages.map((message) => (
            <MessageView key={message.id} id={message.id.toString()} message={message} />
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
          <img src="/images/down-arrow-svgrepo-com.svg" width="16" />
        </button>
      )}     
      <div className="gap-4 flex-none box-border mt-3">
        <div className="flex">
          <div
            className="flex-1 input input-bordered input-primary p-2 overflow-y-auto whitespace-pre-wrap min-h-[2rem]"
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
              if (input === '' && el) {
                el.innerHTML = '';
              }
            }}
          />
          <button className="py-2 px-4 btn btn-primary" onClick={sendMessage}>Send</button>
        </div>
      </div>

    </React.Fragment>
  );
};

export default ChatPanel;
