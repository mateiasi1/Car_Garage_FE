import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode, useEffect } from 'react';

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
            className={`
        fixed inset-0 z-50 transition-opacity duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

            {/* Drawer – un singur element, responsive */}
            <div
                className={`
          fixed bg-white shadow-xl flex flex-col
          transition-transform duration-300

          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 h-[80%] rounded-t-xl

          /* Desktop: right drawer */
          md:top-0 md:bottom-0 md:right-0 md:left-auto
          md:h-full md:w-[35%] md:max-w-lg
          md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none md:rounded-br-none

          /* Animations */
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-heading">{title}</h2>
                    <button className="text-gray-700 hover:text-gray-900" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
};

export default Drawer;
