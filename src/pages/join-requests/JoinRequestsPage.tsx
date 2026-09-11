import { useState } from 'react';
import { Button, Chip, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMySalons } from '../../network/hooks/useSalons';
import {
  useAcceptJoinRequest,
  useRejectJoinRequest,
  useSalonJoinRequests,
} from '../../network/hooks/useJoinRequests';
import type { JoinRequestStatus, Salon, SalonJoinRequest } from '../../types/api';

const STATUS_COLOR: Record<JoinRequestStatus, 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

function JoinRequestRow({ joinRequest }: { joinRequest: SalonJoinRequest }) {
  const { t } = useTranslation();
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptJoinRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectJoinRequest();
  const [isRejecting_, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    rejectRequest(
      { id: joinRequest.id, rejectionReason: rejectionReason || undefined },
      { onSuccess: () => setIsRejecting(false) },
    );
  };

  return (
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">
            {joinRequest.master?.user.firstName} {joinRequest.master?.user.lastName}
          </p>
          {joinRequest.rejectionReason && (
            <p className="text-xs text-slate-500 mt-1">{joinRequest.rejectionReason}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Chip
            size="small"
            label={t(`joinRequests.status.${joinRequest.status}`)}
            color={STATUS_COLOR[joinRequest.status]}
          />

          {joinRequest.status === 'PENDING' && !isRejecting_ && (
            <>
              <Button
                size="small"
                variant="contained"
                disabled={isAccepting}
                onClick={() => acceptRequest(joinRequest.id)}
              >
                {t('joinRequests.accept')}
              </Button>
              <Button size="small" color="error" onClick={() => setIsRejecting(true)}>
                {t('joinRequests.reject')}
              </Button>
            </>
          )}
        </div>
      </div>

      {isRejecting_ && (
        <div className="flex flex-wrap items-center gap-2">
          <TextField
            size="small"
            label={t('joinRequests.rejectionReason')}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="flex-1 min-w-50"
          />
          <Button size="small" color="error" variant="contained" disabled={isRejecting} onClick={handleReject}>
            {t('joinRequests.confirmReject')}
          </Button>
          <Button size="small" onClick={() => setIsRejecting(false)}>
            {t('common.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
}

function SalonJoinRequestsSection({ salon }: { salon: Salon }) {
  const { t } = useTranslation();
  const { data: joinRequests, isLoading } = useSalonJoinRequests(salon.id);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-800 mb-3">{salon.name}</h2>

      {isLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

      {!isLoading && (joinRequests?.length ?? 0) === 0 && (
        <p className="text-slate-500 text-sm">{t('joinRequests.empty')}</p>
      )}

      <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
        {joinRequests?.map((joinRequest) => (
          <JoinRequestRow key={joinRequest.id} joinRequest={joinRequest} />
        ))}
      </div>
    </section>
  );
}

export default function JoinRequestsPage() {
  const { t } = useTranslation();
  const { data: mySalons, isLoading: isSalonsLoading } = useMySalons();

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('pages.joinRequests')}</h1>

      {isSalonsLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

      {!isSalonsLoading && (mySalons?.length ?? 0) === 0 && (
        <p className="text-slate-500 text-sm">{t('joinRequests.noSalons')}</p>
      )}

      {mySalons?.map((salon) => (
        <SalonJoinRequestsSection key={salon.id} salon={salon} />
      ))}
    </div>
  );
}
