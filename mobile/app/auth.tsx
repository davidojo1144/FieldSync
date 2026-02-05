import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../context/ToastContext';
import baseUrl from '../src/config/api';

export default function AuthScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    const endpoint = isLogin ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`;
    const body = isLogin 
      ? { email, password }
      : { first_name: firstName, last_name: lastName, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // TODO: Store token securely
        showToast(isLogin ? 'Logged in successfully' : 'Registered successfully', 'success');
        router.replace('/dashboard');
      } else {
        showToast(data.error || 'Authentication failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network request failed. Ensure backend is running.', 'error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f8f7] dark:bg-[#10221c]">
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
            {/* Header */}
            <View className="items-center pt-8 pb-8">
                <View className="bg-[#13eca4]/20 p-4 rounded-xl border border-[#13eca4]/30 mb-6">
                    <MaterialIcons name="shield" size={48} color="#13eca4" />
                </View>
                <Text className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white">Secure Access</Text>
                <Text className="text-slate-500 dark:text-[#13eca4]/60 text-sm mt-2 text-center">Offline-First ERP Protocol v2.4</Text>
            </View>

            {/* Toggle */}
            <View className="bg-slate-200 dark:bg-[#10221c]/80 border border-slate-300 dark:border-[#13eca4]/20 p-1 rounded-xl flex-row mb-8">
                <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${isLogin ? 'bg-white dark:bg-[#13eca4]' : ''}`}
                    onPress={() => setIsLogin(true)}
                >
                    <Text className={`text-sm font-semibold ${isLogin ? 'text-slate-900 dark:text-[#10221c]' : 'text-slate-500 dark:text-[#13eca4]/50'}`}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${!isLogin ? 'bg-white dark:bg-[#13eca4]' : ''}`}
                    onPress={() => setIsLogin(false)}
                >
                    <Text className={`text-sm font-semibold ${!isLogin ? 'text-slate-900 dark:text-[#10221c]' : 'text-slate-500 dark:text-[#13eca4]/50'}`}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            {/* Fields */}
            <View className="gap-4">
                {!isLogin && (
                    <>
                        <View className="flex-col gap-2">
                            <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#13eca4]/60 px-1">First Name</Text>
                            <View className="relative justify-center">
                                <MaterialIcons name="person" size={20} color="#13eca4" style={{ position: 'absolute', left: 16, zIndex: 10, opacity: 0.4 }} />
                                <TextInput 
                                    className="w-full bg-white dark:bg-[#10221c] border border-slate-300 dark:border-[#13eca4]/30 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-[#13eca4]"
                                    placeholder="John"
                                    placeholderTextColor="#666"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>
                        </View>
                        <View className="flex-col gap-2">
                            <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#13eca4]/60 px-1">Last Name</Text>
                            <View className="relative justify-center">
                                <MaterialIcons name="person" size={20} color="#13eca4" style={{ position: 'absolute', left: 16, zIndex: 10, opacity: 0.4 }} />
                                <TextInput 
                                    className="w-full bg-white dark:bg-[#10221c] border border-slate-300 dark:border-[#13eca4]/30 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-[#13eca4]"
                                    placeholder="Doe"
                                    placeholderTextColor="#666"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>
                    </>
                )}

                <View className="flex-col gap-2">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#13eca4]/60 px-1">Email</Text>
                    <View className="relative justify-center">
                        <MaterialIcons name="email" size={20} color="#13eca4" style={{ position: 'absolute', left: 16, zIndex: 10, opacity: 0.4 }} />
                        <TextInput 
                            className="w-full bg-white dark:bg-[#10221c] border border-slate-300 dark:border-[#13eca4]/30 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-[#13eca4]"
                            placeholder="john@example.com"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View className="flex-col gap-2">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#13eca4]/60 px-1">Password</Text>
                    <View className="relative justify-center">
                        <MaterialIcons name="vpn-key" size={20} color="#13eca4" style={{ position: 'absolute', left: 16, zIndex: 10, opacity: 0.4 }} />
                        <TextInput 
                            className="w-full bg-white dark:bg-[#10221c] border border-slate-300 dark:border-[#13eca4]/30 rounded-xl py-4 pl-12 pr-12 text-slate-900 dark:text-white focus:border-[#13eca4]"
                            placeholder="••••••••"
                            placeholderTextColor="#666"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: 16 }}
                        >
                            <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color="#13eca4" style={{ opacity: 0.4 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Button */}
            <View className="mt-10">
                <TouchableOpacity 
                    className="w-full bg-[#13eca4] py-5 rounded-xl flex-row items-center justify-center gap-2 shadow-lg"
                    onPress={handleAuth}
                >
                    <Text className="text-[#10221c] font-bold text-lg">{isLogin ? 'Authorize Device' : 'Create Account'}</Text>
                    <MaterialIcons name="verified-user" size={20} color="#10221c" />
                </TouchableOpacity>
                
                <View className="flex-row items-center justify-between mt-6 px-1">
                    <View className="flex-row items-center gap-2">
                        <MaterialIcons name="cloud-queue" size={16} color="#64748b" />
                        <Text className="text-xs text-slate-500 dark:text-[#13eca4]/40">CRDT Sync Enabled</Text>
                    </View>
                    <TouchableOpacity>
                        <Text className="text-xs font-semibold text-[#13eca4]/80">Forgot Credentials?</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    </SafeAreaView>
  );
}
