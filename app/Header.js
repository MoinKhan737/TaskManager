import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Header = ({ onAddTask }) => {

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("authToken");
            router.replace("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#8E44AD",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            }}
        >
            <TouchableOpacity onPress={onAddTask} style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="plus-circle" size={22} color="white" />
                <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>Add Task</Text>
            </TouchableOpacity>

            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Task Manager</Text>

            <TouchableOpacity onPress={() => logout()} style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="sign-out" size={22} color="white" />
                <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Header;
