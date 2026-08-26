import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home, Compass, CalendarCheck, MessageSquare, User } from 'lucide-react-native';

interface FloatingBottomNavProps {
  activeTab: 'Home' | 'Explore' | 'Bookings' | 'Messages' | 'Profile';
  onTabPress: (tab: 'Home' | 'Explore' | 'Bookings' | 'Messages' | 'Profile') => void;
  unreadCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onTabPress,
  unreadCount = 3,
}) => {
  return (
    <View className="absolute bottom-6 left-5 right-5 z-50">
      <View className="bg-surface-white/95 rounded-4xl px-4 py-2.5 flex-row items-center justify-between border border-surface-border shadow-floating-nav">
        
        {/* Tab 1: Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabPress('Home')}
          className="items-center justify-center flex-1 py-1"
        >
          <Home
            size={22}
            color={activeTab === 'Home' ? '#0A3D62' : '#94A3B8'}
            strokeWidth={activeTab === 'Home' ? 2.5 : 2}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'Home' ? 'text-brand-primary font-bold' : 'text-ink-muted'
            }`}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Explore */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabPress('Explore')}
          className="items-center justify-center flex-1 py-1"
        >
          <Compass
            size={22}
            color={activeTab === 'Explore' ? '#0A3D62' : '#94A3B8'}
            strokeWidth={activeTab === 'Explore' ? 2.5 : 2}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'Explore' ? 'text-brand-primary font-bold' : 'text-ink-muted'
            }`}
          >
            Explore
          </Text>
        </TouchableOpacity>

        {/* Center Elevated CTA: Bookings (Vibrant Orange Circular Button) */}
        <View className="items-center justify-center -mt-8 flex-1">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onTabPress('Bookings')}
            className="w-14 h-14 rounded-full bg-accent-orange items-center justify-center shadow-orange-glow border-4 border-surface-white"
          >
            <CalendarCheck size={24} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
          <Text className="text-[10px] mt-1 font-bold text-accent-orange">
            Bookings
          </Text>
        </View>

        {/* Tab 4: Messages */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabPress('Messages')}
          className="items-center justify-center flex-1 py-1 relative"
        >
          <MessageSquare
            size={22}
            color={activeTab === 'Messages' ? '#0A3D62' : '#94A3B8'}
            strokeWidth={activeTab === 'Messages' ? 2.5 : 2}
          />
          {unreadCount > 0 && (
            <View className="absolute top-0 right-3 bg-accent-orange rounded-full px-1.5 py-0.2 min-w-[16px] items-center justify-center">
              <Text className="text-[9px] font-bold text-white">
                {unreadCount}
              </Text>
            </View>
          )}
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'Messages' ? 'text-brand-primary font-bold' : 'text-ink-muted'
            }`}
          >
            Inbox
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile / Account */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onTabPress('Profile')}
          className="items-center justify-center flex-1 py-1"
        >
          <User
            size={22}
            color={activeTab === 'Profile' ? '#0A3D62' : '#94A3B8'}
            strokeWidth={activeTab === 'Profile' ? 2.5 : 2}
          />
          <Text
            className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'Profile' ? 'text-brand-primary font-bold' : 'text-ink-muted'
            }`}
          >
            Account
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};
