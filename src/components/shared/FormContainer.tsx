import { FC, FormHTMLAttributes, ReactNode } from 'react';

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  children: ReactNode;
}

export const FormContainer: FC<FormContainerProps> = ({ title, children, className = '', ...props }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-sidebar flex items-center justify-center px-4">
    <form {...props} className={`w-full max-w-md bg-card rounded-3xl shadow-2xl px-8 py-10 ${className}`}>
      {title && <h1 className="text-xl font-heading font-bold text-primary mb-6 text-center">{title}</h1>}
      {children}
    </form>
  </div>
);
