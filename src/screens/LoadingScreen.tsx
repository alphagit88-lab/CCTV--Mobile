import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  onDone: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onDone }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [statusText, setStatusText] = useState('Initializing high-precision monitoring...');

  const messages = [
    'Initializing high-precision monitoring...',
    'Establishing secure channel...',
    'Authenticating credentials...',
    'Loading surveillance matrix...',
    'All systems operational.',
  ];

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    );
    pulse.start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Status messages
    const intervals = messages.map((msg, i) =>
      setTimeout(() => setStatusText(msg), i * 650),
    );

    // Navigate to dashboard
    const nav = setTimeout(onDone, 3400);

    return () => {
      pulse.stop();
      intervals.forEach(clearTimeout);
      clearTimeout(nav);
    };
  }, []);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={loadingStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Background Image */}
      <Image
        source={require('../assets/images/loading-bg.png')}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMode="cover"
      />

      <Animated.View style={[loadingStyles.centerBlock, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Animated.View style={[loadingStyles.logoWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={loadingStyles.logoSquare}>
            <Icon name="shield-check-outline" size={40} color="#329662" />
          </View>
        </Animated.View>

        <Text style={loadingStyles.brandName}>SITE SECURITY</Text>
        <Text style={loadingStyles.portalLabel}>AUTHENTICATION IN PROGRESS</Text>

        {/* Progress bar */}
        <View style={loadingStyles.progressTrack}>
          <Animated.View style={[loadingStyles.progressBar, { width: barWidth }]} />
        </View>

        <Text style={loadingStyles.statusText}>{statusText}</Text>

        {/* Subtle dot indicators */}
        <View style={loadingStyles.dotsRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[loadingStyles.dot, { opacity: 0.3 + i * 0.3 }]} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050a08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBlock: { alignItems: 'center', paddingHorizontal: 40 },
  logoWrap: { marginBottom: 28 },
  logoSquare: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#0c1a14',
    borderWidth: 1.5,
    borderColor: '#1e3828',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#329662',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#c8e8d8',
    letterSpacing: 4,
    marginBottom: 6,
  },
  portalLabel: {
    fontSize: 12,
    color: '#4e8a6a',
    letterSpacing: 3,
    marginBottom: 36,
  },
  progressTrack: {
    width: width * 0.55,
    height: 3,
    backgroundColor: '#0c1a14',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#329662',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 13,
    color: '#4e8a6a',
    fontStyle: 'italic',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsRow: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#329662' },
});

export default LoadingScreen;
