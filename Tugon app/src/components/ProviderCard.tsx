import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react-native';
import { Provider } from '../types';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  onQuickBook?: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onPress,
  onQuickBook,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-surface-white rounded-3xl p-4 mb-4 border border-surface-border shadow-soft-sm"
    >
      <View className="flex-row items-center">
        {/* Avatar with Verified Badge */}
        <View className="relative mr-3.5">
          <Image
            source={{ uri: provider.avatarUrl }}
            className="w-16 h-16 rounded-2xl bg-surface-neutral"
            resizeMode="cover"
          />
          {provider.verified && (
            <View className="absolute -bottom-1 -right-1 bg-surface-white rounded-full p-0.5 shadow-soft-sm">
              <ShieldCheck size={16} color="#10B981" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-ink-heading" numberOfLines={1}>
              {provider.name}
            </Text>
            <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-xs font-bold text-amber-900 ml-1">
                {provider.rating.toFixed(2)}
              </Text>
            </View>
          </View>

          <Text className="text-xs font-medium text-ink-secondary mt-0.5" numberOfLines={1}>
            {provider.title}
          </Text>

          <View className="flex-row items-center mt-2 space-x-3">
            <View className="flex-row items-center">
              <MapPin size={12} color="#64748B" />
              <Text className="text-xs text-ink-secondary ml-1 font-medium">
                {provider.distance}
              </Text>
            </View>
            <Text className="text-xs text-ink-muted">·</Text>
            <Text className="text-xs text-ink-secondary font-medium">
              {provider.completedJobs}+ jobs done
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Action / Price Row */}
      <View className="flex-row items-center justify-between mt-3.5 pt-3 border-t border-surface-divider">
        <View className="flex-row items-baseline">
          <Text className="text-lg font-bold text-brand-primary">
            ${provider.hourlyRate}
          </Text>
          <Text className="text-xs text-ink-secondary ml-1 font-medium">/ hour</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onQuickBook || onPress}
          className="flex-row items-center bg-accent-orange px-4 py-2 rounded-2xl shadow-orange-glow"
        >
          <Text className="text-xs font-bold text-surface-white mr-1.5">
            View &amp; Book
          </Text>
          <ArrowRight size={13} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
