import { FC, useState, useRef, useEffect } from 'react';
import { AppState, Conversation, Message } from '../lib/types';
import { sendConversation } from '../lib/bedrock';
import MessageView from './MessageView';
import React from 'react';
import * as atoms from '../lib/atoms';
import { useAtom } from 'jotai';

interface Props {
}

const initialMessage: Message = {
  role: 'assistant',
  content: ''
};

const ChatPanel: FC<Props> = ({ }) => {
  const [input, setInput] = useState('');
  const [responseMessage, setResponseMessage] = useState(initialMessage);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const [currentModel, ] = useAtom(atoms.currentModel);
  const [activeConversation, ] = useAtom(atoms.activeConversation);
  const [messages, setMessages] = useAtom(atoms.activeConversationMessages);

  const sendMessage = async () => {
    const userMessage: Message = { role: 'user', content: input };
    const aiMessage: Message = { role: 'assistant', content: '' };

    messages.push(userMessage);
    setMessages(messages);
    setInput('');

    console.log("sending conversation", messages);
    for await (const message of sendConversation(currentModel, messages)){
      aiMessage.content = message.content;
      setResponseMessage(message);
    }

    messages.push(aiMessage);
    setMessages(messages);
    setResponseMessage(undefined);
    console.log("done receiving", aiMessage);
  };

  
  useEffect(() => {
    const scrollToBottom = () => {
      if (shouldAutoScroll && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToBottom();
  }, [shouldAutoScroll, messages, responseMessage]);

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
      <div ref={containerRef} className="grow overflow-y-auto w-full" onScroll={handleScroll}>
          {messages.map((message, id) => (
            <MessageView key={id} id={id.toString()} message={message} />
          ))}
          {responseMessage?.content.length > 0 ? <MessageView key="response" id="response" message={responseMessage} /> : null}
          <div ref={messagesEndRef} />
      </div>
      {!shouldAutoScroll && (
        <button 
          className="fixed bottom-24 left-1/2 btn btn-primary rounded-full"
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
          ↓
        </button>
      )}     
      <div className="gap-4 flex-none box-border">
        <div className="flex">
          <textarea 
            className="flex-1 input input-bordered input-primary p-2" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
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
