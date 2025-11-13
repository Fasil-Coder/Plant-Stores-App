import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router'; // 👈 added for navigation

export default function UnitConverterScreen() {
  const router = useRouter(); // 👈 added for navigation

  const [category, setCategory] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');

  // Units for each category
  const units = {
    length: ['meters', 'kilometers', 'centimeters', 'feet', 'inches', 'miles'],
    weight: ['kilograms', 'grams', 'pounds'],
    temperature: ['celsius', 'fahrenheit'],
  };

  // Main convert function
  const convert = () => {
    if (!category) {
      setResult('⚠️ Please select a category');
      return;
    }
    if (!fromUnit || !toUnit) {
      setResult('⚠️ Please select both From and To units');
      return;
    }
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('⚠️ Please enter a valid number');
      return;
    }

    let output;
    switch (category) {
      case 'length':
        output = convertLength(value, fromUnit, toUnit);
        break;
      case 'weight':
        output = convertWeight(value, fromUnit, toUnit);
        break;
      case 'temperature':
        output = convertTemperature(value, fromUnit, toUnit);
        break;
      default:
        output = value;
    }

    setResult(`${value} ${fromUnit} = ${output} ${toUnit}`);
  };

  // LENGTH converter
  const convertLength = (value, from, to) => {
    let meters;
    switch (from) {
      case 'meters': meters = value; break;
      case 'kilometers': meters = value * 1000; break;
      case 'centimeters': meters = value / 100; break;
      case 'feet': meters = value * 0.3048; break;
      case 'inches': meters = value * 0.0254; break;
      case 'miles': meters = value * 1609.34; break;
      default: meters = value;
    }

    switch (to) {
      case 'meters': return meters.toFixed(4);
      case 'kilometers': return (meters / 1000).toFixed(4);
      case 'centimeters': return (meters * 100).toFixed(4);
      case 'feet': return (meters / 0.3048).toFixed(4);
      case 'inches': return (meters / 0.0254).toFixed(4);
      case 'miles': return (meters / 1609.34).toFixed(4);
      default: return meters.toFixed(4);
    }
  };

  // WEIGHT converter
  const convertWeight = (value, from, to) => {
    let kg;
    switch (from) {
      case 'kilograms': kg = value; break;
      case 'grams': kg = value / 1000; break;
      case 'pounds': kg = value * 0.453592; break;
      default: kg = value;
    }

    switch (to) {
      case 'kilograms': return kg.toFixed(4);
      case 'grams': return (kg * 1000).toFixed(4);
      case 'pounds': return (kg / 0.453592).toFixed(4);
      default: return kg.toFixed(4);
    }
  };

  // TEMPERATURE converter
  const convertTemperature = (value, from, to) => {
    let res;
    if (from === 'celsius' && to === 'fahrenheit') res = value * 1.8 + 32;
    else if (from === 'fahrenheit' && to === 'celsius') res = (value - 32) / 1.8;
    else res = value;
    return res.toFixed(2);
  };

  const onCategoryChange = (val) => {
    setCategory(val);
    setFromUnit('');
    setToUnit('');
    setResult('');
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Unit Converter</Text>

          {/* Category Picker */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={onCategoryChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Length" value="length" />
              <Picker.Item label="Weight" value="weight" />
              <Picker.Item label="Temperature" value="temperature" />
            </Picker>
          </View>

          {/* Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
          />

          {/* FROM Picker */}
          <Text style={styles.label}>From</Text>
          <View style={[styles.pickerContainer, !category && styles.disabledPicker]}>
            <Picker
              selectedValue={fromUnit}
              onValueChange={(v) => setFromUnit(v)}
              style={styles.picker}
              enabled={!!category}
            >
              {!category && <Picker.Item label="Select category first" value="" />}
              {category && <Picker.Item label="Select From Unit" value="" />}
              {category &&
                units[category].map((u) => (
                  <Picker.Item key={u} label={u} value={u} />
                ))}
            </Picker>
          </View>

          {/* TO Picker */}
          <Text style={styles.label}>To</Text>
          <View style={[styles.pickerContainer, !category && styles.disabledPicker]}>
            <Picker
              selectedValue={toUnit}
              onValueChange={(v) => setToUnit(v)}
              style={styles.picker}
              enabled={!!category}
            >
              {!category && <Picker.Item label="Select category first" value="" />}
              {category && <Picker.Item label="Select To Unit" value="" />}
              {category &&
                units[category].map((u) => (
                  <Picker.Item key={u} label={u} value={u} />
                ))}
            </Picker>
          </View>

          {/* Convert Button */}
          <TouchableOpacity style={styles.convertButton} onPress={convert}>
            <Text style={styles.convertText}>Convert</Text>
          </TouchableOpacity>

          {/* Result */}
          {result !== '' && <Text style={styles.result}>{result}</Text>}

          {/* ✅ Go Back Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#4e9af1',
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={() => router.push('/')} // 👈 goes back to Login page
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// STYLES
const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#ffffffcc',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 8,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  disabledPicker: {
    opacity: 0.6,
  },
  picker: {
    height: 53,
  },
  convertButton: {
    backgroundColor: '#4e9af1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  convertText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  result: { textAlign: 'center', fontSize: 16, color: '#000', marginTop: 10 },
  backLink: {
    color: '#2e86de',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15,
    marginTop: 12,
  },
});
