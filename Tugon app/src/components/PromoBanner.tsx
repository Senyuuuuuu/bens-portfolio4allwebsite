import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Sparkles, ArrowRight, Tag } from 'lucide-react-native';
import { PromoItem } from '../types';

interface PromoBannerProps {
  promo: PromoItem;
  onPress?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promo, onPress }) => {
  return (
    <View className="px-5 py-3">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        className="rounded-3xl overflow-hidden shadow-soft-md border border-surface-border bg-brand-dark"
      >
        <ImageBackground
          source={{ uri: promo.imageUrl }}
          className="w-full h-48 justify-between p-5"
          imageStyle={{ borderRadius: 28, opacity: 0.4 }}
          resizeMode="cover"
        >
          {/* Top Badge: Discount & Expiry */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-accent-orange px-3 py-1.5 rounded-full shadow-orange-glow">
              <Tag size={13} color="#FFFFFF" />
              <Text className="text-surface-white font-bold text-xs ml-1.5 tracking-wider uppercase">
                {promo.discount}
              </Text>
            </View>

            <View className="bg-brand-primary/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Text className="text-white/90 text-xs font-medium">
                {promo.expiresIn}
              </Text>
            </View>
          </View>

          {/* Bottom Typography & Action */}
          <View>
            <Text className="text-xl font-bold text-surface-white leading-tight mb-1 drop-shadow-sm">
              {promo.title}
            </Text>
            <Text className="text-xs text-white/80 font-medium mb-3 max-w-[80%]">
              {promo.subtitle}
            </Text>

            <View className="flex-row items-center justify-between pt-2 border-t border-white/15">
              <View className="flex-row items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                <Text className="text-xs text-white/70 mr-1.5 font-medium">Code:</Text>
                <Text className="text-xs font-mono font-bold text-surface-white tracking-widest">
                  {promo.code}
                </Text>
              </View>

              <View className="flex-row items-center bg-surface-white px-3.5 py-1.5 rounded-2xl shadow-soft-sm">
                <Text className="text-xs font-bold text-brand-primary mr-1">
                  {promo.buttonText}
                </Text>
                <ArrowRight size={13} color="#0A3D62" />
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};
