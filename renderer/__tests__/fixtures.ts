import { BedrockMessage } from '../lib/bedrock'
import { Conversation, Message, Model } from '../lib/types'

export const messages: Message[] = [
  { role: 'user', content: 'Hello', modelId: 'foo', id: 0, timestamp: new Date() },
  { role: 'assistant', content: 'Hi', modelId: 'foo', id: 1, timestamp: new Date() },
  { role: 'user', content: 'How are you?', modelId: 'foo', id: 2, timestamp: new Date() },
  { role: 'assistant', content: 'I am fine', modelId: 'foo', id: 3, timestamp: new Date() },
]

export const bedrockMessages: BedrockMessage[] = [
  { role: 'user', content: [{ text: 'Hello' }] },
  { role: 'assistant', content: [{ text: 'Hi' }] },
  { role: 'user', content: [{ text: 'How are you?' }] },
  { role: 'assistant', content: [{ text: 'I am fine' }] },
]

export const model: Model = {
  modelId: 'foo',
  name: 'foo',
  region: 'us-east-1',
  costPerInputTokenK: 0.1,
  costPerOutputTokenK: 0.2,
}

export const conversation: Conversation = {
  id: 'foo',
  title: 'foo',
  messages: messages,
  totalCost: 0,
  currentModel: model,
  firstMessageDate: new Date(),
  lastMessageDate: new Date(),
}

it('is just fixtures', () => expect(true).toBe(true))