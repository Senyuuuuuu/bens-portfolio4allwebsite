import React from 'react';
import { View, Text } from 'react-native';
import { Award, Star, CheckCircle2, ThumbsUp } from 'lucide-react-native';

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  type: 'experience' | 'rating' | 'jobs' | 'satisfaction';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  type,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'experience':
        return <Award size={18} color="#0A3D62" />;
      case 'rating':
        return <Star size={18} color="#FBBF24" fill="#FBBF24" />;
      case 'jobs':
        return <CheckCircle2 size={18} color="#10B981" />;
      case 'satisfaction':
        return <ThumbsUp size={18} color="#F97316" />;
    }
  };

  return (
    <View className="flex-1 bg-surface-white/95 rounded-2xl p-3.5 mx-1 border border-surface-border shadow-soft-md items-center justify-center">
      <View className="w-8 h-8 rounded-xl bg-surface-neutral items-center justify-center mb-1.5">
        {getIcon()}
      </View>
      <Text className="text-base font-bold text-ink-heading leading-tight">
        {value}
      </Text>
      <Text className="text-[11px] font-medium text-ink-secondary mt-0.5 text-center">
        {label}
      </Text>
      {sublabel && (
        <Text className="text-[9px] text-ink-muted mt-0.5 text-center">
          {sublabel}
        </Text>
      )}
    </View>
  );
};
