import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { VlcSimplePlayer } from 'react-native-vlc-rtsp';

interface CameraDetailScreenProps {
  camera: any;
  onBack: () => void;
  onNavigateTab: (tab: 'dashboard' | 'projects' | 'profile') => void;
}

const CameraDetailScreen: React.FC<CameraDetailScreenProps> = ({ camera, onBack, onNavigateTab }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#080c14" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.headerIcon}>
            <Icon name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerBrand}>Project Cameras</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="bell-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Feed ── */}
      <View style={styles.feedContainer}>
        <View style={styles.backgroundImage}>
          {camera?.link ? (
            <>
              {console.log('🎥 VLC RTSP: Attempting to play stream:', camera.link)}
              <VlcSimplePlayer
                url={camera.link}
                autoplay={true}
                autoAspectRatio={false}
                videoAspectRatio="16:9"
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  bottom: 0, 
                  right: 0,
                  width: '100%',
                  height: '100%'
                }}
                showTop={false}
                showBack={false}
              />
            </>
          ) : (
            <Image
              source={require('../assets/images/camera_full.jpg')}
              style={StyleSheet.absoluteFill}
            />
          )}

          <View style={styles.overlayContainer}>
            {/* Corner Focus Indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Top Overlays */}
            <View style={styles.topOverlay}>
              <View style={styles.indicatorRow}>
                <View style={styles.yellowIndicator} />
              </View>
              <Text style={styles.cameraName}>{camera?.title || 'North Perimeter - Gate 4'}</Text>

              <View style={styles.timestampBox}>
                <Text style={styles.timestampDate}>2023-10-24</Text>
                <Text style={styles.timestampTime}>18:42:05</Text>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeTextGreen}>PTZ DOME</Text>
                </View>
                <View style={styles.badgeRed}>
                  <Text style={styles.badgeText}>LIVE</Text>
                </View>
              </View>
            </View>

            {/* Bottom Info Card */}
            <View style={styles.bottomCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>System Status</Text>
                <Icon name="information-outline" size={20} color="#7ab89a" />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>Sector A-12</Text>
              </View>
              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Signal Strength</Text>
                <Text style={styles.infoValue}>98% (Stable)</Text>
              </View>
              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Motion Sensor</Text>
                <Text style={[styles.infoValue, { color: '#d4af37' }]}>Armed</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── Bottom Nav ── */}
      <View style={styles.bottomNav}>
        {([
          { key: 'dashboard', icon: 'view-dashboard-outline', label: 'Dashboard' },
          { key: 'projects', icon: 'video-outline', label: 'Projects' },
          { key: 'profile', icon: 'account-outline', label: 'Profile' },
        ] as { key: 'dashboard' | 'projects' | 'profile'; icon: string; label: string }[]).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navTab}
            onPress={() => onNavigateTab(tab.key)}>
            <Icon
              name={tab.icon}
              size={24}
              color={tab.key === 'projects' ? '#a78bfa' : '#7a8a9a'}
              style={{ opacity: tab.key === 'projects' ? 1 : 0.7 }}
            />
            <Text style={[styles.navLabel, tab.key === 'projects' && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09140f' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0c1a14',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBrand: { fontSize: 18, fontWeight: '700', color: '#a78bfa', letterSpacing: 0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { padding: 4 },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111d18',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1e3828',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(122, 184, 154, 0.6)',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7ab89a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 4,
    backgroundColor: '#000',
  },
  overlayContainer: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
  },
  topOverlay: {
    marginTop: 0,
  },
  indicatorRow: {
    marginBottom: 12,
  },
  yellowIndicator: {
    width: 4,
    height: 12,
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
  cameraName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 28,
  },
  timestampBox: {
    backgroundColor: 'rgba(0, 30, 30, 0.7)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timestampDate: {
    fontSize: 14,
    color: '#7ab89a',
    fontWeight: '400',
  },
  timestampTime: {
    fontSize: 16,
    color: '#7ab89a',
    fontWeight: '400',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeGreen: {
    backgroundColor: '#111d18',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffffff',
  },
  badgeRed: {
    backgroundColor: 'rgba(120, 20, 20, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '400',
    letterSpacing: 1,
  },
  badgeTextGreen: {
    fontSize: 11,
    color: '#7ab89a',
    fontWeight: '400',
    letterSpacing: 1,
  },
  corner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderColor: '#7ab89a',
    borderWidth: 0.5,
  },
  topLeft: {
    top: 33,
    left: 33,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 33,
    right: 33,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 33,
    left: 33,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 33,
    right: 33,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  bottomCard: {
    backgroundColor: 'rgba(12, 26, 20, 0.9)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 56, 40, 0.8)',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7ab89a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#a0aab0',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(30, 56, 40, 0.5)',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#151b22',
    borderTopWidth: 1,
    borderTopColor: '#1e3828',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: '#7a8a9a', fontWeight: '500' },
  navLabelActive: { color: '#d0b0ff', fontWeight: '700' },
});

export default CameraDetailScreen;
