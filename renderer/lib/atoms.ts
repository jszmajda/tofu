
import { focusAtom } from 'jotai-optics';
import { atomWithLazy, atomWithStorage } from 'jotai/utils';
import { Conversation, ConversationSet, Model } from './types';
import { getAvailableModels } from './bedrock';
import { atom } from 'jotai';

export const theme = atomWithStorage<string>('theme', 'cupcake');

export const availableModels = atomWithLazy<Promise<Model[]>>(async () => {
  return await getAvailableModels();
});



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

export const activeConversationMessages = atom((get) => {
  const convo = get(activeConversation);
  return convo?.messages || [];
});

export const currentModel = atom<Model | Promise<Model>>((get) => {
  const convo = get(activeConversation);
  if (convo && convo.currentModel) {
    return convo.currentModel;
  } else {
    return get(availableModels).then((models) => models[0]);
  }
});