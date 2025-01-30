import { Conversation, Message, Model } from "../lib/types";

export interface MessageHandlerContext {
  activeConversation: Conversation;
  currentModel: Model;
  systemPrompt: string;
  responseRef: React.RefObject<HTMLElement>;
  scrollHandlers: {
    handleScroll: (e: any) => void;
    scrollToBottom: () => void;
  };
}

export interface MessageHandlerActions {
  setActiveConversation: (conversation: Conversation) => void;
  setActiveConversationMessages: (messages: Message[]) => void;
  setUnsentMessagesMap: (messages: Record<string, string>) => void;
}

export interface SendMessageResult {
  error: boolean;
  originalInput?: string;
}