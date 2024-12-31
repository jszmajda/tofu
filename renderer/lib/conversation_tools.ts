import { Conversation } from "./types";

export const buildDefaultConversation = (): Conversation => {
  const id = new Date().toISOString();
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
    currentModel: null
  }
}