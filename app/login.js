import { useNavigation, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { Alert, SafeAreaView, ToastAndroid, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const API_URl = "https://taskmanagerbackend-2iqo.onrender.com"

const Login = () => {
    const router = useRouter();
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const [hidePassword, setHidePassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
            setScreenWidth(window.width);
            setScreenHeight(window.height);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    const calculateWidthInVw = (percentage) => {
        return (percentage * screenWidth) / 100;
    };

    const calculateHeightInVh = (percentage) => {
        return (percentage * screenHeight) / 100;
    };

    const handleLogin = async () => {
        if (!email || !password) return ToastAndroid.show("Fill all the details", ToastAndroid.SHORT)
        setLoading(true)
        try {
            const response = await fetch(API_URl + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("authToken", data.token);
                await AsyncStorage.setItem("user", JSON.stringify(data.user))
                router.replace("/");
            } else {
                Alert.alert("Login Failed", data.error || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <SafeAreaView style={{
            flex: 1,
        }}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ImageBackground source={require('@/assets/images/login_bg.jpg')} style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }} resizeMode='cover'>
                    <View style={{ backgroundColor: 'black', padding: 15, borderRadius: 10, marginTop: 30 }}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", color: "white" }}>LogIn</Text>

                        <TextInput
                            placeholder='Email/Username'
                            placeholderTextColor="grey"
                            style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                width: calculateWidthInVw(70),
                                backgroundColor: "white",
                                marginTop: 10,
                                paddingStart: 10,
                                color: "black",
                            }}
                            value={email}
                            onChangeText={(newText) => setEmail(newText)}
                        />

                        <View style={{
                            alignItems: "center",
                            flexDirection: "row",
                            borderWidth: 1,
                            backgroundColor: "white",
                            marginTop: 14,
                            borderRadius: 10,
                        }}>
                            <TextInput
                                placeholder='Password'
                                placeholderTextColor="grey"
                                style={{
                                    width: calculateWidthInVw(62),
                                    paddingStart: 10,
                                    color: "black",
                                    marginBottom: 5
                                }}
                                value={password}
                                onChangeText={(newText) => setPassword(newText)}
                                secureTextEntry={hidePassword}
                            />
                            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={{ alignItems: "center" }}>
                                <FontAwesome name={!hidePassword ? "eye" : "eye-slash"} size={20} color='black' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => handleLogin()}
                        style={{
                            marginTop: 20,
                            backgroundColor: 'black',
                            width: calculateWidthInVw(78),
                            borderRadius: 10,
                            alignItems: "center",
                            padding: 10
                        }}
                        disabled={loading}
                    >
                        {loading && <ActivityIndicator style={{ position: "absolute", marginTop: 5 }} size={30} color={"white"} />}
                        <Text style={{ textAlign: "center", fontSize: 18, color: "white" }}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/signup')}
                        style={{ marginTop: 10, backgroundColor: 'black', padding: 10, borderRadius: 10 }}>
                        <Text style={{ textAlign: "center", fontSize: 16, color: "white", width: calculateWidthInVw(50) }}>
                            Don't have an account? Sign up
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        </SafeAreaView>
    )
}

export default Login
