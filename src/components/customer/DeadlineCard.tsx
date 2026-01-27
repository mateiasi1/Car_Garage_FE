import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, FileCheck, Shield, Car, Wrench, Tag, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DeadlineItem } from '../../rtk/services/customer-profile-service';

interface DeadlineCardProps {
  deadline: DeadlineItem;
  onClick?: () => void;
  onDelete?: () => void;
}

const documentTypeConfig: Record<string, { icon: LucideIcon; colorClass: string; bgClass: string }> = {
  ITP: { icon: FileCheck, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
  RCA: { icon: Shield, colorClass: 'text-green-600', bgClass: 'bg-green-100' },
  VIGNETTE: { icon: Car, colorClass: 'text-purple-600', bgClass: 'bg-purple-100' },
  MECHANICAL: { icon: Wrench, colorClass: 'text-orange-600', bgClass: 'bg-orange-100' },
  CUSTOM: { icon: Tag, colorClass: 'text-gray-600', bgClass: 'bg-gray-100' },
};

const DeadlineCard: FC<DeadlineCardProps> = ({ deadline, onClick, onDelete }) => {
  const { t } = useTranslation();

  const config = documentTypeConfig[deadline.type] || documentTypeConfig.CUSTOM;
  const Icon = config.icon;

  const getStatusColor = () => {
    if (deadline.isExpired) return 'text-error';
    if (deadline.daysUntilExpiry <= 7) return 'text-error';
    if (deadline.daysUntilExpiry <= 30) return 'text-warning';
    return 'text-success';
  };

  const getStatusBg = () => {
    if (deadline.isExpired) return 'bg-error/10 border-error/20';
    if (deadline.daysUntilExpiry <= 7) return 'bg-error/10 border-error/20';
    if (deadline.daysUntilExpiry <= 30) return 'bg-warning/10 border-warning/20';
    return 'bg-success/10 border-success/20';
  };

  const getStatusText = () => {
    if (deadline.isExpired) {
      return t('customer.dashboard.expired');
    }
    if (deadline.daysUntilExpiry === 0) {
      return t('customer.dashboard.expirestoday');
    }
    if (deadline.daysUntilExpiry === 1) {
      return t('customer.dashboard.expiresTomorrow');
    }
    return t('customer.dashboard.expiresInDays', { days: deadline.daysUntilExpiry });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-xl border border-border p-4
        hover:shadow-md transition-shadow cursor-pointer
        ${onClick ? 'hover:border-primary/30' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgClass}`}>
          <Icon className={`w-5 h-5 ${config.colorClass}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-text truncate font-heading">
              {deadline.title || t(`customer.documents.${deadline.type.toLowerCase()}`)}
            </h3>
            <span className="text-xs text-muted font-body whitespace-nowrap">
              {deadline.carLicensePlate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted font-body">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(deadline.expiresAt)}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg()} ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCard;
