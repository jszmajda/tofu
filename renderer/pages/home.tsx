import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { AppState, Message, Model } from '../lib/types';
import { getAvailableModels } from '../lib/bedrock';
import ModelSelector from '../components/ModelSelector';
import ChatPanel from '../components/ChatPanel';
import Sidebar from '../components/Sidebar';
import * as atoms from '../lib/atoms';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

interface Props {
}

const HomePage: FC<Props> = ({ }) => {
  
  // layout should be a left-hand nav panel, that also shows the conversations from appstate in a scrollable list below the home and settings links. To the right of the nav panel is a full-screen chat window, with a new chat input below the message history.
  return (
    <div>
      Start a new conversation!
    </div>
  )
}

export default HomePage;