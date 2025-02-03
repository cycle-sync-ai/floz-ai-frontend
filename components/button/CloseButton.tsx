import { XMarkIcon } from '@heroicons/react/20/solid';

const CloseButton = ({key, removeItem}) => {
  return (
    <button
      className="rounded-full focus:outline-none"  onClick={removeItem(key)}
    >
      <XMarkIcon className="w-6 h-6 text-gray-600"  />
    </button>
  );
};

export default CloseButton;