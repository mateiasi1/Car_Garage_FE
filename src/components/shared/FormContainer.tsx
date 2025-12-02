import { FC, FormHTMLAttributes, ReactNode } from 'react';

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: ReactNode;
}

export const FormContainer: FC<FormContainerProps> = ({ title, children, className = '', ...props }) => (
  <div className="min-h-screen w-full bg-page-gradient flex items-center justify-center px-4 py-8">
    <form {...props} className={`w-full max-w-md bg-surface rounded-xl border border-border shadow-sm px-8 py-10 ${className}`}>
      {title && <h1 className="text-xl font-heading font-bold text-primary mb-6 text-center">{title}</h1>}
      {children}
    </form>
  </div>
);
