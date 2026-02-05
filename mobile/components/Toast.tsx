import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
  duration?: number;
}

export const Toast = ({ id, message, type, onDismiss, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#13eca4]';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.springify().damping(15)} 
      exiting={FadeOutUp}
      className={`absolute top-0 left-4 right-4 z-50 rounded-xl shadow-lg p-4 flex-row items-center gap-3 ${getBackgroundColor()}`}
      style={{ marginTop: 60 }} // Safe area offset handled by parent or margin
    >
      <MaterialIcons name={getIcon()} size={24} color="#10221c" />
      <Text className="flex-1 text-[#10221c] font-bold text-sm">{message}</Text>
      <TouchableOpacity onPress={() => onDismiss(id)}>
        <MaterialIcons name="close" size={20} color="#10221c" style={{ opacity: 0.6 }} />
      </TouchableOpacity>
    </Animated.View>
  );
};
