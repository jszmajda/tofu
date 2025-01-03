import { FC } from "react";
import { Message } from "../lib/types";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import nightOwl from "react-syntax-highlighter/dist/cjs/styles/prism/night-owl";
import ReactMarkdown from 'react-markdown';
import DateFmt from "./DateFmt";

interface Props {
  id: string;
  message: Message;
  targetRef?: React.RefObject<HTMLDivElement>;
}

const MessageView: FC<Props> = ({ id, message, targetRef }) => {
  return (
    <div key={id} className={`chat ${message.role === 'user' ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-header">{message.role} @ <DateFmt date={message.timestamp} format="chat"/></div>
      <div className={`text-sm prose chat-bubble ${message.role === 'user' ? 'chat-bubble-info' : 'chat-bubble-accent'}`} ref={targetRef}>
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
    </div>
  )
}

export default MessageView;