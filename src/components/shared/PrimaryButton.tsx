import { FC, ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ text, ...props }) => {
  return (
    <button
      {...props}
      className="w-full py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
    >
      {text}
    </button>
  );
};
