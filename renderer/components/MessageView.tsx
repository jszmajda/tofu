import { FC, memo, useState } from "react";
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
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setJustCopied(true);
    setTimeout(() => {
      setJustCopied(false);
    }, 2000);
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
      <div className="chat-footer opacity-50">
        {message.role === 'assistant' && message.inputTokens && message.outputTokens && (
          <span title="Input and Output tokens used">
            I: {message.inputTokens} O: {message.outputTokens}
          </span>
        )}
        <button
          className="p-2 rounded-full bg-base-200 hover:bg-base-300 opacity-50 hover:opacity-100 active:scale-95 transition-transform z-10"
          onClick={handleCopy}
          title="Copy message"
        >
          {justCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
})

export default MessageView;