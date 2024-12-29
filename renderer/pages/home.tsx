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


  return (
    <React.Fragment>
      <Head>
        <title>Tofu - Home</title>
      </Head>
      <div className="h-screen flex items-center justify-center bg-gray-200">

        <ModelSelector models={models} setModel={setModel} />
        <ConversationList conversations={appState.conversations} />
        <ChatPanel appState={appState} updateActiveConversationMessages={updateActiveConversationMessages} />
      </div>
    </React.Fragment>
  )
}
