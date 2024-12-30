import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { AppState, Message, Model } from '../lib/types';
import { getAvailableModels } from '../lib/bedrock';
import ModelSelector from '../components/ModelSelector';
import ChatPanel from '../components/ChatPanel';
import Sidebar from '../components/Sidebar';
import * as atoms from '../lib/atoms';
import { useAtom } from 'jotai';

interface Props {
}

const HomePage: FC<Props> = ({ }) => {
  const [activeConversation, ] = useAtom(atoms.activeConversation);

  // layout should be a left-hand nav panel, that also shows the conversations from appstate in a scrollable list below the home and settings links. To the right of the nav panel is a full-screen chat window, with a new chat input below the message history.
  return (
    <>
      <Head>
        <title>Tofu - Home</title>
      </Head>
      <div className="h-screen flex overflow-y-hidden">

        <Sidebar />

        <main className="flex flex-col flex-1 p-4">
          <h3 className="text-l font-bold">Conversation: {activeConversation?.title}</h3>
          <div className="mt-4 mb-4">
            <h3 className="text-m font-bold">
              <span className="">Model: </span>
              <span className="">
                <ModelSelector />
              </span>
            </h3>
          </div>
          <ChatPanel />
        </main>
      </div>
    </>
  )
}

export default HomePage;