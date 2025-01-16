'use client';
import { useAtom } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";
import * as atoms from '../../lib/atoms';
import ModelSelector from "../../components/ModelSelector";
import ChatPanel from "../../components/ChatPanel";
import { useRouter } from "next/router";
import React from "react";
import { generateTitle } from "../../lib/bedrock";
import DateFmt from "../../components/DateFmt";
import { costOfConversation, totalTokensUsed, usedContextWindow } from "../../lib/conversation_tools";
import { downloadConversationAsJson } from "../../lib/export";

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
  const [isConfirming, setIsConfirming] = useState(false);

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
                  <svg className="w-4 h-4 fill-base-content" viewBox="0 0 24 24"><title>Auto-generate title</title><path fill-rule="evenodd" d="M9 1a1 1 0 1 0-2 0v.5a1 1 0 0 0 2 0V1ZM3.7 2.3a1 1 0 0 0-1.4 1.4l1 1a1 1 0 0 0 1.4-1.4l-1-1Zm10 1.4a1 1 0 0 0-1.4-1.4l-1 1a1 1 0 0 0 1.4 1.4l1-1ZM1 7a1 1 0 0 0 0 2h.5a1 1 0 0 0 0-2H1Zm14 0a1 1 0 1 0 0 2h.5a1 1 0 1 0 0-2H15ZM4.7 12.7a1 1 0 1 0-1.4-1.4l-1 1a1 1 0 1 0 1.4 1.4l1-1ZM9 15a1 1 0 1 0-2 0v.5a1 1 0 1 0 2 0V15Zm.4-10a2 2 0 0 0-2.8 0L5 6.6a2 2 0 0 0 0 2.8l2.3 2.3L18.6 23c.8.8 2 .8 2.8 0l1.6-1.6c.8-.8.8-2 0-2.8L11.7 7.3 9.4 5Zm-3 3L8 6.4 9.6 8 8 9.6 6.4 8Zm3 3L11 9.4 21.6 20 20 21.6 9.4 11Z" clip-rule="evenodd"/></svg>
                </button>
              : <img src="/images/spinner.svg" width={24}/> }
            </div>
            <div className="flex flex-row items-center">
              {/* show total tokens used */}
              <span className="mr-2 opacity-50">{friendlyNumber(totalTokensUsed(activeConversation))} tok ({friendlyDecimal(usedContextWindow(activeConversation, model))}%)</span>
              {/* show total cost of conversation */}
              <span className="mr-2">${conversationCost.toFixed(2)}</span>
              {/* Two-step delete button that changes icon on first click */}
              <button 
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  if (!isConfirming) {
                    setIsConfirming(true);
                    // Reset confirmation state after delay
                    setTimeout(() => setIsConfirming(false), 1200);
                  } else {
                    deleteConversation(activeConversationId);
                    router.push("/home");
                  }
                }}>
                <span className="w-4 h-4">
                {isConfirming ?
                <svg className="fill-secondary-content" version="1.1" viewBox="0 0 512 512"><title>Are you sure?</title><path d="M396.138 85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26 9.2 280.435.001 246.98.001c-41.238-.102-75.5 10.642-101.359 25.521-25.962 14.826-37.156 32.088-37.156 32.088a19.471 19.471 0 0 0-6.721 15.056 19.425 19.425 0 0 0 7.273 14.784l35.933 28.78c7.324 5.864 17.806 5.644 24.875-.518 0 0 4.414-7.978 18.247-15.88 13.91-7.85 31.945-14.173 58.908-14.258 23.517-.051 44.022 8.725 58.016 20.717 6.952 5.941 12.145 12.594 15.328 18.68 3.208 6.136 4.379 11.5 4.363 15.574-.068 13.766-2.742 22.77-6.603 30.442-2.945 5.729-6.789 10.813-11.738 15.744-7.384 7.384-17.398 14.207-28.634 20.479-11.245 6.348-23.365 11.932-35.612 18.68-13.978 7.74-28.77 18.858-39.701 35.544-5.449 8.249-9.71 17.686-12.416 27.641-2.742 9.964-3.98 20.412-3.98 31.071v20.708c0 10.719 8.69 19.41 19.41 19.41h46.762c10.719 0 19.41-8.691 19.41-19.41v-20.708c0-4.107.467-6.755.917-8.436.773-2.512 1.206-3.14 2.47-4.668 1.29-1.452 3.895-3.674 8.698-6.331 7.019-3.946 18.298-9.276 31.07-16.176 19.121-10.456 42.367-24.646 61.972-48.062 9.752-11.686 18.374-25.758 24.323-41.968 6.001-16.21 9.242-34.431 9.226-53.96-.018-19.784-5.382-38.574-14.123-55.25zM228.809 406.44c-29.152 0-52.788 23.644-52.788 52.788 0 29.136 23.637 52.772 52.788 52.772 29.136 0 52.763-23.636 52.763-52.772 0-29.144-23.627-52.788-52.763-52.788z"/></svg>
                :
                <svg className="stroke-secondary-content fill-secondary" viewBox="0 0 24 24"><title>Delete Conversation</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16m-4 0-.27-.812c-.263-.787-.394-1.18-.637-1.471a2 2 0 0 0-.803-.578C13.938 3 13.524 3 12.694 3h-1.388c-.829 0-1.244 0-1.596.139a2 2 0 0 0-.803.578c-.243.29-.374.684-.636 1.471L8 6m10 0v10.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C15.72 21 14.88 21 13.2 21h-2.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C6 18.72 6 17.88 6 16.2V6m8 4v7m-4-7v7"/></svg>
                }
                </span>
              </button>
              {/* Export conversation button */}
              <button 
                className="btn btn-secondary btn-sm ml-2"
                onClick={() => {
                  downloadConversationAsJson(activeConversation);
                }}>
                <span className="w-4 h-4">
                  <svg className="fill-secondary-content" viewBox="0 0 36 36">
                    <title>Export conversation</title>
                    <path d="M6 14h8V6h10v8h2V6a2 2 0 0 0-2-2H11l-7 7v19a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2H6Zm0-2 6-6v6H6Z"/>
                    <path d="M28 16a1 1 0 0 0-1 2l3 3H18a1 1 0 0 0 0 2h12l-3 3a1 1 0 1 0 1 2l6-6Z"/>
                    <path fill="none" d="M0 0h36v36H0z"/>
                  </svg>
                </span>
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