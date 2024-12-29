import { FC, useState } from 'react';
import { AppState, Conversation, Message } from '../lib/types';
import { sendConversation } from '../lib/bedrock';
import MessageView from './MessageView';
import React from 'react';

interface Props {
  appState: AppState;
  updateActiveConversationMessages: (messages: Message[]) => void;
}

const initialMessage: Message = {
  role: 'assistant',
  content: ''
};

const ChatPanel: FC<Props> = ({ appState, updateActiveConversationMessages }) => {
  const [input, setInput] = useState('');
  const [responseMessage, setResponseMessage] = useState(initialMessage)

  const sendMessage = async () => {
    const userMessage: Message = { role: 'user', content: input };
    const aiMessage: Message = { role: 'assistant', content: '' };
    const updatedConversation: Conversation = {
      ...appState.activeConversation,
      messages: [...appState.activeConversation.messages, userMessage]
    };

    console.log("sending conversation", updatedConversation);
    for await (const message of sendConversation(appState.currentModel, updatedConversation)){
      aiMessage.content = message.content;
      setResponseMessage(message);
    }

    updateActiveConversationMessages([...appState.activeConversation.messages, userMessage, aiMessage]);
    setResponseMessage(undefined);
    console.log("done receiving", aiMessage);
    setInput('');
  };

  
  return (
    <React.Fragment>

      <div className="flex box-border grow overflow-y-auto flex-col flex-nowrap">
        {appState.activeConversation.messages.map((message, id) => (
          <MessageView key={id} id={id.toString()} message={message} />
        ))}
        {responseMessage ? <MessageView key="response" id="response" message={responseMessage} /> : null}
      </div>

      <div className="gap-4 flex-none box-border">
        <div className="flex">
          <textarea className="flex-1 border border-gray-300 rounded-md p-2" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={sendMessage}>Send</button>
        </div>
      </div>

    </React.Fragment>
  );


  // return (
  //   <div>
  //     <div>
  //       {appState.activeConversation.messages.map((message, id) => (
  //         <MessageView key={id} id={id.toString()} message={message} />
  //       ))}
  //       {responseMessage ?  <div>Assistant: {responseMessage.content}</div> : null}
  //     </div>
  //     <textarea value={input} onChange={(e) => setInput(e.target.value)} />
  //     <button onClick={sendMessage}>Send</button>
  //   </div>
  // );
};

export default ChatPanel;
