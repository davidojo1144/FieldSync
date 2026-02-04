import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withObservables } from '@nozbe/watermelondb/react';
import database from '../src/db';
import WorkOrder from '../src/db/models/WorkOrder';
import ChecklistItem from '../src/db/models/ChecklistItem';

const ChecklistItemRow = ({ item, onPress }: { item: ChecklistItem, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className={`flex-row items-center gap-4 bg-white/5 px-4 py-3 rounded-lg border border-white/5 ${item.isCompleted ? 'opacity-60' : ''}`}>
    <View className={`size-6 items-center justify-center rounded ${item.isCompleted ? 'bg-primary' : 'border-2 border-primary'}`}>
      {item.isCompleted && <Text className="text-background-dark font-bold">✓</Text>}
    </View>
    <View>
      <Text className={`text-white text-sm font-medium ${item.isCompleted ? 'line-through' : ''}`}>{item.title}</Text>
      {item.requirements && <Text className="text-primary text-xs">{item.requirements}</Text>}
    </View>
  </TouchableOpacity>
);

function TicketDetails({ workOrder, checklistItems }: { workOrder: WorkOrder, checklistItems: ChecklistItem[] }) {
  const router = useRouter();

  if (!workOrder) {
      return (
        <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
            <Text className="text-white">Loading...</Text>
        </SafeAreaView>
      )
  }

  const completedCount = checklistItems.filter(i => i.isCompleted).length;
  const totalCount = checklistItems.length;

  const toggleItem = async (item: ChecklistItem) => {
      await database.write(async () => {
          await item.update(i => {
              i.isCompleted = !i.isCompleted;
          })
      })
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-white/10 bg-background-dark/80">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-lg">{'<'}</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-white text-lg font-bold">Ticket #W-{workOrder.id.slice(0, 4)}</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="size-2 rounded-full bg-primary" />
              <Text className="text-[10px] uppercase tracking-widest text-primary font-bold">Local Peer Sync Active</Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="bg-primary/10 border border-primary/20 px-2 py-1 rounded flex-row items-center gap-1">
            <Text className="text-primary text-[11px] font-bold">v2.4.1</Text>
          </View>
          <TouchableOpacity className="size-10 items-center justify-center rounded-lg bg-white/5">
            <Text className="text-white">:</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Asset Profile */}
        <View className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <View className="flex-row gap-4">
            <View className="size-24 rounded-lg bg-slate-700 border border-white/10" />
            <View className="flex-1 justify-center">
              <Text className="text-white text-xl font-bold leading-tight mb-1">{workOrder.title}</Text>
              <Text className="text-primary text-sm font-medium mb-2">{workOrder.subtitle}</Text>
              <View className="flex-row gap-2">
                <View className={`px-2 py-0.5 rounded border ${workOrder.priority === 'High' ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/10'}`}>
                  <Text className={`${workOrder.priority === 'High' ? 'text-red-400' : 'text-slate-400'} text-[10px] font-bold uppercase`}>Priority: {workOrder.priority}</Text>
                </View>
                <View className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase">Offline-Ready</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tech Specs */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-1 pb-3">
            <Text className="text-white text-sm font-bold uppercase tracking-widest opacity-60">Technical Specifications</Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-white/5 border border-white/10 p-3 rounded-lg w-[48%]">
              <Text className="text-[10px] text-slate-400 uppercase font-bold mb-1">Asset ID</Text>
              <Text className="text-white font-mono text-sm">{workOrder.assetId}</Text>
            </View>
            <View className="bg-white/5 border border-white/10 p-3 rounded-lg w-[48%]">
              <Text className="text-[10px] text-slate-400 uppercase font-bold mb-1">Blade Pitch</Text>
              <Text className="text-primary font-mono text-sm">12.45° <Text className="text-[10px] text-slate-500">NOMINAL</Text></Text>
            </View>
            <View className="bg-white/5 border border-white/10 p-3 rounded-lg w-[48%]">
              <Text className="text-[10px] text-slate-400 uppercase font-bold mb-1">Gearbox Temp</Text>
              <Text className="text-white font-mono text-sm">64.2°C</Text>
            </View>
            <View className="bg-white/5 border border-white/10 p-3 rounded-lg w-[48%]">
              <Text className="text-[10px] text-slate-400 uppercase font-bold mb-1">Hydraulic PSI</Text>
              <Text className="text-white font-mono text-sm">2,450 PSI</Text>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View className="mb-24">
          <View className="flex-row items-center justify-between px-1 pb-3">
            <Text className="text-white text-sm font-bold uppercase tracking-widest opacity-60">Repair Checklist</Text>
            <Text className="text-primary text-xs font-bold">{completedCount}/{totalCount} Complete</Text>
          </View>
          
          <View className="gap-2">
            {checklistItems.map(item => (
                <ChecklistItemRow key={item.id} item={item} onPress={() => toggleItem(item)} />
            ))}
            
            {checklistItems.length === 0 && (
                 <TouchableOpacity 
                    className="p-4 bg-slate-800 rounded-lg items-center border border-dashed border-slate-600"
                    onPress={async () => {
                         await database.write(async () => {
                             await database.get<ChecklistItem>('checklist_items').create(item => {
                                 item.workOrder.set(workOrder)
                                 item.title = 'Secure LOTO Procedures'
                                 item.isCompleted = false
                                 item.requirements = 'Verify lock placement'
                             })
                             await database.get<ChecklistItem>('checklist_items').create(item => {
                                 item.workOrder.set(workOrder)
                                 item.title = 'Inspect Blade Root Bolts'
                                 item.isCompleted = false
                                 item.requirements = 'Torque check: 400Nm required'
                             })
                         })
                    }}
                 >
                    <Text className="text-slate-400">Add Standard Checklist</Text>
                 </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const enhance = withObservables(['workOrder'], ({ workOrder }) => ({
  workOrder,
  checklistItems: workOrder.checklistItems,
}));

const EnhancedTicketDetails = enhance(TicketDetails);

const TicketDetailsLoader = withObservables(['id'], ({ id }) => ({
    workOrder: database.get<WorkOrder>('work_orders').findAndObserve(id),
}))(EnhancedTicketDetails);

export default function TicketDetailsRoute() {
    const { id } = useLocalSearchParams();
    const workOrderId = Array.isArray(id) ? id[0] : id;
    
    if (!workOrderId) {
        return (
             <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
                <Text className="text-white">Error: No Work Order ID</Text>
            </SafeAreaView>
        );
    }

    return <TicketDetailsLoader id={workOrderId} />;
}
