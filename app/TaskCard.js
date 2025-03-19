import React from "react";
import { View, Text, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URl = "https://taskmanagerbackend-2iqo.onrender.com"

const TaskCard = (props) => {

    const confirmDeleteTask = (taskId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteTask(taskId),
                    style: "destructive",
                },
            ]
        );
    };

    const deleteTask = async (taskId) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(API_URl + `/tasks/delete/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                ToastAndroid.show("Task deleted successfully", ToastAndroid.SHORT);
                props.onRefresh()
            } else {
                Alert.alert("Error", data.error || "Failed to delete task");
                console.error("Delete Task Error:", data.error);
            }
        } catch (error) {
            console.error("Delete Task Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (

        <View
            style={{
                backgroundColor: "#6C3489",
                borderRadius: 12,
                margin: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 5,
                borderWidth: 1,
                borderColor: "#e0e0e0",
            }}
        >
            <View
                style={{
                    padding: 15,
                    borderRadius: 12,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "600", color: "white", marginBottom: 10 }}>
                    {props.data.username || ""}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 15,
                    }}
                >
                    <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
                        {props.data.title || ""}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            onPress={() => props.editTask()}
                            style={{ padding: 8, backgroundColor: "#e8f0fe", borderRadius: 8 }}
                        >
                            <FontAwesome name="edit" size={20} color="#1a73e8" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => confirmDeleteTask(props.data._id)}
                            style={{ marginLeft: 10, padding: 8, backgroundColor: "#fce8e6", borderRadius: 8 }}
                        >
                            <FontAwesome name="trash" size={20} color="#d93025" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={{ fontSize: 16, color: "white", marginBottom: 15, lineHeight: 22 }}>
                    {props.data.description || ""}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="priority-high" size={20} color="#ff9800" />
                        <Text style={{ marginLeft: 5, fontSize: 14, color: "white" }}>
                            Priority: {props.data.priority || ""}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={20} color="#4caf50" />
                        <Text style={{ marginLeft: 5, fontSize: 14, color: "white" }}>
                            Status: {props.data.status || ""}
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Ionicons name="calendar-outline" size={20} color="red" />
                    <Text style={{ marginLeft: 5, fontSize: 14, color: "white" }}>
                        Due: {new Date(props.data.dueDate).toDateString() || ""}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default TaskCard;
