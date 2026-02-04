import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold text-blue-600">Welcome to FieldSync</Text>
      <Text className="text-gray-500">Offline-First Sync Engine</Text>
    </View>
  );
}
