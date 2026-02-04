import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
      <StatusBar style="light" />
      <View className="p-8 items-center">
        <View className="size-20 bg-primary/20 rounded-full items-center justify-center mb-6 border border-primary/50">
           <Text className="text-4xl">⚡</Text>
        </View>
        <Text className="text-3xl font-bold text-white mb-2 font-display">FieldSync</Text>
        <Text className="text-slate-400 text-center mb-10">Offline-First Field Engineering ERP</Text>
        
        <Link href="/dashboard" asChild>
          <TouchableOpacity className="bg-primary w-full py-4 px-8 rounded-xl items-center shadow-lg shadow-primary/20">
            <Text className="text-background-dark font-bold text-lg uppercase tracking-wider">Enter Dashboard</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
