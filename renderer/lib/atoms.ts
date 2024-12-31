import { atomWithLazy, atomWithStorage } from 'jotai/utils';
import { Conversation, ConversationSet, Message, Model } from './types';
import { getAvailableModels } from './bedrock';
import { atom } from 'jotai';

export const theme = atomWithStorage<string>('theme', 'cupcake');

export const availableModels = atomWithLazy<Promise<Model[]>>(async () => {
  return await getAvailableModels();
});
const currentModelStorage = atomWithStorage<Model>('currentModel', null);
export const currentModel = atom<Model>(
  (get) => {
    const currStorage = get(currentModelStorage);
    if (currStorage) {
      return currStorage;
    } else {
      return get(availableModels).then((models) => models[0]);
    }
  },
  // @ts-ignore
  (_get, set, update: Model) => {
    set(currentModelStorage, update);
  }
);

export const conversations = atomWithStorage<ConversationSet>('conversations', {});
export const activeConversationId = atom<string>("");
export const activeConversation = atom<Conversation>(
  (get) => {
    const id = get(activeConversationId);
    const convos = get(conversations);
    return convos[id];
  },
  // @ts-ignore
  (get, set, update: Conversation) => {
    const id = update.id;
    set(conversations, (prev) => {
      const next = { ...prev };
      next[id] = update;
      return next;
    });
    set(activeConversationId, id);
  }
);

export const activeConversationMessages = atom<Message[]>([])

// export const currentModel = atom<Model | Promise<Model>>((get) => {
//   const convo = get(activeConversation);
//   if (convo && convo.currentModel) {
//     return convo.currentModel;
//   } else {
//     return get(availableModels).then((models) => models[0]);
//   }
// });