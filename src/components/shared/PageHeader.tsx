import { FC, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { CustomText } from './CustomText';

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, icon: Icon, action, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="text-primary" size={22} />
        </div>
        <CustomText variant="h3" color="primary">
          {title}
        </CustomText>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};
