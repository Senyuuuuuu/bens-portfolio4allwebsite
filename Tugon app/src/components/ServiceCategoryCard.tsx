import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Wrench,
  Sparkles,
  Zap,
  Hammer,
  Wind,
  Ruler,
  Paintbrush,
  ShieldAlert,
  HelpCircle
} from 'lucide-react-native';
import { ServiceCategory } from '../types';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
}

// Icon mapper for dynamic category rendering
const renderCategoryIcon = (iconName: string, color: string, size = 26) => {
  switch (iconName) {
    case 'Wrench':
      return <Wrench size={size} color={color} />;
    case 'Sparkles':
      return <Sparkles size={size} color={color} />;
    case 'Zap':
      return <Zap size={size} color={color} />;
    case 'Hammer':
      return <Hammer size={size} color={color} />;
    case 'Wind':
      return <Wind size={size} color={color} />;
    case 'Ruler':
      return <Ruler size={size} color={color} />;
    case 'Paintbrush':
      return <Paintbrush size={size} color={color} />;
    case 'ShieldAlert':
      return <ShieldAlert size={size} color={color} />;
    default:
      return <HelpCircle size={size} color={color} />;
  }
};

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  category,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-1 bg-surface-white rounded-3xl p-4 m-1.5 border border-surface-border shadow-soft-sm relative justify-between min-h-[140px]"
    >
      {/* Optional Badge */}
      {category.badge && (
        <View className="absolute top-3 right-3 bg-accent-surface border border-accent-orange/30 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-accent-orange uppercase">
            {category.badge}
          </Text>
        </View>
      )}

      {/* Icon with Soft Rounded Background */}
      <View
        style={{ backgroundColor: category.bgColor }}
        className="w-13 h-13 rounded-2xl items-center justify-center mb-3 shadow-soft-sm self-start p-3"
      >
        {renderCategoryIcon(category.iconName, category.iconColor)}
      </View>

      {/* Category Name & Count */}
      <View>
        <Text
          numberOfLines={1}
          className="text-base font-bold text-ink-heading leading-snug mb-0.5"
        >
          {category.name}
        </Text>
        <Text className="text-xs font-medium text-ink-secondary">
          {category.itemCount} Pros Available
        </Text>
      </View>
    </TouchableOpacity>
  );
};
