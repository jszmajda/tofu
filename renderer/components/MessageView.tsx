import { FC, memo } from "react";
import { Message } from "../lib/types";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import nightOwl from "react-syntax-highlighter/dist/cjs/styles/prism/night-owl";
import ReactMarkdown from 'react-markdown';
import DateFmt from "./DateFmt";
import * as atoms from "../lib/atoms";
import { useAtom } from "jotai";

interface Props {
  id: string;
  message: Message;
  targetRef?: React.RefObject<HTMLDivElement>;
}

const MessageView: FC<Props> = memo(({ id, message, targetRef }) => {
  const [userName, ] = useAtom(atoms.userName);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };


  return (
    <div key={id} className={`chat ${message.role === 'user' ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-header">
        {message.role === 'user' ? userName : message.modelName || 'assistant'} @ <DateFmt date={message.timestamp} format="chat"/>
      </div>
      <div className={`text-sm prose chat-bubble bg-base-100 ring-2 ring-inset p-5 text-base-content marker:text-base-content ${message.role === 'user' ? 'ring-info' : 'ring-accent'}`} ref={targetRef}>
        <ReactMarkdown
          children={message.content}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noreferrer" />
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={nightOwl}
                  language={match[1]}
                  PreTag="div"
                  useInlineStyles
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
           />
      </div>
      <div className="chat-footer opacity-50" title="Input and Output tokens used">
        {message.role === 'assistant' && message.inputTokens && message.outputTokens && (
          <span>
            I: {message.inputTokens} O: {message.outputTokens}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="btn btn-xs btn-ghost"
          title="Copy message content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        </button>
      </div>
    </div>
  )
})

export default MessageView;