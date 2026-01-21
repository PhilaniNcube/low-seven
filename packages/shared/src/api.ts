// Common response wrappers
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Database entity types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  userId: string;
  role: string;
  permissions: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded";
export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "cash" | "other";

export interface Activity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  location: string;
  durationMinutes: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityMedia {
  id: string;
  activityId: string;
  mediaUrl: string;
  mediaType: string;
  altText: string | null;
  displayOrder: number;
  createdAt: Date;
}

export interface ActivityWithDetails extends Activity {
  media?: ActivityMedia[];
  averageRating?: number;
  reviewCount?: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isCustom: boolean;
  basePrice: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageMedia {
  id: string;
  packageId: string;
  mediaUrl: string;
  mediaType: string;
  altText: string | null;
  displayOrder: number;
  createdAt: Date;
}

export interface PackageWithDetails extends Package {
  activities?: Activity[];
  media?: PackageMedia[];
  activityCount?: number;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string | null;
  status: BookingStatus;
  totalPrice: string;
  startDate: Date;
  endDate: Date;
  specialRequests: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingActivity {
  id: string;
  bookingId: string;
  activityId: string;
  guideId: string | null;
  priceAtBooking: string;
  scheduledAt: Date | null;
}

export interface BookingWithDetails extends Booking {
  package?: Package | null;
  activities?: Array<BookingActivity & { activity: Activity; guide?: Guide }>;
  payments?: Payment[];
}

export interface Review {
  id: string;
  bookingActivityId: string;
  userId: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithDetails extends Review {
  user: Pick<User, "id" | "name" | "image">;
  activity?: Activity;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: string;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paymentProvider: string | null;
  paymentIntentId: string | null;
  metadata: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  specialties: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request body types
export interface CreateActivityRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  location: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateActivityRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  durationMinutes?: number;
  price?: number;
}

export interface CreatePackageRequest {
  name: string;
  description: string;
  imageUrl?: string;
  isCustom?: boolean;
  basePrice?: number;
}

export interface UpdatePackageRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  isCustom?: boolean;
  basePrice?: number;
}

export interface CreateBookingRequest {
  packageId?: string;
  startDate: string;
  endDate: string;
  specialRequests?: string;
  activities: Array<{
    activityId: string;
    scheduledAt?: string;
  }>;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  specialRequests?: string;
}

export interface CreateReviewRequest {
  bookingActivityId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface CreateGuideRequest {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties?: string;
  imageUrl?: string;
}

export interface UpdateGuideRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  specialties?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// Query parameter types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ActivityQueryParams extends PaginationParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingQueryParams extends PaginationParams {
  status?: BookingStatus;
}

export interface ReviewQueryParams extends PaginationParams {
  activityId?: string;
  rating?: number;
}
