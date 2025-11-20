import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

interface SidebarFooterProps {
  expanded: boolean;
  onLogout: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}

const SidebarFooter: FC<SidebarFooterProps> = ({ expanded, onLogout, onExpand, onCollapse }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between px-4 pb-4">
      {expanded ? (
        <>
          <button
            onClick={onLogout}
            className="flex items-center text-red-400 hover:text-red-600 font-semibold justify-start transition-all duration-300 w-32 min-w-0"
            style={{ minWidth: 0 }}
            tabIndex={0}
            aria-hidden={false}
          >
            <span
              className={`
                flex items-center transition-all duration-300
                ${expanded ? 'opacity-100 w-full ml-0' : 'opacity-0 w-0 ml-0'}
                whitespace-nowrap overflow-hidden
              `}
            >
              <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
              {t('logout')}
            </span>
          </button>
          <button onClick={onCollapse} className="text-white hover:text-primary-text">
            <FaAngleDoubleLeft size={20} />
          </button>
        </>
      ) : (
        <div className="w-full flex justify-center">
          <button onClick={onExpand} className="text-white hover:text-primary-text">
            <FaAngleDoubleRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
