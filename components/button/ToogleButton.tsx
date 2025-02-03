"use client"

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';


const WindowsToggleButton: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="relative inline-block w-12 h-6 rounded-full bg-sky-500 cursor-pointer" onClick={handleToggle}>
      { 
        isChecked && (
          <div className='pt-1 pl-1'>

            <CheckIcon className='w-4 h-4 text-white'/>
          </div>
        )
      }
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 transform-gpu ${
          isChecked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </label>
  );
};

export default WindowsToggleButton;