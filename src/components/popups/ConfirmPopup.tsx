import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BasePopup from './BasePopup';

interface ConfirmPopupProps {
  isVisible: boolean;
  title: string;
  description?: string;
  confirmColor?: 'primary' | 'error';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmPopup({
  isVisible,
  title,
  description,
  confirmColor = 'primary',
  isLoading,
  onConfirm,
  onClose,
}: ConfirmPopupProps) {
  const { t } = useTranslation();

  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <div className="flex flex-col gap-4 min-w-70">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outlined" fullWidth onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            color={confirmColor}
            fullWidth
            onClick={onConfirm}
            disabled={isLoading}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </BasePopup>
  );
}
