export type Message = {
    role: "assistant" | "user";
    content: string;
    inputTokens?: number;
    outputTokens?: number;
};

export type Conversation = {
    id: number;
    title: string;
    messages: Message[];
    totalCost: number;
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