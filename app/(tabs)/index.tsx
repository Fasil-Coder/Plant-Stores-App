import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const VALID_USERNAME = "admin";
  const VALID_PASSWORD = "1234";

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      const flag = await AsyncStorage.getItem("isLoggedIn");
      if (flag === "true") {
        console.log("✅ Already logged in, going directly to explore");
        router.replace("/(tabs)/explore");
        return;
      }
      setLoading(false);
    };
    checkIfAlreadyLoggedIn();
  }, []);

  const handleLogin = async () => {
    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      alert("Invalid username or password!");
      return;
    }
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem(
      "savedCreds",
      JSON.stringify({ username, password })
    );
    router.replace("/(tabs)/explore");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2023/08/07/13/44/tree-8175062_1280.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9aa0a6"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9aa0a6"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  overlay: { flex: 1, backgroundColor: "rgba(14,14,14,0.45)" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "rgba(17,24,39,0.9)", padding: 25, borderRadius: 16 },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(30,41,59,0.8)",
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
    color: "white",
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 15,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
