import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search, SlidersHorizontal, Mic } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search "electrician", "deep clean", "pipe leak"...',
}) => {
  return (
    <View className="px-5 py-3 bg-surface-white">
      <View className="flex-row items-center bg-surface-neutral rounded-2xl px-4 py-2.5 border border-surface-border shadow-soft-sm">
        {/* Search Icon */}
        <Search size={20} color="#64748B" />

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-base text-ink-heading font-medium"
          returnKeyType="search"
        />

        {/* Voice or Filter Icon */}
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onFilterPress}
            className="w-8 h-8 rounded-xl bg-surface-white items-center justify-center border border-surface-border shadow-soft-sm"
          >
            <SlidersHorizontal size={15} color="#0A3D62" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
