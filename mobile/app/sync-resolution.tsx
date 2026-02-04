import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SyncResolution() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Top Nav */}
      <View className="flex-row items-center justify-between p-4 pb-2 bg-background-dark/80 border-b border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="size-10 items-center justify-center">
          <Text className="text-primary text-2xl">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Sync & Resolution</Text>
        <View className="size-10 items-center justify-center rounded-lg bg-primary/10">
          <Text className="text-primary text-xl">^</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Stats */}
        <View className="flex-row gap-3 p-4">
          <View className="flex-1 bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/50">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-primary text-sm">✓</Text>
              <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">CRDT Integrity</Text>
            </View>
            <Text className="text-white text-2xl font-bold">100%</Text>
            <Text className="text-primary text-xs">State Vector Match</Text>
          </View>
          
          <View className="flex-1 bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/50">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-primary text-sm">~</Text>
              <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">Mesh Peers</Text>
            </View>
            <Text className="text-white text-2xl font-bold">4 Active</Text>
            <View className="flex-row items-center gap-1">
              <View className="size-1.5 rounded-full bg-primary" />
              <Text className="text-primary text-xs">Local P2P Active</Text>
            </View>
          </View>
        </View>

        {/* Radar Map Placeholder */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-white text-md font-bold">Nearby Peer Mesh</Text>
            <View className="bg-primary/20 px-2 py-0.5 rounded-full">
              <Text className="text-primary text-[10px] font-mono">RADAR_ACTIVE</Text>
            </View>
          </View>
          <View className="aspect-square bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden items-center justify-center">
            {/* Grid Lines */}
            <View className="absolute inset-0 border border-slate-800 rounded-full scale-75 opacity-50" />
            <View className="absolute inset-0 border border-slate-800 rounded-full scale-50 opacity-30" />
            <View className="w-full h-[1px] bg-slate-800 absolute" />
            <View className="h-full w-[1px] bg-slate-800 absolute" />
            
            {/* Center User */}
            <View className="size-2 bg-white rounded-full absolute" />
            
            {/* Peers */}
            <View className="absolute top-1/4 left-1/3 items-center">
              <View className="size-4 bg-primary rounded-full shadow-lg shadow-primary" />
              <View className="bg-background-dark/90 px-2 py-1 rounded border border-primary/30 mt-2">
                <Text className="text-white text-[10px]">ENG-42 (Primary)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View className="px-4 mb-20">
          <Text className="text-white text-md font-bold mb-4">CRDT Resolution Timeline</Text>
          
          <View className="gap-6 relative">
            <View className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800" />
            
            {/* Item 1 */}
            <View className="flex-row items-center justify-between">
              <View className="w-[42%] bg-slate-900 p-3 rounded-lg border border-slate-800">
                <Text className="text-primary text-[10px] font-bold mb-1">LOCAL EDIT</Text>
                <Text className="text-white text-sm font-bold">Valve_04: CLOSED</Text>
                <Text className="text-slate-500 text-[10px] font-mono">ID: 4f2a..88</Text>
              </View>
              <View className="size-6 bg-primary rounded-full items-center justify-center z-10 border-4 border-background-dark">
                <Text className="text-background-dark text-xs font-bold">✓</Text>
              </View>
              <View className="w-[42%] bg-slate-900 p-3 rounded-lg border border-slate-800 opacity-50">
                <Text className="text-slate-400 text-[10px] font-bold mb-1">PEER ENG-42</Text>
                <Text className="text-white text-sm">Valve_04: IDLE</Text>
                <Text className="text-slate-500 text-[10px] font-mono">ID: a9c1..22</Text>
              </View>
            </View>

            {/* Merge Event */}
            <View className="self-center bg-emerald-900/30 px-4 py-1 rounded-full border border-emerald-500/30 z-10">
              <Text className="text-primary text-[10px] font-bold">Y.JS RESOLUTION: LWW applied</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 w-full p-4 bg-background-dark border-t border-slate-800 gap-3">
        <TouchableOpacity className="w-full h-12 bg-primary rounded-lg items-center justify-center flex-row gap-2">
          <Text className="text-background-dark text-sm font-bold uppercase">Force Cloud Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-full h-12 bg-slate-800 rounded-lg items-center justify-center flex-row gap-2">
          <Text className="text-white text-sm font-bold uppercase">Export Vector Log</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
