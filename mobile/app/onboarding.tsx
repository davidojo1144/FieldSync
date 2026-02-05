import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#101f22]">
      <View className="flex-1 flex-col overflow-hidden bg-[#f6f8f8] dark:bg-[#101f22]">
        
        {/* Status Bar Area (Simulated - actually handled by SafeAreaView/StatusBar component, but keeping UI elements) */}
        <View className="flex-row w-full items-center justify-between px-8 pt-2">
          <Text className="text-xs font-bold tracking-widest text-[#13c8ec]">FS-OS v2.4</Text>
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="signal-cellular-alt" size={14} color="#13c8ec" />
            <MaterialIcons name="battery-charging-full" size={14} color="#13c8ec" />
          </View>
        </View>

        {/* Top Navigation / Logo */}
        <View className="flex-row items-center justify-between p-6">
          <View className="flex-row items-center gap-2">
            <View className="h-10 w-10 items-center justify-center rounded bg-[#13c8ec]">
              <MaterialIcons name="sync-alt" size={24} color="#101f22" style={{ fontWeight: 'bold' }} />
            </View>
            <Text className="text-xl font-bold tracking-tighter uppercase text-slate-900 dark:text-white">FieldSync</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/auth')}>
            <Text className="text-xs font-medium uppercase tracking-widest text-slate-500 hover:text-[#13c8ec]">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Illustration Section */}
        <View className="flex-1 relative">
          <View className="absolute inset-0 px-6 pt-4 pb-4">
            <View className="h-full w-full overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-inner relative">
              <ImageBackground
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRRJFE9tXCkzesxSbaSP7JJavMuUJLCoe32rFV0CcCHgxTYekeq8LgpOR2RPEkwT43gzZrql86n3wYwaeoVNGrKTqzujjn1LFy6XSFki78Led_BlkRQ_GvTkrnfMkVTnl_SkxG79cJeIOHhqEAyJegGQOpDT1qvxeK4Ddp2tpM8wbKXziDpoku99vxs4LLJx6LtSqywLFXNV6tNJULkdr_m6CLLEMNGocQaVpW0aj4sS36FWdMOjyB6-R9UDvDXSl5boG3LNIqvk4" }}
                className="h-full w-full"
                resizeMode="cover"
              >
                 <LinearGradient
                    colors={['rgba(16,31,34,0)', 'rgba(16,31,34,0.8)', 'rgba(16,31,34,1)']}
                    locations={[0, 0.6, 1]}
                    className="absolute inset-0 flex-col justify-end p-8"
                  >
                     <View className="mb-4 flex-row items-center gap-3">
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#13c8ec]/20 border border-[#13c8ec]/40">
                          <MaterialIcons name="router" size={18} color="#13c8ec" />
                        </View>
                        <View className="h-[1px] flex-1 bg-[#13c8ec]/50" />
                     </View>
                  </LinearGradient>
              </ImageBackground>
            </View>
          </View>
        </View>

        {/* Text Content Area */}
        <View className="z-10 px-8 pb-4 pt-4 text-center items-center">
          <Text className="text-4xl font-bold leading-none tracking-tight text-slate-900 dark:text-white uppercase italic text-center">
            Local-First{'\n'}
            <Text className="text-[#13c8ec]">Engineering</Text>
          </Text>
          <Text className="mt-4 text-base font-normal leading-relaxed text-slate-600 dark:text-slate-400 text-center">
            Work anywhere, sync everywhere. Your data merges automatically even without internet using <Text className="text-[#13c8ec]/80 font-mono">CRDT</Text> conflict-free logic.
          </Text>
        </View>

        {/* Bottom Controls */}
        <View className="px-8 pb-10 w-full">
          {/* Progress Indicator */}
          <View className="mb-8 flex-row w-full items-center justify-center gap-3">
            <View className="h-1.5 w-8 rounded-full bg-[#13c8ec]" />
            <View className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <View className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </View>

          {/* CTA Buttons */}
          <View className="flex-col gap-4 w-full">
            <TouchableOpacity 
              className="flex-row w-full items-center justify-center gap-2 rounded-lg bg-[#13c8ec] py-4"
              onPress={() => router.push('/auth')}
            >
              <Text className="text-sm font-bold uppercase tracking-widest text-[#101f22]">Get Started</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#101f22" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-full py-2 items-center"
              onPress={() => router.push('/auth')}
            >
              <Text className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 hover:text-[#13c8ec]">
                Sign in to existing account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
