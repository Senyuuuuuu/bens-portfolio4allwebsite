import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { PromoBanner } from '../components/PromoBanner';
import { ServiceCategoryCard } from '../components/ServiceCategoryCard';
import { ProviderCard } from '../components/ProviderCard';
import { FloatingBottomNav } from '../components/FloatingBottomNav';
import { categoriesData, promoBannersData, featuredProviders } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'Home' | 'Explore' | 'Bookings' | 'Messages' | 'Profile'>('Home');

  const filterOptions = [
    'All',
    'Plumbing',
    'Cleaning',
    'Electrical',
    'Repair',
    'AC Maintenance',
    'Carpentry',
    'Painting',
  ];

  const filteredCategories = selectedCategory === 'All'
    ? categoriesData
    : categoriesData.filter((c) =>
        c.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        c.slug.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const filteredProviders = featuredProviders.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-surface-neutral">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <Header
        location="Makati Central, Metro Manila"
        unreadNotifications={2}
        onLocationPress={() => alert('Location Selector: Makati Central, BGC, Ortigas, Alabang')}
        onNotificationPress={() => alert('Notifications: Marcus Vance confirmed your booking for tomorrow 10:00 AM.')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1"
      >
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => alert('Filter Modal: Distance, Rating, Price Range, Verified Only')}
        />

        {/* Category Horizontal Filter Pills */}
        <CategoryFilter
          categories={filterOptions}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Promotional Banner Carousel (Card 1) */}
        <PromoBanner
          promo={promoBannersData[0]}
          onPress={() => {
            setSelectedCategory('Cleaning');
          }}
        />

        {/* Services Grid Section */}
        <View className="px-5 pt-3 pb-2">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-lg font-bold text-ink-heading">
                Explore Services
              </Text>
              <Text className="text-xs text-ink-secondary font-medium">
                Vetted &amp; background-checked professionals
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => alert('Viewing all 24+ service categories')}
              className="flex-row items-center"
            >
              <Text className="text-xs font-bold text-accent-orange mr-1">
                See All
              </Text>
              <ArrowRight size={13} color="#F97316" />
            </TouchableOpacity>
          </View>

          {/* 2-Column Grid of Categories */}
          <View className="flex-row flex-wrap -m-1.5">
            {filteredCategories.map((category) => (
              <View key={category.id} className="w-1/2 p-1.5">
                <ServiceCategoryCard
                  category={category}
                  onPress={() => {
                    setSelectedCategory(category.name);
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Guarantee Banner */}
        <View className="px-5 my-2">
          <View className="bg-brand-primary rounded-3xl p-4 flex-row items-center justify-between shadow-soft-sm">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center mr-3">
                <ShieldCheck size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-surface-white">
                  Tugon 100% Happiness Guarantee
                </Text>
                <Text className="text-[11px] text-white/80 font-medium">
                  Up to $2,500 property protection on every service.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top-Rated Service Professionals Section */}
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between mb-3.5">
            <View>
              <Text className="text-lg font-bold text-ink-heading">
                Top Rated Nearby
              </Text>
              <Text className="text-xs text-ink-secondary font-medium">
                Instant dispatch within 45 minutes
              </Text>
            </View>
          </View>

          {/* Provider List */}
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => navigation.navigate('ProviderDetail', { providerId: provider.id })}
              onQuickBook={() => navigation.navigate('ProviderDetail', { providerId: provider.id })}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <FloatingBottomNav
        activeTab={activeTab}
        onTabPress={(tab) => {
          setActiveTab(tab);
          if (tab === 'Bookings') {
            navigation.navigate('BookingsTab');
          } else if (tab === 'Messages') {
            navigation.navigate('MessagesTab');
          } else if (tab === 'Profile') {
            navigation.navigate('AccountTab');
          }
        }}
      />
    </SafeAreaView>
  );
};
