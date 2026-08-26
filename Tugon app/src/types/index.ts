export type RootStackParamList = {
  MainTabs: undefined;
  ProviderDetail: { providerId: string };
  BookService: { providerId: string; serviceId?: string };
  NotificationList: undefined;
  SearchScreen: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  BookingsTab: undefined;
  MessagesTab: undefined;
  AccountTab: undefined;
};

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  badge?: string;
  itemCount: number;
  bgColor: string;
  iconColor: string;
  slug: string;
}

export interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  buttonText: string;
  imageUrl: string;
  category: string;
  expiresIn: string;
}

export interface ProviderStat {
  label: string;
  value: string;
  icon: string;
  sublabel: string;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  serviceRendered: string;
  verified: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  available: boolean;
}

export interface Provider {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  experienceYears: number;
  completedJobs: number;
  location: string;
  distance: string;
  verified: boolean;
  avatarUrl: string;
  heroImageUrl: string;
  bio: string;
  specialties: string[];
  toolsProvided: string[];
  certifications: string[];
  stats: {
    experience: string;
    rating: string;
    jobsDone: string;
    satisfaction: string;
  };
  reviews: ReviewItem[];
  availableSlots: TimeSlot[];
}
