'use client';
import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import * as atoms from '../../lib/atoms';
import ModelSelector from "../../components/ModelSelector";
import ChatPanel from "../../components/ChatPanel";
import { useRouter } from "next/router";
import React from "react";

interface Props {

}

const ConversationPage: FC<Props> = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [activeConversation,] = useAtom(atoms.activeConversation);
  const [activeConversationId, setActiveConversationId] = useAtom(atoms.activeConversationId);

  useEffect(() => {
    // on navigation, set the active conversation id to the routed id
    if (id && id.length > 0 && activeConversationId !== id) {
      setActiveConversationId(id);
    }
  }, [router.asPath]);

  return (
    <div className="flex flex-col flex-1 p-4 h-screen overflow-y-hidden w-full">
      {activeConversation ?
        <React.Fragment>

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
        </React.Fragment>
      : "" }
    </div>
  )
}
export default ConversationPage;