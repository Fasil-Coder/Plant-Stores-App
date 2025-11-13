import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const newErrors = {};

    const usernameRegex = /^[A-Za-z0-9_]{3,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!usernameRegex.test(username)) {
      newErrors.username =
        'At least 3 chars, only letters, numbers, or underscores';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        'At least 6 chars, include uppercase, lowercase, and a number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push('/Home');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1508780709619-79562169bc64',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          {/* Username */}
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' }); // clear error while typing
            }}
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}

          {/* Password */}
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' }); // clear error while typing
            }}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* Links */}
          <TouchableOpacity>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.link}>Create a New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#ffffffcc',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 13,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#4e9af1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  link: {
    color: '#2e86de',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15,
    marginTop: 5,
  },
});
