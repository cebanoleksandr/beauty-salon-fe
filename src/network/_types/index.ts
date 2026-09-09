export const EQueries = {
  PROFILE: 'profile',
  SALONS: 'salons',
  SALON: 'salon',
  SALONS_NEARBY: 'salons-nearby',
  SALONS_SEARCH: 'salons-search',
  SERVICES: 'services',
  MASTERS: 'masters',
  MASTER: 'master',
  MASTER_SERVICES: 'master-services',
  MASTER_SERVICES_MY: 'master-services-my',
  BOOKINGS_AVAILABILITY: 'bookings-availability',
  BOOKINGS_MY: 'bookings-my',
  JOIN_REQUESTS: 'join-requests',
  NOTIFICATIONS: 'notifications',
  REVIEWS_SALON: 'reviews-salon',
  WORKING_HOURS: 'working-hours',
} as const;

export type EQueries = (typeof EQueries)[keyof typeof EQueries];