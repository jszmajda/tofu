import { FC } from 'react';
import { Model } from '../lib/types';
import { useAtom } from 'jotai';
import { availableModels, currentModel } from '../lib/atoms';

interface Props {
};

const ModelSelector: FC<Props> = ({ }) => {

  const [models, setAvailableModels]: [Model[], any] = useAtom(availableModels);
  const [model, setModel] = useAtom(currentModel);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = models.find((model) => model.modelId === event.target.value);
    if (model) {
      setModel(model);
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
