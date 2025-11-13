import React, { useRef, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function StylishLogin() {
  const navigation = useNavigation();
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date());
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [number1, setNumber1] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    number: '',
    number1: '',
    gender: '',
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 1,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Username is required';
    else if (!/^[A-Za-z0-9_]{3,}$/.test(username))
      newErrors.username = 'Please enter a valid Username';

    if (!number.trim()) newErrors.number = 'DOB is required';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(number))
      newErrors.number = 'Please enter a valid DOB (dd/mm/yyyy)';

    if (!gender.trim()) newErrors.gender = 'Please select a Gender';

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email))
      newErrors.email = 'Please enter a valid Email';

    if (!number1.trim()) newErrors.number1 = 'Mobile Number is required';
    else if (!/^\d{10}$/.test(number1))
      newErrors.number1 = 'Please enter a valid Mobile Number';

    if (!password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigation.navigate('Home');
    }
  };

  return (
    <ImageBackground
      source={{
      uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', // 🍲 Light food background
      }}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <Text style={styles.title}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>Login to continue</Text>

              {/* Username */}
              <View style={{ width: '100%' }}>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Username"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={(t) => {
                    setUsername(t);
                    setErrors({ ...errors, username: '' });
                  }}
                />
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>

              {/* DOB */}
              <View style={{ width: '100%' }}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    style={[styles.input, errors.number && styles.inputError]}
                    placeholder="DOB (dd/mm/yyyy)"
                    placeholderTextColor="#666"
                    value={number}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>

                {errors.number && (
                  <Text style={styles.errorText}>{errors.number}</Text>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={dobDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        const d = selectedDate;
                        const formatted = `${d
                          .getDate()
                          .toString()
                          .padStart(2, '0')}/${(d.getMonth() + 1)
                          .toString()
                          .padStart(2, '0')}/${d.getFullYear()}`;
                        setNumber(formatted);
                        setDobDate(selectedDate);
                        setErrors({ ...errors, number: '' });
                      }
                      setShowDatePicker(false);
                    }}
                  />
                )}
              </View>

              {/* Gender */}
              <View style={{ width: '100%' }}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    errors.gender && styles.inputError,
                    { justifyContent: 'center' },
                  ]}
                  onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <Text style={{ color: gender ? '#000' : '#666' }}>
                    {gender || 'Select Gender'}
                  </Text>
                </TouchableOpacity>
                {showGenderDropdown && (
                  <View style={styles.dropdownList}>
                    {['Male', 'Female', 'Other'].map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setGender(item);
                          setShowGenderDropdown(false);
                          setErrors({ ...errors, gender: '' });
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}
              </View>

              {/* Email */}
              <View style={{ width: '100%' }}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErrors({ ...errors, email: '' });
                  }}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Mobile */}
              <View style={{ width: '100%' }}>
                <TextInput
                  style={[styles.input, errors.number1 && styles.inputError]}
                  placeholder="Mobile Number"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  value={number1}
                  onChangeText={(t) => {
                    setNumber1(t);
                    setErrors({ ...errors, number1: '' });
                  }}
                />
                {errors.number1 && (
                  <Text style={styles.errorText}>{errors.number1}</Text>
                )}
              </View>

              {/* Password */}
              <View style={{ width: '100%' }}>
                <View
                  style={[
                    styles.passwordContainer,
                    errors.password && styles.inputError,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      setErrors({ ...errors, password: '' });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={{ color: '#007AFF', fontSize: 16 }}>
                      {showPassword ? '🙈' : '👁'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Button */}
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // light transparent layer for readability
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  card: {
    width: '85%',
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: { fontSize: 28, fontWeight: '700', color: '#000', textAlign: 'center' },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: '#000',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    paddingRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: { flex: 1, color: '#000', padding: 12 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginLeft: 4, marginBottom: 5 },
  eyeButton: { paddingHorizontal: 6 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
