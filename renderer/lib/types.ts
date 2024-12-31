export type Message = {
    role: "assistant" | "user";
    content: string;
    inputTokens?: number;
    outputTokens?: number;
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
};

export type Model = {
    name: string;
    modelId: string;
    costPerInputTokenK: number;
    costPerOutputTokenK: number;
    region: string;
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