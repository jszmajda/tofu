import { FC } from "react";
import Link from 'next/link'
import Image from 'next/image'
import * as atoms from '../lib/atoms';
import { useAtom } from "jotai";
import { buildDefaultConversation } from "../lib/conversation_tools";
import { useRouter } from "next/router";
import DateFmt from "./DateFmt";
import NoSSR from "./NoSSR";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Props {
};

const Sidebar: FC<Props> = ({ }) => {
  const [conversations, setConversations] = useAtom(atoms.conversations);
  const [, setActiveConversationId] = useAtom(atoms.activeConversationId);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const router = useRouter();
  const activeConversationId = router.query.id;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const conversationIds = Object.keys(conversations);
    const [reorderedItem] = conversationIds.splice(result.source.index, 1);
    conversationIds.splice(result.destination.index, 0, reorderedItem);

    const reorderedConversations = {};
    conversationIds.forEach((id, index) => {
      reorderedConversations[id] = {
        ...conversations[id],
        order: index
      };
    });

    setConversations(reorderedConversations);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col max-w-xs">
      <ul className="menu p-4">
        <li className="flex flex-row items-center mb-4 menu-title">
          <Image src="/images/tofu-small.png" alt="Tofu Logo" width={64} height={64} className="mr-2" />
          <h1 className="">Tofu</h1>
        </li>
        <li>
          <Link href="/home">Home</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li className="mt-4">
          <button className="btn btn-secondary" onClick={() => {
            const conversation = buildDefaultConversation(conversations);
            setConversations({...conversations, [conversation.id]: conversation});
            setActiveConversationMessages([]);
            router.push(`/conversation/${conversation.id}`);
          }}>
            New Chat
          </button>
        </li>
        <li className="mt-4">
          <h3 className="menu-title">Conversations</h3>
        </li>
      </ul>
      <NoSSR>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="conversations">
            {(provided) => (
              <div 
                className="overflow-y-scroll"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <ul className="menu menu-xs">
                  {Object.entries(conversations)
    .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
    .map(([conv_id], index) => (
                    <Draggable key={conv_id} draggableId={conv_id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`rounded ${activeConversationId === conv_id ? "bg-base-300" : ""}`}
                        >
                          <Link href={`/conversation/${conv_id}`} className="block hover:bg-accent p-2 rounded">
                            <div className="flex flex-col border-l-2 border-l-gray-500 pl-2">
                              <DateFmt date={conversations[conv_id].lastMessageDate} className="text-2xs text-gray-600" />
                              <div>{conversations[conv_id].title}</div>
                            </div> 
                          </Link>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </NoSSR>
    </div>
  );
}

export default Sidebar;