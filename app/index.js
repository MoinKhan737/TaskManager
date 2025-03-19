import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useRouter
} from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateTask from './CreateTask'
import TaskCard from './TaskCard'
import Header from './Header'

const API_URl = "https://taskmanagerbackend-2iqo.onrender.com"

export default function HomeScreen() {
  const router = useRouter()
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null)
  const [showCreateTask, setShowCreateTask] = useState("none")
  const [selectedTask, setSelectedTask] = useState({})
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    userData()
  }, [])

  const userData = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    console.log(data, 'data')
    setUser(data)
  }

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [showCreateTask, user]);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(API_URl + "/tasks/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        console.log(data, 'data.error')
        Alert.alert("Error", data.error || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={{
      flex: 1
    }} >
      <View>
        <Header onAddTask={() => setShowCreateTask("Add")} />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} />
          }
          renderItem={({ item }) => (
            <TaskCard data={item} editTask={() => { setShowCreateTask("Edit"); setSelectedTask(item) }} onRefresh={() => onRefresh()} />
          )}
        />
      </View>
      <CreateTask display={showCreateTask} closeCreateTask={() => setShowCreateTask("none")} user={user} data={selectedTask} />
    </SafeAreaView>
  );
}
