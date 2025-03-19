import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ToastAndroid } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Card, Title } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioButtons from "./RadioButtons";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const API_URl = "https://taskmanagerbackend-2iqo.onrender.com"

export default function CreateTask(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('Created');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const priorityType = ['Low', 'Medium', 'High']
    const StatusType = ['Created', 'In Progress', 'Completed']

    const router = useRouter();

    useEffect(() => {
        if (props.display === "Edit") {
            setTitle(props?.data?.title || "")
            setDescription(props?.data?.description || "")
            setPriority(props?.data?.priority || "")
            setStatus(props?.data?.status || "")
            setDueDate(new Date(props?.data?.dueDate) || new Date())
        }
        else {
            clearState()
        }
    }, [props.display])

    const handleCreateTask = async () => {
        if (!title || !description || !dueDate) {
            return ToastAndroid.show("Fill all the details", ToastAndroid.SHORT)
        }
        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(API_URl + "/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    priority: priority,
                    dueDate: dueDate,
                    completed: false,
                    status: status,
                    username: props.user.username,
                    userId: props.user.id,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                ToastAndroid.show("Task created successfully!", ToastAndroid.SHORT);
                props.closeCreateTask(false)
                clearState()
            } else {
                console.error("Create Task Error:", data.error);
                Alert.alert("Error", data.error || "Task creation failed");
            }
        } catch (error) {
            console.error("Create Task Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
        finally {
            setIsLoading(false)
        }
    };

    const handleUpdateTask = async (taskId) => {
        if (!title || !description || !dueDate) {
            return ToastAndroid.show("Fill all the details", ToastAndroid.SHORT)
        }
        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(API_URl + `/tasks/update/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    priority: priority,
                    dueDate: dueDate,
                    completed: false,
                    status: status,
                    username: props.user.username,
                    userId: props.user.id,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                ToastAndroid.show("Task updated successfully", ToastAndroid.SHORT);
                props.closeCreateTask(false)
                clearState()
            } else {
                Alert.alert("Error", data.error || "Failed to update task");
            }
        } catch (error) {
            console.error("Update Task Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
        finally {
            setIsLoading(false)
        }
    };

    const clearState = () => {

        setTitle("")
        setDescription("")
        setPriority("Low")
        setStatus("Created")
        setDueDate(new Date())
    }


    return (
        <Modal
            visible={props.display !== "none"}
            transparent={true}
            onRequestClose={() => props.closeCreateTask(false)}
            animationType="fade"
        >
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}>
                <View style={{
                    alignItems: "center",
                    backgroundColor: "white",
                    width: "94%",
                    padding: 20,
                    borderRadius: 20
                }}>
                    <View style={{
                        width: "94%",
                    }}>
                        <View style={{
                            alignItems: "center",
                            flexDirection: "row",
                            marginBottom: 10,
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', alignItems: "center", textAlign: "center", width: "95%" }}>{props.display === "Edit" ? "Update Task" : "Create Task"}</Text>
                            <TouchableOpacity onPress={() => props.closeCreateTask(false)}>
                                <FontAwesome name="times-circle" size={30} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Title</Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                padding: 12,
                                borderRadius: 8,
                                fontSize: 16,
                                marginBottom: 15,
                                borderWidth: 1,
                            }}
                            placeholder="Enter task title"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Description</Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                padding: 12,
                                borderRadius: 8,
                                fontSize: 16,
                                marginBottom: 15,
                                borderWidth: 1,
                                height: "20%",
                                textAlignVertical: "top"
                            }}
                            placeholder="Enter task description"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Priority</Text>

                        <View style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            {priorityType.map((rec, index) => <RadioButtons key={index} lable={rec} value={priority} setValue={(newText) => setPriority(newText)} />)}
                        </View>

                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Due Date</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{
                            backgroundColor: 'white',
                            padding: 12,
                            borderRadius: 8,
                            fontSize: 16,
                            marginBottom: 15,
                            borderWidth: 1,
                            alignItems: 'center',
                            marginTop: 10
                        }}>
                            <Text style={{ color: "black" }}>{dueDate.toDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setDueDate(selectedDate);
                                }}
                            />
                        )}
                        <Text style={{ fontSize: 16, marginBottom: 5 }}>Status</Text>



                        <View style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            {StatusType.map((rec, index) => <RadioButtons key={index} lable={rec} value={status} setValue={(newText) => setStatus(newText)} />)}
                        </View>

                        <TouchableOpacity style={{
                            backgroundColor: isLoading ? "grey" : '#8E44AD',
                            padding: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                            onPress={() => { props.display === "Edit" ? handleUpdateTask(props.data._id) : handleCreateTask() }}
                            disabled={isLoading}
                        >
                            {isLoading && <ActivityIndicator color="white" size={25} style={{ position: "absolute", marginTop: 12 }} />}
                            <Text style={{
                                color: 'white',
                                fontSize: 18,
                                fontWeight: 'bold'
                            }}>
                                {isLoading && props.display === "Edit" ? "Updating..." : props.display === "Edit" ? "Update Task" : isLoading && props.display === "Add" ? "Creating...." : "Create Task"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    );
};
