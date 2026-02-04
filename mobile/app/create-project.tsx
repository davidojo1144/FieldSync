import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import database from '../src/db';
import Project from '../src/db/models/Project';

export default function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) return;

    await database.write(async () => {
      await database.get<Project>('projects').create(project => {
        project.name = name;
        project.description = description;
      });
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">New Project</Text>
        
        <Text className="text-sm font-medium text-gray-700 mb-2">Project Name</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-lg mb-4"
          placeholder="e.g. Site A Inspection"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-lg mb-6 h-32"
          placeholder="Optional description..."
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity 
          className={`p-4 rounded-xl items-center ${name.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text className="text-white font-bold text-lg">Create Project</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="p-4 items-center mt-2"
          onPress={() => router.back()}
        >
          <Text className="text-gray-500 font-medium">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
