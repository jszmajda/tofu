import { FC } from 'react';
import { Model } from '../lib/types';

interface Props {
  models: Model[];
  setModel: (model: Model) => void;
}

const ModelSelector: FC<Props> = ({ models, setModel }) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = models.find((model) => model.modelId === event.target.value);
    if (model) {
      setModel(model);
    }
  };

  return (
    <select onChange={handleChange}>
      {models.map((model) => (
        <option key={model.modelId} value={model.modelId}>
          {model.name}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
