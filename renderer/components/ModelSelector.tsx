import { act, FC } from 'react';
import { Model } from '../lib/types';
import { useAtom } from 'jotai';
import * as atoms from '../lib/atoms';

interface Props {
};

const ModelSelector: FC<Props> = ({ }) => {

  const [models, ]: [Model[], any] = useAtom(atoms.availableModels);
  const [, setModel] = useAtom(atoms.currentModel);
  const [activeConversation, setActiveConversation] = useAtom(atoms.activeConversation)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = models.find((model) => model.modelId === event.target.value);
    if (model && activeConversation && activeConversation.currentModel != model){
      setActiveConversation({...activeConversation, currentModel: model});
    }
  };

  return (
    <select onChange={handleChange} className="select select-ghost">
      {models.map((model) => (
        <option key={model.modelId} value={model.modelId}>
          {model.name}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
