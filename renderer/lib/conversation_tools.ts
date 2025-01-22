import { Conversation, Message, Model } from "./types";

export const buildDefaultConversation = (existingConversations?: { [key: string]: Conversation }): Conversation => {
  const now = new Date();
  const id = now.toISOString();
  const friendlyDate = now.toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const maxOrder = existingConversations ? 
    Math.max(-1, ...Object.values(existingConversations).map(c => c.order ?? -1)) :
    -1;
  return {
    messages: [],
    totalCost: 0,
    id: id,
    title: friendlyDate,
    currentModel: null,
    firstMessageDate: now,
    lastMessageDate: now,
    order: maxOrder + 1
  }
}

export const buildNewMessage = (mset: Message[], role: "user" | "assistant", content: string, currentModel: Model): Message => {
  const id = mset.length;
  const msg: Message = {
    id: id,
    role: role,
    content: content,
    timestamp: new Date(),
    modelId: currentModel.modelId,
    modelName: currentModel.name,
  }
  return msg;
}

export const updateConversationMessages = (conversation: Conversation, messages: Message[]): Conversation => {
  const newConversation: Conversation = {
    ...conversation,
    messages: messages,
    firstMessageDate: messages[0]?.timestamp || conversation.firstMessageDate,
    lastMessageDate: messages[messages.length - 1]?.timestamp || conversation.lastMessageDate
  }
  return newConversation;
}

// "token capacity" is how close we are to a model's max context window. 
// For all the models I'm using right now, it's 200000 tokens. 
// The context window is used by the total next conversation entry, 
// BUT each message's input and output tokens isn't just for that message, 
// it's for the last turn in the conversation. 
// So the next entry in the conversaion will take that many tokens, 
// plus some new tokens for the input and output.
// Let's express the used token capacity as a percentage.
export const usedContextWindow = (conversation: Conversation, currentModel: Model): number => {
  // Since each message's tokens represent the last turn in the conversation,
  // we only need to look at the last message's tokens
  const usedTokens = maxTokensUsed(conversation);
  return usedTokens / currentModel.maxContextTokens;
}

// just show the max tokens used in messages in the conversation
export const maxTokensUsed = (conversation: Conversation): number => {
  const usedTokens = conversation.messages.length > 0
    ? (conversation.messages[conversation.messages.length - 1].inputTokens || 0) +
      (conversation.messages[conversation.messages.length - 1].outputTokens || 0)
    : 0;
  return usedTokens;
}

// return the total of all message tokens
export const totalTokensUsed = (conversation: Conversation): number => {
  const usedTokens = conversation.messages.reduce((acc, message) => {
    return acc + (message.inputTokens || 0) + (message.outputTokens || 0);
  }, 0);
  return usedTokens;
}


export const costOfConversation = (conversation: Conversation, availableModels: Model[]): number => {
  const cost = conversation?.messages.reduce((acc, message) => {
    const model = availableModels.find(m => m.modelId === message.modelId);
    if (model) {
      const inputCost = (message.inputTokens || 0) * (model.costPerInputTokenK / 1000);
      const outputCost = (message.outputTokens || 0) * (model.costPerOutputTokenK / 1000);
      return acc + inputCost + outputCost;
    } else{
      return acc;
    }
  }, 0) || 0; 
  return cost;
}