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
      { message.role === 'assistant' && message.inputTokens && message.outputTokens && (
        <div className="chat-footer opacity-50" title="Input and Output tokens used">
          I: {message.inputTokens} O: {message.outputTokens}
        </div>
      ) }
    </div>
  )
})

export default MessageView;