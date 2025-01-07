'use client';
import { useAtom } from "jotai";
import { act, FC, useEffect, useMemo, useState } from "react";
import * as atoms from '../../lib/atoms';
import ModelSelector from "../../components/ModelSelector";
import ChatPanel from "../../components/ChatPanel";
import { useRouter } from "next/router";
import React from "react";
import { generateTitle } from "../../lib/bedrock";
import DateFmt from "../../components/DateFmt";
import { costOfConversation, maxTokensUsed, totalTokensUsed, usedContextWindow } from "../../lib/conversation_tools";

interface Props {

}

const ConversationPage: FC<Props> = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [generating, setGenerating] = useState(false);

  const [conversations, setConversations] = useAtom(atoms.conversations);
  const [activeConversation,] = useAtom(atoms.activeConversation);
  const [activeConversationId, setActiveConversationId] = useAtom(atoms.activeConversationId);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const [model,] = useAtom(atoms.currentModel);
  const [availableModels, ] = useAtom(atoms.availableModels);

  useEffect(() => {
    // on navigation, set the active conversation id to the routed id
    if (id && id.length > 0 && activeConversationId !== id) {
      setActiveConversationId(id);
      const convo = conversations[id];
      if(convo){
        setActiveConversationMessages(convo.messages);
      }
    }
  }, [router.asPath]);

  //calculate conversation cost and memoize it, dependent on teh conversation changing
  const conversationCost = useMemo(() => {
    return costOfConversation(activeConversation, availableModels);
  }, [activeConversation, availableModels]);

  const deleteConversation = (id: string) => {
    const nextConversations = {...conversations};
    delete nextConversations[id];
    setActiveConversationMessages([]);
    setActiveConversationId("");
    setConversations(nextConversations);
  }
  
  const friendlyNumber = (num: number) => {
    // if it's less than 1000, return the number, otherwise show XXk
    if (num < 1000) {
      return num;
    } else {
      return `${(num / 1000).toFixed(1)}k`;
    }
  }

  const friendlyDecimal = (num: number) => {
    // round a decimal to the nearest tenth
    return Math.round(num * 10) / 10;
  }

  return (
    <div className="flex flex-col flex-1 p-4 h-screen overflow-y-hidden w-full">
      {activeConversation ?
        <React.Fragment>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-l font-bold">Conversation:
                <div
                  className="inline-block ml-2"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.textContent;
                    if (newTitle && newTitle !== activeConversation.title) {
                      const nextConversations = {...conversations};
                      nextConversations[activeConversationId] = {
                        ...nextConversations[activeConversationId],
                        title: newTitle
                      };
                      setConversations(nextConversations);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                >
                  {activeConversation.title}
                </div>
              </h3>
              {!generating ? 
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    setGenerating(true);
                    generateTitle(activeConversation, model)
                    .then((title) => {
                      console.log("got title", title);
                      const nextConversations = {...conversations};
                      nextConversations[activeConversationId] = {
                        ...nextConversations[activeConversationId],
                        title
                      };
                      setConversations(nextConversations);
                    }).finally(() => {
                      setGenerating(false);
                    });
                    console.log("Auto-generate title");
                  }}
                >
                  <img src="/images/magic-wand-svgrepo-com.svg" className="w-4 h-4" title="Auto-generate title" />
                </button>
              : <img src="/images/spinner.svg" width={24}/> }
            </div>
            <div className="flex flex-row items-center">
              {/* show total tokens used */}
              <span className="mr-2 opacity-50">{friendlyNumber(totalTokensUsed(activeConversation))} tok ({friendlyDecimal(usedContextWindow(activeConversation, model))}%)</span>
              {/* show total cost of conversation */}
              <span className="mr-2">${conversationCost.toFixed(2)}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => { if(confirm("Are you sure?")){ deleteConversation(activeConversationId); router.push("/home") }}}>
                <img src="/images/trash-svgrepo-com.svg" className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* small row of from and to timestamps */}
          <div className="flex gap-1">
            <div className="text-xs text-gray-500">
              From: <DateFmt date={activeConversation.firstMessageDate}/>
            </div>
            <div className="text-xs text-gray-500">
              To: <DateFmt date={activeConversation.lastMessageDate}/>
            </div>
          </div>

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