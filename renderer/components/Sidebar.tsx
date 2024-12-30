import { FC } from "react";
import Link from 'next/link'
import Image from 'next/image'
import * as atoms from '../lib/atoms';
import { useAtom } from "jotai";

interface Props {
};

const Sidebar: FC<Props> = ({ }) => {
  const [conversations,] = useAtom(atoms.conversations);
  return (
    <ul className="menu w-auto p-4">
      <li className="flex flex-row items-center mb-4 menu-title">
        <Image src="/images/tofu-small.png" alt="Tofu Logo" width={64} height={64} className="mr-2" />
        <h1 className="">Tofu</h1>
      </li>
      <li>
        <Link href="/home">
          Home
        </Link>
      </li>
      <li>
        <Link href="/settings">
          Settings
        </Link>
      </li>
      <li className="mt-4">
        <button className="btn btn-secondary">
          New Chat
        </button>
      </li>
      <li className="mt-4">
        <h3 className="menu-title">Conversations</h3>
      </li>
      {conversations.map((conv) => (
        <li key={conv.id}>
          <Link href={`/conversation/${conv.id}`} className="block hover:bg-gray-700 p-2 rounded">
            {conv.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
export default Sidebar;