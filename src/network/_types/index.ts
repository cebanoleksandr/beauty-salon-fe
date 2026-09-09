export const EQueries = {
  PROFILE: 'profile',
  SALONS: 'salons',
  SALON: 'salon',
  SALONS_NEARBY: 'salons-nearby',
  SALONS_SEARCH: 'salons-search',
  SERVICES: 'services',
  MASTERS: 'masters',
  MASTER: 'master',
  BOOKINGS_AVAILABILITY: 'bookings-availability',
  BOOKINGS_MY: 'bookings-my',
  JOIN_REQUESTS: 'join-requests',
  NOTIFICATIONS: 'notifications',
  REVIEWS_SALON: 'reviews-salon',
  WORKING_HOURS: 'working-hours',
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];