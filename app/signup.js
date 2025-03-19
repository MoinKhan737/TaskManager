import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Dimensions, ImageBackground, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'


const API_URl = "https://taskmanagerbackend-2iqo.onrender.com"

const Signup = () => {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
            setScreenHeight(window.height);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    const calculateWidth = (percentage) => {
        return (percentage * screenWidth) / 100;
    };

    const calculateHeight = (percentage) => {
        return (percentage * screenHeight) / 100;
    };
    const router = useRouter();


    const handleSignup = async () => {
        if (!userName || !email || !password) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(API_URl + "/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: userName, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                ToastAndroid.show(JSON.stringify(data.message), ToastAndroid.SHORT);
                router.replace("/login");
            } else {
                Alert.alert("Error", data.error);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Try again later.");
        }
        setIsLoading(false);
    };


    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground source={require('@/assets/images/login_bg.jpg')} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} resizeMode="cover">
                <View style={{ backgroundColor: 'black', padding: 15, borderRadius: 10, marginTop: 30 }}>
                    <Text style={{ alignItems: 'center', textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white' }}>Sign Up</Text>

                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="grey"
                        style={{ borderWidth: 1, borderRadius: 10, width: calculateWidth(70), backgroundColor: 'white', marginTop: 10, paddingStart: 10, color: 'black' }}
                        value={userName}
                        onChangeText={setUserName}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="grey"
                        style={{ borderWidth: 1, borderRadius: 10, width: calculateWidth(70), backgroundColor: 'white', marginTop: 10, paddingStart: 10, color: 'black' }}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={{ alignItems: 'center', flexDirection: 'row', borderWidth: 1, backgroundColor: 'white', marginTop: 14, borderRadius: 10 }}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="grey"
                            style={{ width: calculateWidth(62), paddingStart: 10, color: 'black', marginBottom: 5 }}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={isPasswordHidden}
                        />
                        <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)} style={{ alignItems: 'center' }}>
                            <FontAwesome name={!isPasswordHidden ? "eye" : "eye-slash"} size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', flexDirection: 'row', borderWidth: 1, backgroundColor: 'white', marginTop: 14, borderRadius: 10 }}>
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="grey"
                            style={{ width: calculateWidth(62), paddingStart: 10, color: 'black', marginBottom: 5 }}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={isConfirmPasswordHidden}
                        />
                        <TouchableOpacity onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)} style={{ alignItems: 'center' }}>
                            <FontAwesome name={!isConfirmPasswordHidden ? "eye" : "eye-slash"} size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => handleSignup()}
                    style={{ marginTop: 20, backgroundColor: 'black', width: calculateWidth(78), borderRadius: 10, alignItems: 'center', padding: 10 }} disabled={isLoading}>
                    {isLoading && <ActivityIndicator style={{ position: 'absolute', marginTop: 5 }} size={30} color="white" />}
                    <Text style={{ textAlign: 'center', fontSize: 18, color: 'white' }}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10, backgroundColor: 'black', padding: 10, borderRadius: 10 }}>
                    <Text style={{ alignItems: 'flex-end', textAlign: 'center', fontSize: 16, color: 'white', width: calculateWidth(50) }}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default Signup