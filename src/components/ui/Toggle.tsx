import React from 'react';

interface ToggleProps {
  leftLabel: string;
  rightLabel: string;
  isToggled: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  leftLabel,
  rightLabel,
  isToggled,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm ${!isToggled ? 'text-gray-900' : 'text-gray-500'}`}>
        {leftLabel}
      </span>
      
      <button
        type="button"
        role="switch"
        aria-checked={isToggled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2
          ${isToggled ? 'bg-purple-600' : 'bg-gray-200'}
        `}
        onClick={() => onToggle(!isToggled)}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${isToggled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>

      <span className={`text-sm ${isToggled ? 'text-gray-900' : 'text-gray-500'}`}>
        {rightLabel}
      </span>
    </div>
  );
};

export default Toggle;