import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import GlowOrb from '../components/GlowOrb';

interface LoginScreenProps {
  onSubmit: () => void;
}

import { API_ENDPOINTS } from '../config/api';

const LoginScreen: React.FC<LoginScreenProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // You could save the token to AsyncStorage here
        onSubmit();
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09140f', overflow: 'hidden' }}>
      {/* Spreaded green lights */}
      <GlowOrb color="#2ea664" size={500} style={{ top: -200, right: -150 }} />
      <GlowOrb color="#1f8a53" size={600} style={{ bottom: -250, left: -250 }} />

      <SafeAreaView style={loginStyles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#09140f" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={loginStyles.kav}>
          <ScrollView
            contentContainerStyle={loginStyles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {/* Logo + Title */}
            <View style={loginStyles.logoBlock}>
              <View style={loginStyles.logoSquare}>
                <Icon name="shield-outline" size={30} color="#7ab89a" />
              </View>
              <Text style={loginStyles.title}>User Login</Text>
              <Text style={loginStyles.subtitle}>User Access Control</Text>
            </View>

            {/* Form Card */}
            <View style={loginStyles.card}>

              {/* Top Divider (Real Gradient) */}
              <LinearGradient
                colors={['rgba(50, 150, 98, 0.1)', 'rgba(50, 150, 98, 0.8)', 'rgba(50, 150, 98, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 1, width: '100%', marginBottom: 16, marginTop: 6 }}
              />

              {/* Email */}
              <Text style={loginStyles.label}>ADMIN EMAIL</Text>
              <View style={[loginStyles.inputRow, emailFocused && loginStyles.inputRowFocused]}>
                <Text style={loginStyles.inputIconAt}>@</Text>
                <TextInput
                  style={loginStyles.input}
                  placeholder="name@security-grid.com"
                  placeholderTextColor="#3a5a48"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>

              {/* Password row label */}
              <View style={loginStyles.passLabelRow}>
                <Text style={loginStyles.label}>PASSWORD</Text>
                <TouchableOpacity>
                  <Text style={loginStyles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Password input */}
              <View style={[loginStyles.inputRow, passFocused && loginStyles.inputRowFocused]}>
                <Icon name="lock-outline" size={18} color="#3a6a50" style={loginStyles.inputIconLeft} />
                <TextInput
                  style={loginStyles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#3a5a48"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(p => !p)}
                  style={loginStyles.eyeBtn}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>

              {/* Authenticate Button */}
              <TouchableOpacity
                style={[loginStyles.authBtn, { overflow: 'hidden', opacity: loading ? 0.7 : 1 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.82}>
                {/* Gradient Background */}
                <LinearGradient
                  colors={['#186641', '#3ab075']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={loginStyles.authBtnText}>
                  {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                </Text>
                {!loading && <Icon name="login" size={18} color="#e0f5ec" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>

              {/* Divider + Security label */}
              <View style={loginStyles.divider} />
              <Text style={loginStyles.securityLabel}>
                System Integrity Level: <Text style={{ color: '#4e8a6a' }}>SECURE</Text>
              </Text>

              {/* Badges */}
              <View style={loginStyles.badgesRow}>
                <View style={loginStyles.badge}>
                  <Icon name="fingerprint" size={26} color="#6a9a80" />
                  <Text style={loginStyles.badgeText}>BIOMETRIC READY</Text>
                </View>
                <View style={loginStyles.badge}>
                  <Icon name="shield-outline" size={24} color="#6a9a80" />
                  <Text style={loginStyles.badgeText}>256-BIT AES</Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <Text style={loginStyles.footer}>
              Proprietary system for authorized{' \n'}personnel only.{' \n'}
              All activities are logged and monitored.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const loginStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 28,
    alignItems: 'center',
  },
  logoBlock: { alignItems: 'center', marginBottom: 32 },
  logoSquare: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#111d18',
    borderWidth: 1,
    borderColor: '#1e3828',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#0c1a14',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3828',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#4e8a6a',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 0,
  },
  passLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  forgotText: { fontSize: 14, color: '#5aa882', fontWeight: '400', marginBottom: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#08120e',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#1e3828',
    paddingHorizontal: 14,
    height: 52,
  },
  inputRowFocused: { borderColor: '#329662' },
  inputIconAt: {
    fontSize: 16,
    color: '#4a7a60',
    marginRight: 10,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    color: '#c8e8d8',
    fontSize: 15,
    paddingVertical: 0,
  },
  inputIconLeft: { marginRight: 10 },
  eyeBtn: { padding: 4 },
  authBtn: {
    marginTop: 24,
    backgroundColor: '#1f804e',
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#42b57e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
  },
  authBtnText: {
    color: '#e0f5ec',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#172b20',
    marginTop: 22,
    marginBottom: 14,
  },
  securityLabel: {
    fontSize: 13,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    backgroundColor: '#08120e',
    borderColor: '#1e3828',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 16,
  },
  badgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 16,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;
