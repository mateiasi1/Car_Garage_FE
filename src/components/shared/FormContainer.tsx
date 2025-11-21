import { FC, FormHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const FormContainer: FC<FormContainerProps> = ({ children, className, ...props }) => {
  return (
    <form
      {...props}
      className={clsx('w-full max-w-md bg-card rounded-3xl shadow-2xl', 'px-8 py-10 space-y-6', className)}
    >
      {children}
    </form>
  );
};
