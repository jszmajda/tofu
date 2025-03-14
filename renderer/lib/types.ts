export type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  reasoningContent?: string;
  inputTokens?: number;
  outputTokens?: number;
  timestamp: Date;
  modelId: string;
  modelName: string;
};

export interface ConversationSet {
  [key: string]: Conversation;
}

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  totalCost: number;
  currentModel: Model;
  firstMessageDate: Date;
  lastMessageDate: Date;
  order: number;
};

export type Model = {
  name: string;
  modelId: string;
  costPerInputTokenK: number;
  costPerOutputTokenK: number;
  region: string;
  maxContextTokens: number;
};

export type AppState = {
  currentModel: Model;
  conversations: Conversation[];
  activeConversation: Conversation;
};

export interface AWSCreds {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken?: string;
}