import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import { TimeSlot } from '../types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  const periods: ('Morning' | 'Afternoon' | 'Evening')[] = [
    'Morning',
    'Afternoon',
    'Evening',
  ];

  return (
    <View className="space-y-4">
      {periods.map((period) => {
        const periodSlots = slots.filter((s) => s.period === period);
        if (periodSlots.length === 0) return null;

        return (
          <View key={period} className="mb-4">
            <View className="flex-row items-center mb-2.5">
              <Clock size={14} color="#0A3D62" />
              <Text className="text-xs font-bold text-ink-primary ml-1.5 uppercase tracking-wider">
                {period} Slots
              </Text>
            </View>

            <View className="flex-row flex-wrap -m-1">
              {periodSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isAvailable = slot.available;

                return (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={!isAvailable}
                    activeOpacity={0.7}
                    onPress={() => onSelectSlot(slot.id)}
                    className={`p-3 rounded-2xl m-1 border min-w-[30%] items-center justify-center ${
                      !isAvailable
                        ? 'bg-surface-neutral border-surface-border opacity-40'
                        : isSelected
                        ? 'bg-accent-orange border-accent-orange shadow-orange-glow'
                        : 'bg-surface-white border-surface-border shadow-soft-sm'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-surface-white'
                          : isAvailable
                          ? 'text-ink-heading'
                          : 'text-ink-muted line-through'
                      }`}
                    >
                      {slot.time}
                    </Text>
                    <Text
                      className={`text-[9px] mt-0.5 font-medium ${
                        isSelected
                          ? 'text-white/80'
                          : isAvailable
                          ? 'text-status-success'
                          : 'text-ink-muted'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Booked'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};
