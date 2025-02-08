// components/auth/AuthButton.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';

// Define what kind of button variants we allow
type ButtonVariant = 'primary' | 'secondary' | 'social';

// Define what props our button can accept
interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const AuthButton = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  fullWidth = false,
  isLoading = false,
  onClick,
  ...props 
}: AuthButtonProps) => {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    social: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
  } as const;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
