import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View className="py-2 bg-surface-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-brand-primary border-brand-primary shadow-soft-sm'
                  : 'bg-surface-subtle border-surface-border'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? 'text-surface-white font-bold' : 'text-ink-body'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
