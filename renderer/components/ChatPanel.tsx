import { FC, useState } from 'react';
import { AppState, Conversation, Message } from '../lib/types';
import { sendConversation } from '../lib/bedrock';
import MessageView from './MessageView';

interface Props {
  appState: AppState;
  updateActiveConversationMessages: (messages: Message[]) => void;
}

const initialMessage: Message = {
  role: 'user',
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
    <div>
      <div>
        <h2>Active Conversation</h2>
        {appState.activeConversation.messages.map((message, id) => (
          <MessageView key={id} id={id.toString()} message={message} />
        ))}
        {responseMessage ?  <div>Assistant: {responseMessage.content}</div> : null}
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPanel;
