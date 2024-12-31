import { Conversation, Message, Model } from "./types";

export const buildDefaultConversation = (): Conversation => {
  const now = new Date();
  const id = now.toISOString();
  return {
    messages: [
      // { role: 'user', content: 'test' },
      // { role: 'assistant', content: 'Hello! I\'m ready to help you. What would you like to do?' },
      // { role: 'user', content: 'write a limmerick?' },
      // { role: 'assistant', content: 'Here\'s a limerick for you:\n\nThere once was a cat from Nantucket\nWho carried his lunch in a bucket\n  He meowed with delight\n  At his fishy bite\nAnd said, "This meal\'s simply untrucked!"\n\nWould you like me to write another one?' }
    ],
    totalCost: 0,
    id: id,
    title: id,
    currentModel: null,
    firstMessageDate: now,
    lastMessageDate: now
  }
}

export const buildNewMessage = (mset: Message[], role: "user" | "assistant", content: string, currentModel: Model): Message => {
  const id = mset.length;
  const msg = {
    id: id,
    role: role,
    content: content,
    timestamp: new Date(),
    modelId: currentModel.modelId
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

export const costOfConversation = (conversation: Conversation, availableModels: Model[]): number => {
  const cost = conversation?.messages.reduce((acc, message) => {
    const model = availableModels.find(m => m.modelId === message.modelId);
    if (model) {
      console.log(`model ${model.name} for ${message.inputTokens} and ${message.outputTokens}`);
      const inputCost = (message.inputTokens || 0) * (model.costPerInputTokenK / 1000);
      const outputCost = (message.outputTokens || 0) * (model.costPerOutputTokenK / 1000);
      return acc + inputCost + outputCost;
    } else{
      return acc;
    }
  }, 0) || 0; 
  console.log(`cost of ${conversation?.title} is ${cost}`);
  return cost;
}