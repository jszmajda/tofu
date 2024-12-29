import { FC } from 'react';
import { Conversation } from '../lib/types';

interface Props {
  conversations: Conversation[];
}

const ConversationList: FC<Props> = ({ conversations }) => {
  return (
    <div>
      {conversations.map((conv) => (
        <div key={conv.id}>{conv.title}</div>
      ))}
    </div>
  );
};

export default ConversationList;
