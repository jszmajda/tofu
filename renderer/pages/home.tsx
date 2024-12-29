import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AppState, Message, Model } from '../lib/types';
import { getAvailableModels } from '../lib/bedrock';
import ModelSelector from '../components/ModelSelector';
import ConversationList from '../components/ConversationList';
import ChatPanel from '../components/ChatPanel';

const initialAppState: AppState = {
    currentModel: null,
    conversations: [],
    activeConversation: {
        id: 0,
        title: 'New Conversation',
        messages: [
            { role: 'user', content: 'test'},
            { role: 'assistant', content: 'Hello! I\'m ready to help you. What would you like to do?'},
            { role: 'user', content: 'write a limmerick?'},
            { role: 'assistant', content: 'Here\'s a limerick for you:\n\nThere once was a cat from Nantucket\nWho carried his lunch in a bucket\n    He meowed with delight\n    At his fishy bite\nAnd said, "This meal\'s simply untrucked!"\n\nWould you like me to write another one?'}
        ],
        totalCost: 0
    }
};

export default function HomePage() {
  const [appState, setAppState] = useState(initialAppState);
    const [models, setModels] = useState<Model[]>([]);

    const setModel = (model: Model) => {
        setAppState({
            ...appState,
            currentModel: model
        });
    };

    const updateActiveConversationMessages = (messages: Message[]) => {
        setAppState({
            ...appState,
            activeConversation: {
                ...appState.activeConversation,
                messages
            }
        });
    };


    useEffect(() => {
        (async () => {
            const models = await getAvailableModels();
            setModels(models);
            if(appState.currentModel == null){
                appState.currentModel = models[0];
            }
        })();
    }, []);


  // layout should be a left-hand nav panel, that also shows the conversations from appstate in a scrollable list below the home and settings links. To the right of the nav panel is a full-screen chat window, with a new chat input below the message history.
  return (
    <React.Fragment>
      <Head>
        <title>Tofu - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="h-screen flex bg-gray-200 overflow-y-hidden">
        <aside className="w-auto bg-gray-800 text-white p-4">
          <div className="flex items-center mb-4">
            <Image src="/images/logo.png" alt="Tofu Logo" width={32} height={32} className="mr-2" />
            <h1 className="text-2xl font-bold">Tofu</h1>
          </div>
          <ul className="space-y-2">
            <li>
              <Link href="/home" className="block hover:bg-gray-700 p-2 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link href="/settings" className="block hover:bg-gray-700 p-2 rounded">
                Settings
              </Link>
            </li>
          </ul>
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              New Chat
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-m font-bold">Conversations</h3>
            <ul className="space-y-2">
              {appState.conversations.map((conv) => (
                <li key={conv.id}>
                  <Link href={`/conversation/${conv.id}`} className="block hover:bg-gray-700 p-2 rounded">
                    {conv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="flex flex-col flex-1 p-4">
          <h3 className="text-l font-bold">Conversation: {appState.activeConversation?.title}</h3>
          <div className="mt-4">
            <h3 className="text-m font-bold">
              <span className="text-gray-600">Model: </span>
              <span className="text-gray-600">
                <ModelSelector models={models} setModel={setModel}/>
              </span>
            </h3>
          </div>
          <ChatPanel appState={appState} updateActiveConversationMessages={updateActiveConversationMessages} />
        </main>
      </div>
    </React.Fragment>
  )
}
