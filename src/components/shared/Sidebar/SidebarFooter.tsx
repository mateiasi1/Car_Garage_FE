import { FC } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface SidebarFooterProps {
  expanded: boolean;
  onLogout: () => void;
  onExpand: () => void;
  onCollapse: () => void;
}

const SidebarFooter: FC<SidebarFooterProps> = ({ expanded, onLogout, onExpand, onCollapse }) => (
  <div className="absolute bottom-0 left-0 w-full flex items-end justify-between px-4 pb-4">
    {expanded ? (
      <>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-600 font-semibold">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
        <button onClick={onCollapse} className="text-white hover:text-primary-text">
          <FaAngleDoubleLeft size={20} />
        </button>
      </>
    ) : (
      <button onClick={onExpand} className="mx-auto text-white hover:text-primary-text w-full flex justify-center">
        <FaAngleDoubleRight size={20} />
      </button>
    )}
  </div>
);

export default SidebarFooter;
