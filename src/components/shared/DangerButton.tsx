import { FC, ButtonHTMLAttributes } from 'react';

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const DangerButton: FC<DangerButtonProps> = ({ text, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors ${className}`}
    >
      {text}
    </button>
  );
};
