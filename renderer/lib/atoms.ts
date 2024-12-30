
import { focusAtom } from 'jotai-optics';
import { atomWithLazy, atomWithStorage } from 'jotai/utils';
import { Conversation, Model } from './types';
import { getAvailableModels } from './bedrock';
import { atom } from 'jotai';

export const availableModels = atomWithLazy<Promise<Model[]>>(async () => {
    return await getAvailableModels();
});
const currentModelStorage = atomWithStorage<Model>('currentModel', null);
export const currentModel = atom<Model>(
    (get) => {
        const currStorage = get(currentModelStorage);
        if(currStorage) {
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

export const conversations = atomWithStorage<Conversation[]>('conversations', []);
export const activeConversation = atomWithStorage<Conversation>('activeConversation', {
    id: 0,
    title: 'New Conversation',
    messages: [
        { role: 'user', content: 'test' },
        { role: 'assistant', content: 'Hello! I\'m ready to help you. What would you like to do?' },
        { role: 'user', content: 'write a limmerick?' },
        { role: 'assistant', content: 'Here\'s a limerick for you:\n\nThere once was a cat from Nantucket\nWho carried his lunch in a bucket\n    He meowed with delight\n    At his fishy bite\nAnd said, "This meal\'s simply untrucked!"\n\nWould you like me to write another one?' }
    ],
    totalCost: 0
});

export const activeConversationMessages = focusAtom(activeConversation, (optic) => optic.prop('messages'));