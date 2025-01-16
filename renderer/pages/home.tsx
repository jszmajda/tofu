import { useAtom } from 'jotai';
import React, { FC } from 'react'
import * as atoms from '../lib/atoms';
import { useRouter } from 'next/router';
import { buildDefaultConversation } from '../lib/conversation_tools';
import Link from 'next/link';

interface Props {
}

const HomePage: FC<Props> = ({ }) => {
  const [conversations, setConversations] = useAtom(atoms.conversations);
  const router = useRouter();

  const startNewConversation = () => {
    const conversation = buildDefaultConversation();
    setConversations({...conversations, [conversation.id]: conversation});
    router.push(`/conversation/${conversation.id}`);
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-6">Welcome to Tofu</h1>
        
        <p className="text-lg mb-8">
          Tofu is your AI companion, ready to help you explore ideas, solve problems, 
          and engage in meaningful conversations across various topics.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={startNewConversation}
            className="btn btn-primary btn-lg"
          >
            Start New Conversation
          </button>
          
          <Link href="/settings" className="btn btn-secondary btn-lg">
            Configure Settings
          </Link>
        </div>
        
        {Object.keys(conversations).length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Conversations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(conversations)
                .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())
                .slice(0, 4)
                .map((conversation) => (
                  <Link 
                    key={conversation.id} 
                    href={`/conversation/${conversation.id}`}
                    className="card bg-base-100 shadow-xl hover:bg-base-200 transition-colors"
                  >
                    <div className="card-body">
                      <h3 className="card-title">{conversation.title}</h3>
                      <p className="text-sm text-base-content/70">
                        Last active: {new Date(conversation.lastMessageDate).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage;