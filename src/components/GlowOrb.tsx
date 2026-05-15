import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface GlowOrbProps {
  color: string;
  size: number;
  style?: any;
}

const GlowOrb: React.FC<GlowOrbProps> = ({ color, size, style }) => (
  <View style={[{ width: size, height: size, position: 'absolute' }, style]} pointerEvents="none">
    <Image
      source={require('../assets/images/glow.png')}
      style={{ width: '100%', height: '100%', tintColor: color, opacity: 0.2 }}
      resizeMode="stretch"
      blurRadius={10}
    />
  </View>
);

export default GlowOrb;
