import React from 'react';

interface ToggleProps {
  leftLabel: string;
  rightLabel: string;
  isToggled: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle = ({ leftLabel, rightLabel, isToggled, onToggle }: ToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <span className={`text-sm font-medium ${!isToggled ? 'text-purple-600' : 'text-gray-500'}`}>
        {leftLabel}
      </span>
      <button
        onClick={() => onToggle(!isToggled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          isToggled ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isToggled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isToggled ? 'text-purple-600' : 'text-gray-500'}`}>
        {rightLabel}
      </span>
    </div>
  );
};

export default Toggle;