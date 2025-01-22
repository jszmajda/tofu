import { useAtom } from 'jotai';
import React, { FC } from 'react'
import * as atoms from '../lib/atoms';
import { useRouter } from 'next/router';
import { buildDefaultConversation } from '../lib/conversation_tools';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface Props {
}

const setupMessages = `

Note that in order for Tofu to be able to talk with AWS Bedrock, you need to
have \`aws configure export-credentials\` run correctly. If you run it from the
console, it should return something like \` { "AccessKeyId": "XXXXXXXXXXXXXXXX",
"SecretAccessKey": "XXXXXXXXXXXXXXX" } \`

`;

const HomePage: FC<Props> = ({ }) => {
  const [conversations, setConversations] = useAtom(atoms.conversations);
  const router = useRouter();

  const startNewConversation = () => {
    const conversation = buildDefaultConversation();
    setConversations({...conversations, [conversation.id]: conversation});
    router.push(`/conversation/${conversation.id}`);
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-8 text-center">
      <div className="max-w-xl backdrop-blur-md bg-base-100 p-10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.25)] border border-base-100/10 hover:border-base-100/20 transition-all duration-500">
        <h1 className="text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient-x">
          Welcome to Tofu
        </h1>
        
        <p className="text-xl mb-10 leading-relaxed font-light">
          Tofu is your AI companion, ready to help you explore ideas, solve problems, 
          and engage in meaningful conversations across various topics.
        </p>

        <p className="prose mb-10 items-start">
          <ReactMarkdown>{setupMessages}</ReactMarkdown>
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-14">
          <button 
            onClick={startNewConversation}
            className="btn btn-lg btn-primary transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/50 animate-pulse-slow"
          >
            ✨ Start New Conversation
          </button>
          
          <Link href="/settings" className="btn btn-lg btn-secondary transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-secondary/50">
            ⚙️ Configure Settings
          </Link>
        </div>
        
        {Object.keys(conversations).length > 0 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-8 inline-block border-b-2 border-primary/50 pb-2 bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
              Recent Conversations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.values(conversations)
                .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())
                .slice(0, 4)
                .map((conversation) => (
                  <Link 
                    key={conversation.id} 
                    href={`/conversation/${conversation.id}`}
                    className="card glass bg-base-100/30 backdrop-blur-lg shadow-2xl hover:shadow-3xl hover:bg-base-200/40 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className="card-body">
                      <h3 className="card-title text-xl text-primary/90 font-semibold">{conversation.title}</h3>
                      <p className="text-sm text-base-content/80 font-medium">
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