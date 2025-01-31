import { FC, RefObject } from 'react';
import { usePasteHandler } from '../hooks/usePasteHandler';

interface ChatInputProps {
  inputRef: RefObject<HTMLDivElement>;
  onInputChange: (content: string) => void;
  onSend: () => void;
  errorMessage: string | null;
  onDismissError: () => void;
}

const ChatInput: FC<ChatInputProps> = ({
  inputRef,
  onInputChange,
  onSend,
  errorMessage,
  onDismissError,
}) => {

  const { handlePaste } = usePasteHandler({
    onContentChange: onInputChange,
    inputRef
  });

  return (
    <div className="gap-4 flex-none box-border mt-3">
      {errorMessage && (
        <div className="alert alert-error mb-2">
          <span>{errorMessage}</span>
          <button className="btn btn-ghost btn-xs" onClick={onDismissError}>
            Dismiss
          </button>
        </div>
      )}
      <div className="flex">
        <div
          className="flex-1 input input-primary py-2 overflow-y-auto whitespace-pre-wrap min-h-[3rem] rounded-r-none rounded-bl-none focus:-outline-offset-2"
          style={{ 
            maxHeight: '50vh',
            height: 'fit-content',
            resize: 'none'
          }}
          contentEditable={true}
          role="textbox"
          onPaste={handlePaste}
          onInput={(e) => {
            const newContent = e.currentTarget.textContent || '';
            onInputChange(newContent);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          ref={inputRef}
        />
        <button 
          className="py-2 px-4 btn btn-primary rounded-l-none" 
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
