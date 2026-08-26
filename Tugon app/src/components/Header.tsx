import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, ChevronDown, Bell, ShieldCheck } from 'lucide-react-native';

interface HeaderProps {
  location?: string;
  userName?: string;
  unreadNotifications?: number;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  location = 'Makati Central, Metro Manila',
  userName = 'Alex',
  unreadNotifications = 2,
  onLocationPress,
  onNotificationPress,
}) => {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-3 bg-surface-white border-b border-surface-divider">
      {/* User Greeting & Location Dropdown */}
      <View className="flex-1 mr-3">
        <View className="flex-row items-center space-x-1 mb-0.5">
          <Text className="text-xs font-medium text-ink-secondary tracking-wider uppercase">
            Service Location
          </Text>
          <ShieldCheck size={13} color="#10B981" />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLocationPress}
          className="flex-row items-center"
        >
          <MapPin size={16} color="#0A3D62" />
          <Text
            numberOfLines={1}
            className="text-base font-bold text-ink-primary ml-1.5 mr-1"
          >
            {location}
          </Text>
          <ChevronDown size={16} color="#0A3D62" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons: Notification & User Avatar */}
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          className="w-11 h-11 rounded-2xl bg-surface-subtle border border-surface-border items-center justify-center relative shadow-soft-sm"
        >
          <Bell size={20} color="#0A3D62" />
          {unreadNotifications > 0 && (
            <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-accent-orange ring-2 ring-white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-11 h-11 rounded-2xl bg-brand-primary border-2 border-surface-white items-center justify-center overflow-hidden shadow-soft-sm"
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
