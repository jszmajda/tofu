import { FC } from "react";
import Link from 'next/link'
import Image from 'next/image'
import * as atoms from '../lib/atoms';
import { useAtom } from "jotai";
import { newConversation } from "../pages/actions";
import { buildDefaultConversation } from "../lib/conversation_tools";
import { useRouter } from "next/router";

interface Props {
};

const Sidebar: FC<Props> = ({ }) => {
  const [conversations,] = useAtom(atoms.conversations);
  const [, setActiveConversation] = useAtom(atoms.activeConversation);
  const router = useRouter();

  return (
    <ul className="menu w-auto p-4">
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
            setActiveConversation(conversation);
            router.push(`/conversation/${conversation.id}`);
          }}>
          New Chat
        </button>
      </li>
      <li className="mt-4">
        <h3 className="menu-title">Conversations</h3>
      </li>
      {Object.keys(conversations).map((conv_id) => (
        <li key={conv_id}>
          <Link href={`/conversation/${conv_id}`} className="block hover:bg-gray-700 p-2 rounded">
            {conversations[conv_id].title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
export default Sidebar;