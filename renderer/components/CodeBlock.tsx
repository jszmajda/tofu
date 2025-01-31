import { FC } from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import nightOwl from "react-syntax-highlighter/dist/cjs/styles/prism/night-owl";
import { CopyButton } from "./CopyButton";

const CodeBlock: FC<{ children: string; className?: string }> = ({ children, className }) => {
  const match = /language-(\w+)/.exec(className || "");
  
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-90 transition-opacity">
        <CopyButton content={String(children)} className="" />
      </div>
      {match ? (
        <SyntaxHighlighter
          style={nightOwl}
          language={match[1]}
          PreTag="div"
          useInlineStyles
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>
          {children}
        </code>
      )}
    </div>
  );
};

export default CodeBlock;