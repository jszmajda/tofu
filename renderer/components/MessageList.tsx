import React, { FC } from 'react';
import MessageView from './MessageView';
import { Message } from '../lib/types';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  responseMessage: Message;
  responseRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onTruncate: (messages: Message[]) => void;
}

const MessageList: FC<MessageListProps> = ({
  messages,
  isGenerating,
  responseMessage,
  responseRef,
  messagesEndRef,
  onTruncate,
}) => {
  return (
    <>
      {messages.map((message, index) => (
        <React.Fragment key={message.id}>
          <MessageView id={message.id.toString()} message={message} />
          {message.role === "assistant" && index < messages.length - 1 ? (
            <div className="h-4 group relative">
              <button 
                className="scissors-icon opacity-5 hover:opacity-100 transition absolute left-1/2 transform -translate-x-1/2 hover:bg-base-200 rounded-full p-1"
                onClick={() => onTruncate(messages.slice(0, index + 1))}
              >
                <svg className="fill-base-content" width="32" height="32" viewBox="0 0 498.2 498.2">
                  <path d="M48 363H15a15 15 0 0 0 0 30h33a15 15 0 0 0 0-30zm112 0h-56a15 15 0 0 0 0 30h56a15 15 0 0 0 0-30zm112 0h-56a15 15 0 0 0 0 30h56a15 15 0 0 0 0-30zm112 0h-56a15 15 0 1 0 0 30h56a15 15 0 0 0 0-30zm89 0h-33a15 15 0 1 0 0 30h33a15 15 0 0 0 0-30zm25-93c-1-9-4-17-9-24l-11-11a65 65 0 0 0-41-12l-3 1c-8 0-16 2-24 6l-3 2c-23 12-40 17-52 19a168 168 0 0 1 36-47c5-6 10-13 13-21l1-3c6-20 3-41-8-56a47 47 0 0 0-44-18c-10 1-20 6-28 12a66 66 0 0 0-21 31c-7 20-5 42 7 57a49 49 0 0 0 11 10l-17 39-125 22h-1l-9 2c-11 4-17 14-21 21l-3 10-2 8a4 4 0 0 0 5 4l136-17-20 48h48l26-55 40-5 7 13c11 15 30 23 50 23 24 0 45-12 55-30 6-9 8-19 7-29zm-158-79-4-4c-5-6-6-16-4-23 1-9 7-17 14-23 6-5 14-6 20-3l6 5c4 5 6 13 5 21-2 10-7 20-15 25-6 4-15 7-22 2zm127 85c0 4-2 7-4 10-6 7-16 12-26 12-9 0-20-2-26-10l-1-1c-4-6-3-14 2-20 5-7 13-11 22-12h1c9-1 21 1 28 9l1 1c2 3 4 7 3 11z" />
                </svg>
              </button>
            </div>
          ) : null}
        </React.Fragment>
      ))}
      {isGenerating && (
        <MessageView 
          key={responseMessage.id} 
          id={responseMessage.id.toString()} 
          message={responseMessage} 
          targetRef={responseRef} 
        />
      )}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;