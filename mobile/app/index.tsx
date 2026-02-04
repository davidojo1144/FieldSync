import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import database from '../src/db';
import Project from '../src/db/models/Project';
import { syncData } from '../src/db/sync';
import { Link, useRouter } from 'expo-router';

const ProjectItem = ({ project }: { project: Project }) => (
  <Link href={`/project/${project.id}`} asChild>
    <TouchableOpacity className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800">{project.name}</Text>
      <Text className="text-gray-500 mt-1">{project.description || 'No description'}</Text>
    </TouchableOpacity>
  </Link>
);

const enhance = withObservables([], () => ({
  projects: database.get<Project>('projects').query(),
}));

const ProjectList = enhance(({ projects }: { projects: Project[] }) => {
  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ProjectItem project={item} />}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text className="text-center text-gray-400 mt-10">No projects yet. Create one!</Text>
      }
    />
  );
});

export default function Home() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      alert('Sync successful!');
    } catch (error) {
      alert(`Sync failed: ${error}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 border-b border-gray-200 bg-white flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">Projects</Text>
        <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
          <Text className="text-blue-600 font-medium">{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
        </TouchableOpacity>
      </View>
      
      <ProjectList />

      <View className="p-4">
        <Link href="/create-project" asChild>
          <TouchableOpacity className="bg-blue-600 p-4 rounded-xl items-center shadow-lg">
            <Text className="text-white font-bold text-lg">Create New Project</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
