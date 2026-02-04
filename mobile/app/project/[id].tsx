import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import database from '../../src/db';
import Project from '../../src/db/models/Project';
import Task from '../../src/db/models/Task';

const TaskItem = ({ task, onToggleStatus }: { task: Task, onToggleStatus: (task: Task) => void }) => (
  <TouchableOpacity 
    className={`flex-row items-center p-4 mb-2 rounded-lg border ${task.status === 'done' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
    onPress={() => onToggleStatus(task)}
  >
    <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center ${task.status === 'done' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
      {task.status === 'done' && <Text className="text-white text-xs">✓</Text>}
    </View>
    <Text className={`text-lg ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
      {task.title}
    </Text>
  </TouchableOpacity>
);

const enhance = withObservables(['projectId'], ({ projectId }) => ({
  project: database.get<Project>('projects').findAndObserve(projectId),
  tasks: database.get<Project>('projects').findAndObserve(projectId).pipe(
    // @ts-ignore
    (project) => project.tasks.observe()
  ),
}));

const ProjectDetails = enhance(({ project, tasks }: { project: Project, tasks: Task[] }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const router = useRouter();

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    await database.write(async () => {
      await database.get<Task>('tasks').create(task => {
        task.title = newTaskTitle;
        task.status = 'todo';
        task.project.set(project);
      });
    });
    setNewTaskTitle('');
  };

  const toggleTaskStatus = async (task: Task) => {
    await database.write(async () => {
      await task.update(t => {
        t.status = t.status === 'done' ? 'todo' : 'done';
      });
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-blue-600 text-lg">← Back</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">{project.name}</Text>
          {project.description && <Text className="text-sm text-gray-500">{project.description}</Text>}
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} onToggleStatus={toggleTaskStatus} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-lg">No tasks yet.</Text>
            <Text className="text-gray-400 text-sm">Add one below!</Text>
          </View>
        }
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="p-4 bg-white border-t border-gray-200"
      >
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg p-3 mr-3 text-lg"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity 
            className={`p-3 rounded-lg ${newTaskTitle.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
            onPress={handleAddTask}
            disabled={!newTaskTitle.trim()}
          >
            <Text className="text-white font-bold">Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  
  if (!id || typeof id !== 'string') return <Text>Invalid Project ID</Text>;

  return <ProjectDetails projectId={id} />;
}
