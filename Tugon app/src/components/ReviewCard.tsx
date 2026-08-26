import React from 'react';
import { View, Text, Image } from 'react-native';
import { Star, ShieldCheck } from 'lucide-react-native';
import { ReviewItem } from '../types';

interface ReviewCardProps {
  review: ReviewItem;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <View className="bg-surface-white rounded-3xl p-4 mb-3.5 border border-surface-border shadow-soft-sm">
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center">
          <Image
            source={{ uri: review.authorAvatar }}
            className="w-10 h-10 rounded-2xl bg-surface-neutral mr-3"
            resizeMode="cover"
          />
          <View>
            <View className="flex-row items-center">
              <Text className="text-sm font-bold text-ink-heading mr-1.5">
                {review.authorName}
              </Text>
              {review.verified && <ShieldCheck size={14} color="#10B981" />}
            </View>
            <Text className="text-[11px] text-ink-secondary font-medium">
              {review.date}
            </Text>
          </View>
        </View>

        {/* Stars */}
        <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-xs font-bold text-amber-900 ml-1">
            {review.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Service Tag */}
      <View className="bg-surface-subtle self-start px-2.5 py-0.5 rounded-lg border border-surface-border mb-2">
        <Text className="text-[11px] font-semibold text-brand-primary">
          Service: {review.serviceRendered}
        </Text>
      </View>

      {/* Review text */}
      <Text className="text-xs text-ink-body leading-relaxed font-normal">
        "{review.comment}"
      </Text>
    </View>
  );
};
