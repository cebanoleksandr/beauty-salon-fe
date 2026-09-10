import { useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../network/hooks/useAuth';
import {
  useCreateBlockedTime,
  useSetWorkingHours,
  useWorkingHours,
} from '../../network/hooks/useWorkingHours';
import type { BlockedTimeType, WorkingHour } from '../../types/api';

const BLOCKED_TIME_TYPES: BlockedTimeType[] = [
  'BREAK',
  'VACATION',
  'PERSONAL',
  'SICK_LEAVE',
  'OTHER',
];

const WEEKDAY_KEYS = [
  'common.weekday0',
  'common.weekday1',
  'common.weekday2',
  'common.weekday3',
  'common.weekday4',
  'common.weekday5',
  'common.weekday6',
];

interface DayForm {
  startTime: string;
  endTime: string;
  isDayOff: boolean;
  isSaved: boolean;
}

const DEFAULT_DAY: DayForm = { startTime: '09:00', endTime: '18:00', isDayOff: false, isSaved: false };

// Backend expects military time "HH:MM", but <input type="time"> can yield "HH:MM:SS" when the
// browser enables seconds granularity (e.g. via OS clock settings) — strip any trailing seconds.
const toHHMM = (time: string) => time.slice(0, 5);

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const isValidDay = (value: DayForm) =>
  value.isDayOff ||
  (TIME_REGEX.test(toHHMM(value.startTime)) && TIME_REGEX.test(toHHMM(value.endTime)));

// UI uses 0-6 (Monday-Sunday) to match WEEKDAY_KEYS; backend expects 1-7 for the same days.
const toBackendDayOfWeek = (dayOfWeek: number) => dayOfWeek + 1;

function buildFormState(workingHours: WorkingHour[] | undefined): DayForm[] {
  return WEEKDAY_KEYS.map((_, dayOfWeek) => {
    const existing = workingHours?.find((wh) => wh.dayOfWeek === toBackendDayOfWeek(dayOfWeek));
    return existing
      ? {
          startTime: existing.startTime,
          endTime: existing.endTime,
          isDayOff: existing.isDayOff,
          isSaved: true,
        }
      : { ...DEFAULT_DAY };
  });
}

function DayRow({
  dayOfWeek,
  masterId,
  value,
  onChange,
}: {
  dayOfWeek: number;
  masterId: string;
  value: DayForm;
  onChange: (next: DayForm) => void;
}) {
  const { t } = useTranslation();
  const { mutate: setWorkingHours, isPending } = useSetWorkingHours();

  const handleSave = () => {
    setWorkingHours(
      {
        masterId,
        dayOfWeek: toBackendDayOfWeek(dayOfWeek),
        ...value,
        startTime: toHHMM(value.startTime),
        endTime: toHHMM(value.endTime),
      },
      { onSuccess: () => onChange({ ...value, isSaved: true }) },
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <span className="w-28 text-sm font-medium text-slate-700">{t(WEEKDAY_KEYS[dayOfWeek])}</span>

      <FormControlLabel
        control={
          <Checkbox
            checked={value.isDayOff}
            disabled={value.isSaved}
            onChange={(e) => onChange({ ...value, isDayOff: e.target.checked })}
          />
        }
        label={t('masters.dayOff')}
      />

      {!value.isDayOff && (
        <>
          <TextField
            type="time"
            size="small"
            value={value.startTime}
            disabled={value.isSaved}
            onChange={(e) => onChange({ ...value, startTime: e.target.value })}
          />
          <span className="text-slate-400">–</span>
          <TextField
            type="time"
            size="small"
            value={value.endTime}
            disabled={value.isSaved}
            onChange={(e) => onChange({ ...value, endTime: e.target.value })}
          />
        </>
      )}

      {value.isSaved ? (
        <Chip size="small" color="success" label={t('workingHours.alreadySet')} />
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={handleSave}
          disabled={isPending || !isValidDay(value)}
        >
          {t('common.save')}
        </Button>
      )}
    </div>
  );
}

function WeeklyScheduleEditor({
  masterId,
  workingHours,
}: {
  masterId: string;
  workingHours: WorkingHour[];
}) {
  const [days, setDays] = useState<DayForm[]>(() => buildFormState(workingHours));

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-slate-100">
      {days.map((day, dayOfWeek) => (
        <DayRow
          key={dayOfWeek}
          dayOfWeek={dayOfWeek}
          masterId={masterId}
          value={day}
          onChange={(next) => setDays((prev) => prev.map((d, i) => (i === dayOfWeek ? next : d)))}
        />
      ))}
    </div>
  );
}

export default function WorkingHoursPage() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const masterId = profile?.masterId ?? '';

  const { data: workingHours, isLoading } = useWorkingHours(masterId);

  const { mutate: createBlockedTime, isPending: isBlockingPending } = useCreateBlockedTime();
  const [blockType, setBlockType] = useState<BlockedTimeType>('BREAK');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const handleCreateBlockedTime = () => {
    if (!blockStart || !blockEnd) return;
    createBlockedTime(
      {
        masterId,
        type: blockType,
        startAt: new Date(blockStart).toISOString(),
        endAt: new Date(blockEnd).toISOString(),
        reason: blockReason || undefined,
      },
      {
        onSuccess: () => {
          setBlockStart('');
          setBlockEnd('');
          setBlockReason('');
        },
      },
    );
  };

  if (!profile?.masterId) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <p className="text-slate-500 text-sm">{t('masters.noWorkingHours')}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('pages.workingHours')}</h1>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('masters.workingHoursTitle')}</h2>

        {isLoading && <p className="text-slate-500 text-sm">{t('common.loading')}</p>}

        {!isLoading && (
          <WeeklyScheduleEditor masterId={masterId} workingHours={workingHours ?? []} />
        )}
      </section>

      <section className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-800">{t('workingHours.blockedTimeTitle')}</h2>

        <TextField
          select
          size="small"
          label={t('workingHours.blockType')}
          value={blockType}
          onChange={(e) => setBlockType(e.target.value as BlockedTimeType)}
          className="max-w-xs"
        >
          {BLOCKED_TIME_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`workingHours.blockTypes.${type}`)}
            </MenuItem>
          ))}
        </TextField>

        <div className="flex flex-wrap gap-3">
          <TextField
            type="datetime-local"
            size="small"
            label={t('workingHours.blockStart')}
            value={blockStart}
            onChange={(e) => setBlockStart(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type="datetime-local"
            size="small"
            label={t('workingHours.blockEnd')}
            value={blockEnd}
            onChange={(e) => setBlockEnd(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </div>

        <TextField
          size="small"
          label={t('workingHours.blockReason')}
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleCreateBlockedTime}
          disabled={isBlockingPending || !blockStart || !blockEnd}
          className="self-start"
        >
          {t('workingHours.addBlockedTime')}
        </Button>
      </section>
    </div>
  );
}
