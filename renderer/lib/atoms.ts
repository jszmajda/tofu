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

// utility to help detect hydration state
export const isHydrated = atom<boolean>(false);

// theme-related atoms
export const theme = clientAtom<string>('theme', 'cupcake');
export const darkModeTheme = clientAtom<string>('theme-dark', 'forest');
export const isDarkMode = atom<boolean>(false);

// models and stuff
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

// conversations and stuff
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

// system prompt
export const systemPrompt = clientAtom<string>("system-prompt", "You are a helpful assistant named Tofu.");

// user stuff
export const userName = clientAtom<string>("userName", "User");