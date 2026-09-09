import { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useSearchSalons } from '../../network/hooks/useSalons';
import type { Salon } from '../../types/api';

const DEBOUNCE_MS = 300;

interface SalonSearchProps {
  latitude?: number;
  longitude?: number;
  onSelect: (salon: Salon) => void;
}

export default function SalonSearch({ latitude, longitude, onSelect }: SalonSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isFetching } = useSearchSalons({
    q: debouncedQuery,
    lat: latitude,
    lng: longitude,
  });

  const handleSelect = (salon: Salon) => {
    onSelect(salon);
    setQuery(salon.name);
    setDebouncedQuery('');
  };

  return (
    <div className="relative w-full">
      <TextField
        fullWidth
        size="small"
        value={query}
        placeholder={t('salons.searchPlaceholder')}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            className: 'bg-white',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={isFetching} size="small">
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {!!debouncedQuery && !!results?.length && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-md overflow-hidden z-10">
          {results.map((salon) => (
            <li key={salon.id}>
              <button
                type="button"
                onClick={() => handleSelect(salon)}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <span className="block font-medium">{salon.name}</span>
                <span className="block text-xs text-slate-500">
                  {salon.address}
                  {salon.distanceKm != null && ` · ${salon.distanceKm.toFixed(1)} km`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!!debouncedQuery && results?.length === 0 && !isFetching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-md p-3 text-sm text-slate-500 z-10">
          {t('salons.emptyNearby')}
        </div>
      )}

    </div>
  );
}
