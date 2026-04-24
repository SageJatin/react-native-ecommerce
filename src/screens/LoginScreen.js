import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in when the screen loads
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Replace current screen so user can't swipe back to Login
        navigation.replace('Home');
      }
    };
    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        // Using .trim() kills any invisible spaces added by the mobile keyboard
        username: username.trim(),
        password: password.trim(),
      });

      // Save token to device storage
      await AsyncStorage.setItem('token', response.data.accessToken);
      
      // Navigate to the main app tabs
      navigation.replace('Home');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // This hides the password characters
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#121212', // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a84ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff453a',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});

export default LoginScreen;