import { FC, useState } from 'react';

interface CopyButtonProps {
  content: string;
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ content, className = "" }) => {
  const [justCopied, setJustCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setJustCopied(true);
    setTimeout(() => {
      setJustCopied(false);
    }, 2000);
  };

  return (
    <button
      className={`p-2 rounded-md 
        bg-base-200 hover:bg-base-300 
        text-base-content/70 hover:text-base-content 
        transition-all active:scale-95 ${className}`}
      onClick={handleCopy}
      title="Copy"
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
  );
};
