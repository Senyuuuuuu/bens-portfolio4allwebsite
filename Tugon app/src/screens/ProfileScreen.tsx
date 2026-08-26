import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Heart,
  Share2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  Wrench,
  CalendarCheck,
  PhoneCall,
  MessageSquare,
} from 'lucide-react-native';
import { StatCard } from '../components/StatCard';
import { ReviewCard } from '../components/ReviewCard';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { featuredProviders } from '../data/mockData';

interface ProfileScreenProps {
  route: { params?: { providerId?: string } };
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const providerId = route.params?.providerId || 'provider-marcus';
  const provider =
    featuredProviders.find((p) => p.id === providerId) || featuredProviders[0];

  const [activeTab, setActiveTab] = useState<
    'About' | 'Availability' | 'Experience' | 'Reviews'
  >('About');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    provider.availableSlots[0]?.id || null
  );

  const tabs: ('About' | 'Availability' | 'Experience' | 'Reviews')[] = [
    'About',
    'Availability',
    'Experience',
    'Reviews',
  ];

  return (
    <View className="flex-1 bg-surface-neutral">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1"
      >
        {/* =========================================================
            1. HERO IMAGE (High-Quality Photographic Header)
            ========================================================= */}
        <View className="relative w-full h-80 bg-brand-dark">
          <Image
            source={{ uri: provider.heroImageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Gradient Scrim Overlay */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

          {/* Top Bar Actions (Back, Heart, Share) */}
          <SafeAreaView className="absolute top-0 left-0 right-0 z-20">
            <View className="flex-row items-center justify-between px-5 pt-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md items-center justify-center border border-white/20"
              >
                <ChevronLeft size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <View className="flex-row items-center space-x-2.5">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsSaved(!isSaved)}
                  className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md items-center justify-center border border-white/20"
                >
                  <Heart
                    size={20}
                    color={isSaved ? '#EF4444' : '#FFFFFF'}
                    fill={isSaved ? '#EF4444' : 'transparent'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => alert(`Shared ${provider.name}'s profile`)}
                  className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md items-center justify-center border border-white/20"
                >
                  <Share2 size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Hero Identity Tag & Category */}
          <View className="absolute bottom-5 left-5 right-5 z-10">
            <View className="flex-row items-center bg-accent-orange px-3 py-1 rounded-full self-start mb-2 shadow-orange-glow">
              <ShieldCheck size={13} color="#FFFFFF" />
              <Text className="text-[11px] font-bold text-white uppercase ml-1 tracking-wider">
                Verified Master Professional
              </Text>
            </View>

            <Text className="text-2xl font-bold text-surface-white leading-tight drop-shadow-md">
              {provider.name}
            </Text>
            <Text className="text-sm font-medium text-white/90 drop-shadow-sm mt-0.5">
              {provider.title}
            </Text>
          </View>
        </View>

        {/* =========================================================
            2. FLOATING OVERLAPPING STAT CARDS
            ========================================================= */}
        <View className="px-5 -mt-6 z-30">
          <View className="flex-row justify-between">
            <StatCard
              type="experience"
              value={provider.stats.experience}
              label="Experience"
              sublabel="In-field master"
            />
            <StatCard
              type="rating"
              value={provider.stats.rating}
              label="Rating"
              sublabel={`(${provider.reviewCount} reviews)`}
            />
            <StatCard
              type="jobs"
              value={provider.stats.jobsDone}
              label="Jobs Done"
              sublabel="On-time delivery"
            />
          </View>
        </View>

        {/* Quick Contact & Location Bar */}
        <View className="px-5 mt-4">
          <View className="bg-surface-white rounded-2xl p-3.5 border border-surface-border flex-row items-center justify-between shadow-soft-sm">
            <View className="flex-row items-center flex-1 mr-2">
              <MapPin size={16} color="#0A3D62" />
              <Text className="text-xs font-semibold text-ink-heading ml-1.5" numberOfLines={1}>
                {provider.location}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => alert(`Calling ${provider.name}...`)}
                className="w-8 h-8 rounded-xl bg-surface-neutral items-center justify-center border border-surface-border"
              >
                <PhoneCall size={14} color="#0A3D62" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MessagesTab')}
                className="w-8 h-8 rounded-xl bg-surface-neutral items-center justify-center border border-surface-border"
              >
                <MessageSquare size={14} color="#0A3D62" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* =========================================================
            3. TABBED NAVIGATION BAR
            ========================================================= */}
        <View className="px-5 mt-5">
          <View className="flex-row bg-surface-white p-1 rounded-2xl border border-surface-border shadow-soft-sm">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-primary shadow-soft-sm'
                      : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-surface-white' : 'text-ink-secondary'
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =========================================================
            4. TAB CONTENT SECTIONS
            ========================================================= */}
        <View className="px-5 mt-4">
          {/* TAB 1: ABOUT */}
          {activeTab === 'About' && (
            <View className="space-y-4">
              {/* Bio Card */}
              <View className="bg-surface-white rounded-3xl p-5 border border-surface-border shadow-soft-sm">
                <Text className="text-sm font-bold text-ink-heading mb-2">
                  Professional Biography
                </Text>
                <Text className="text-xs text-ink-body leading-relaxed">
                  {provider.bio}
                </Text>
              </View>

              {/* Specialties */}
              <View className="bg-surface-white rounded-3xl p-5 border border-surface-border shadow-soft-sm">
                <Text className="text-sm font-bold text-ink-heading mb-3">
                  Core Specialties
                </Text>
                <View className="space-y-2">
                  {provider.specialties.map((spec, i) => (
                    <View key={i} className="flex-row items-center mb-2">
                      <CheckCircle size={15} color="#10B981" />
                      <Text className="text-xs font-medium text-ink-heading ml-2.5">
                        {spec}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Equipment & Tools Provided */}
              <View className="bg-surface-white rounded-3xl p-5 border border-surface-border shadow-soft-sm">
                <Text className="text-sm font-bold text-ink-heading mb-3">
                  Field Tools &amp; Gear Provided
                </Text>
                <View className="space-y-2">
                  {provider.toolsProvided.map((tool, i) => (
                    <View key={i} className="flex-row items-center mb-2">
                      <Wrench size={15} color="#0A3D62" />
                      <Text className="text-xs font-medium text-ink-heading ml-2.5">
                        {tool}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: AVAILABILITY & SCHEDULING */}
          {activeTab === 'Availability' && (
            <View className="bg-surface-white rounded-3xl p-5 border border-surface-border shadow-soft-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-bold text-ink-heading">
                  Select Inspection Time Slot
                </Text>
                <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-emerald-700">
                    Live Booking
                  </Text>
                </View>
              </View>

              <TimeSlotPicker
                slots={provider.availableSlots}
                selectedSlotId={selectedSlotId}
                onSelectSlot={setSelectedSlotId}
              />
            </View>
          )}

          {/* TAB 3: EXPERIENCE & CERTIFICATIONS */}
          {activeTab === 'Experience' && (
            <View className="bg-surface-white rounded-3xl p-5 border border-surface-border shadow-soft-sm space-y-4">
              <Text className="text-sm font-bold text-ink-heading mb-2">
                Licenses &amp; Official Certifications
              </Text>
              {provider.certifications.map((cert, i) => (
                <View
                  key={i}
                  className="flex-row items-center p-3 bg-surface-subtle rounded-2xl border border-surface-border mb-2.5"
                >
                  <Award size={20} color="#0A3D62" />
                  <Text className="text-xs font-semibold text-ink-heading ml-3 flex-1">
                    {cert}
                  </Text>
                  <ShieldCheck size={16} color="#10B981" />
                </View>
              ))}

              <View className="p-4 bg-brand-subtle rounded-2xl border border-brand-sky mt-2">
                <Text className="text-xs font-bold text-brand-primary mb-1">
                  100% Background Check Cleared
                </Text>
                <Text className="text-[11px] text-ink-secondary">
                  Identity, criminal background, and technical trade licensing verified by Tugon Security Bureau.
                </Text>
              </View>
            </View>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'Reviews' && (
            <View>
              <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-sm font-bold text-ink-heading">
                  Verified Client Reviews ({provider.reviewCount})
                </Text>
                <View className="flex-row items-center">
                  <Star size={14} color="#FBBF24" fill="#FBBF24" />
                  <Text className="text-xs font-bold text-ink-heading ml-1">
                    {provider.rating.toFixed(2)} / 5.0
                  </Text>
                </View>
              </View>

              {provider.reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* =========================================================
          5. STICKY FIXED FOOTER ACTION
          ========================================================= */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-white/95 border-t border-surface-border px-5 pt-3 pb-6 shadow-floating-nav">
        <View className="flex-row items-center justify-between">
          {/* Rate and Estimate */}
          <View>
            <Text className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">
              Hourly Rate
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-bold text-brand-primary">
                ${provider.hourlyRate}
              </Text>
              <Text className="text-xs text-ink-secondary ml-1 font-medium">/ hour</Text>
            </View>
          </View>

          {/* Full Width Orange CTA Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              alert(
                `Schedule confirmed with ${provider.name} for slot: ${
                  provider.availableSlots.find((s) => s.id === selectedSlotId)?.time || 'Next Available'
                }. Confirmation sent to your inbox!`
              )
            }
            className="flex-1 ml-5 bg-accent-orange py-3.5 px-6 rounded-2xl shadow-orange-glow items-center justify-center flex-row"
          >
            <CalendarCheck size={18} color="#FFFFFF" />
            <Text className="text-sm font-bold text-surface-white ml-2">
              Schedule Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
