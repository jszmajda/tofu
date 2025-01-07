import { FC } from "react";
import Link from 'next/link'
import Image from 'next/image'
import * as atoms from '../lib/atoms';
import { useAtom } from "jotai";
import { newConversation } from "../pages/actions";
import { buildDefaultConversation } from "../lib/conversation_tools";
import { useRouter } from "next/router";
import DateFmt from "./DateFmt";
import NoSSR from "./NoSSR";

interface Props {
};

const Sidebar: FC<Props> = ({ }) => {
  const [conversations, setConversations] = useAtom(atoms.conversations);
  const [, setActiveConversationId] = useAtom(atoms.activeConversationId);
  const [, setActiveConversationMessages] = useAtom(atoms.activeConversationMessages);
  const router = useRouter();

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
            const conversation = buildDefaultConversation();
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
        <div className="overflow-y-scroll">
          <ul className="menu menu-xs">
            {Object.keys(conversations).map((conv_id) => (
              <li key={conv_id}>
                <Link href={`/conversation/${conv_id}`} className="block hover:bg-gray-700 p-2 rounded">
                  <div className="flex flex-col border-l-2 border-l-gray-500 pl-2">
                    <DateFmt date={conversations[conv_id].lastMessageDate} className="text-2xs text-gray-600" />
                    <div>{conversations[conv_id].title}</div>
                  </div> 
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </NoSSR>    </div>
  );
}
export default Sidebar;