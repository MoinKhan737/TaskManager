import React, { useState, useEffect } from "react";
import { Slot, useRouter, useSegments, useRootNavigationState } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!navigationState?.key || isAuthenticated === null) return;

    console.log("Auth State:", isAuthenticated);

    if (!isAuthenticated && segments[0] !== "login" && segments[0] !== "signup") {
      router.replace("/login");
    } else if (isAuthenticated && (segments[0] === "login" || segments[0] === "signup")) {
      router.replace("/");
    }
  }, [navigationState?.key, isAuthenticated]);

  return <Slot />;
}


