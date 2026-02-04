import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withObservables } from '@nozbe/watermelondb/react';
import database from '../src/db';
import WorkOrder from '../src/db/models/WorkOrder';

const WorkOrderItem = ({ workOrder, onPress }: { workOrder: WorkOrder, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="p-4 bg-slate-rugged/40 rounded-xl border border-border-rugged/20 m-2"
  >
    <View className="flex-row justify-between mb-3">
      <View>
        <Text className="text-white text-base font-bold mb-1">{workOrder.title}</Text>
        <Text className="text-[#92c9b7] text-[10px] uppercase font-bold tracking-widest">{workOrder.subtitle}</Text>
      </View>
      <View className={`px-2 py-1 rounded border ${workOrder.priority === 'High' ? 'bg-red-500/20 border-red-500/30' : 'bg-primary/20 border-primary/30'}`}>
        <Text className={`${workOrder.priority === 'High' ? 'text-red-400' : 'text-primary'} text-[10px] font-bold uppercase`}>{workOrder.priority}</Text>
      </View>
    </View>
    
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="size-2 rounded-full bg-slate-500" />
        <Text className="text-slate-400 text-xs">Asset: {workOrder.assetId}</Text>
      </View>
      <Text className="text-slate-500 text-xs">{workOrder.status}</Text>
    </View>

    {/* Progress Bar (Mocked for now) */}
    <View className="mt-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-slate-500 text-[10px] uppercase font-bold">Progress</Text>
        <Text className="text-primary text-[10px] font-bold">80%</Text>
      </View>
      <View className="rounded-full h-1.5 bg-border-rugged/40 overflow-hidden">
        <View className="h-full rounded-full bg-primary w-[80%]" />
      </View>
    </View>
  </TouchableOpacity>
);

function EngineerDashboard({ workOrders }: { workOrders: WorkOrder[] }) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* TopAppBar */}
      <View className="flex-row items-center justify-between p-4 pb-2 border-b border-border-rugged/30">
        <View className="flex-row items-center gap-3">
          <View className="size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Text className="text-primary text-xl">{'>'}</Text>
          </View>
          <View>
            <Text className="text-white text-lg font-bold">Engineer Ops</Text>
            <Text className="text-[10px] uppercase tracking-widest text-primary font-bold">Field Unit ID: XRS-99</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="size-10 items-center justify-center rounded-full bg-slate-rugged">
            <Text className="text-primary text-xl">#</Text>
          </TouchableOpacity>
          <TouchableOpacity className="size-10 items-center justify-center rounded-full bg-slate-rugged">
            <Text className="text-white text-xl">@</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Connectivity Status Card */}
        <View className="p-4">
          <View className="flex-row items-stretch justify-between gap-4 rounded-xl bg-slate-rugged p-5 border border-border-rugged/50">
            <View className="flex-1 flex-col gap-4">
              <View>
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="size-2 rounded-full bg-primary" />
                  <Text className="text-primary text-xs font-bold uppercase tracking-wider">Sync Status</Text>
                </View>
                <Text className="text-white text-xl font-bold">Local-First Mode</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-[#92c9b7] text-xs">P2P Mesh Connection: Stable</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/sync-resolution')}
                className="h-9 px-4 bg-primary/10 border border-primary/30 rounded-lg items-center justify-center self-start"
              >
                <Text className="text-primary text-xs font-bold uppercase tracking-wider">Node Analytics</Text>
              </TouchableOpacity>
            </View>
            
            {/* Visual placeholder for the grid/node graphic */}
            <View className="size-32 bg-slate-900 rounded-lg border border-border-rugged/50 items-center justify-center overflow-hidden">
               <LinearGradient
                  colors={['rgba(19, 236, 164, 0.1)', 'rgba(19, 236, 164, 0.05)']}
                  className="absolute inset-0"
                />
               <Text className="text-primary opacity-50 text-4xl">((.))</Text>
            </View>
          </View>
        </View>

        {/* Pending Sync Action Panel */}
        <View className="px-4 py-2">
          <View className="flex-col gap-4 rounded-xl border border-safety-orange/40 bg-safety-orange/5 p-5">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-safety-orange text-lg">!</Text>
                <Text className="text-white text-base font-bold">3 Pending Syncs</Text>
              </View>
              <Text className="text-slate-400 text-sm">Data cached locally. Automatic merge in progress via CRDT.</Text>
            </View>
            <TouchableOpacity className="h-10 px-4 bg-safety-orange rounded-lg items-center justify-center self-start">
              <Text className="text-white text-sm font-bold uppercase">View Queue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Header */}
        <View className="flex-row items-center justify-between px-4 pt-6 pb-2">
          <Text className="text-white text-[22px] font-bold">Work Orders</Text>
          <View className="bg-border-rugged/30 px-2 py-1 rounded">
            <Text className="text-xs font-bold text-[#92c9b7]">{workOrders.length} ACTIVE</Text>
          </View>
        </View>

        {/* Work Orders List */}
        <View className="p-2 gap-2">
          {workOrders.map(wo => (
            <WorkOrderItem 
              key={wo.id} 
              workOrder={wo} 
              onPress={() => router.push({ pathname: '/ticket-details', params: { id: wo.id } })} 
            />
          ))}
          {workOrders.length === 0 && (
            <View className="p-4 items-center">
                <Text className="text-slate-500">No active work orders.</Text>
                {/* Temporary button to seed data */}
                 <TouchableOpacity 
                    className="mt-4 bg-slate-700 p-2 rounded"
                    onPress={async () => {
                        await database.write(async () => {
                             await database.get<WorkOrder>('work_orders').create(wo => {
                                 wo.title = 'WTG-084: Blade Inspection'
                                 wo.subtitle = 'Sector A • Offshore'
                                 wo.priority = 'High'
                                 wo.assetId = 'Turbine A42'
                                 wo.status = 'In Progress'
                             })
                             await database.get<WorkOrder>('work_orders').create(wo => {
                                 wo.title = 'Gearbox Maintenance'
                                 wo.subtitle = 'Sector B • Onshore'
                                 wo.priority = 'Normal'
                                 wo.assetId = 'Turbine B12'
                                 wo.status = 'Pending'
                             })
                        })
                    }}
                 >
                    <Text className="text-white">Seed Data</Text>
                 </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const enhance = withObservables([], () => ({
  workOrders: database.get<WorkOrder>('work_orders').query(),
}));

export default enhance(EngineerDashboard);
