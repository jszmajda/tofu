import { FC, memo } from "react";
import { Message } from "../lib/types";
import ReactMarkdown from 'react-markdown';
import DateFmt from "./DateFmt";
import * as atoms from "../lib/atoms";
import { useAtom } from "jotai";
import CodeBlock from './CodeBlock';
import { CopyButton } from "./CopyButton";

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
      <div className={`text-sm prose max-w-full chat-bubble bg-base-100 ring-2 ring-inset p-5 text-base-content marker:text-base-content ${message.role === 'user' ? 'ring-info' : 'ring-accent'}`} ref={targetRef}>
        <ReactMarkdown
          children={message.content}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noreferrer" />
            ),
            code: ({ className, children, node, ...props }) => {
              const content = String(children);
              const isMultiLine = content.includes('\n');
              
              // If it's single line and no language specified, treat as inline
              if (!isMultiLine && !className) {
                return <code className={className}>{children}</code>;
              }
              
              // Otherwise it's a code block
              return (
                <CodeBlock className={className}>
                  {content}
                </CodeBlock>
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
        <CopyButton content={message.content} className="opacity-50 hover:opacity-100" />
      </div>
    </div>
  )
})

export default MessageView;