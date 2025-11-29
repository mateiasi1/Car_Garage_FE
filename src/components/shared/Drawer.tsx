import { FC, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import { CustomText } from './CustomText';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-text/30 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`
          fixed bg-surface text-text border-l border-border flex flex-col
          bottom-0 left-0 right-0 h-[80%] rounded-t-xl
          md:top-0 md:bottom-0 md:right-0 md:left-auto
          md:h-full md:w-[35%] md:max-w-lg
          md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none md:rounded-br-none
          transition-transform duration-300
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          {title && (
            <CustomText variant="h3" className="m-0">
              {title}
            </CustomText>
          )}
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-text/70 hover:text-text"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
