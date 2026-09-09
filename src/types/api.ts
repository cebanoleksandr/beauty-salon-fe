// ==========================================
// Загальні типи пагінації
// ==========================================
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==========================================
// Користувачі та Авторизація
// ==========================================
export type UserRole = 'CLIENT' | 'MASTER' | 'SALON_OWNER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ==========================================
// Салони
// ==========================================
export interface Salon {
  id: string;
  name: string;
  description?: string | null;
  address: string;
  phone?: string | null;
  latitude: number;
  longitude: number;
  ownerId?: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

export interface NearbySalonsQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

// ==========================================
// Послуги (Services) та Зв'язки майстра
// ==========================================
export interface ServiceItem {
  id: string;
  salonId: string;
  salon?: Salon;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasterService {
  id: string;
  masterId: string;
  serviceId: string;
  customPrice?: number | null;
  customDuration?: number | null;
  service?: ServiceItem;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Профіль майстра
// ==========================================
export interface MasterProfile {
  id: string;
  userId: string;
  user: User;
  salonId?: string | null;
  salon?: Salon | null;
  bio?: string | null;
  rating: number;
  reviewCount: number;
  services?: MasterService[];
  workingHours?: WorkingHour[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Бронювання (Bookings)
// ==========================================
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface BookingServiceItem {
  id: string;
  bookingId: string;
  serviceId: string;
  price: number;
  durationMinutes: number;
  service?: ServiceItem;
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  masterId: string;
  master?: MasterProfile;
  status: BookingStatus;
  startTime: string; // ISO рядок
  endTime: string;   // ISO рядок
  totalPrice: number;
  comment?: string | null;
  cancellationReason?: string | null;
  services: BookingServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityQuery {
  masterId: string;
  serviceId?: string;
  date: string; // YYYY-MM-DD
}

export interface CreateBookingDto {
  masterId: string;
  serviceIds: string[];
  startTime: string; // ISO рядок
  comment?: string;
}

// ==========================================
// Запити на приєднання до салону (Join Requests)
// ==========================================
export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SalonJoinRequest {
  id: string;
  salonId: string;
  salon?: Salon;
  masterId: string;
  master?: MasterProfile;
  status: JoinRequestStatus;
  message?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Сповіщення (Notifications)
// ==========================================
export type NotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'JOIN_REQUEST_RECEIVED'
  | 'JOIN_REQUEST_APPROVED'
  | 'JOIN_REQUEST_REJECTED';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Відгуки (Reviews)
// ==========================================
export interface Review {
  id: string;
  userId: string;
  user?: User;
  bookingId?: string | null;
  salonId?: string | null;
  masterId?: string | null;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  bookingId?: string;
  salonId?: string;
  masterId?: string;
  rating: number;
  comment: string;
}

// ==========================================
// Графік роботи та заблокований час
// ==========================================
export interface WorkingHour {
  id: string;
  masterId: string;
  dayOfWeek: number; // 0-6 (0 - Неділя або Понеділок відповідно до логіки бекенду)
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isDayOff: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SetWorkingHoursDto {
  masterId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isDayOff?: boolean;
}

export interface BlockedTime {
  id: string;
  masterId: string;
  startTime: string; // ISO рядок
  endTime: string;   // ISO рядок
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockedTimeDto {
  masterId: string;
  startTime: string;
  endTime: string;
  reason?: string;
}
