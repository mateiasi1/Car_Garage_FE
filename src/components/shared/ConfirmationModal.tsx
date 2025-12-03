import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ open, title, message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/30 backdrop-blur-sm">
      <div className="bg-surface rounded-xl max-w-md w-full mx-4 p-6 border border-border">
        <h2 className="text-lg font-heading font-semibold mb-2 text-text">{title}</h2>
        <p className="text-sm font-body text-muted mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onConfirm}>
            {t('confirm')}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
