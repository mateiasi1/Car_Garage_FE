import { FC, ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`py-3 px-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors ${className}`}
    >
      {text}
    </button>
  );
};
