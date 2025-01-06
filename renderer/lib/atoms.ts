import { atomWithLazy, atomWithStorage } from 'jotai/utils';
import { Conversation, ConversationSet, Message, Model } from './types';
import { getAvailableModels } from './bedrock';
import { atom } from 'jotai';

const clientAtom = <T>(key: string, initialValue: T) => {
  if(typeof window === 'undefined'){
    return atom(initialValue);
  }
  return atomWithStorage<T>(key, initialValue);
};

export const isHydrated = atom<boolean>(false);

export const theme = clientAtom<string>('theme', 'cupcake');

export const availableModels = atomWithLazy<Promise<Model[]>>(async () => {
  return await getAvailableModels();
});

const currentModelStorage = clientAtom<Model>('currentModel', null);

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

export const conversations = clientAtom<ConversationSet>('conversations', {});
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

export const systemPrompt = clientAtom<string>("system-prompt", "You are a helpful assistant named Tofu.");