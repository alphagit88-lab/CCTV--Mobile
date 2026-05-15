import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DashboardTab = 'dashboard' | 'projects' | 'profile';

const PROJECTS = [
  {
    id: '1',
    title: 'The Zenith Plaza',
    location: 'London, Canary Wharf',
    cameras: 18,
    image: require('../assets/images/project1.jpg'),
  },
  {
    id: '2',
    title: 'Riverside Wharf',
    location: 'Sydney, Darling Harbour',
    cameras: 32,
    image: require('../assets/images/project2.jpg'),
  },
];

interface DashboardScreenProps {
  onOpenProject: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenProject }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  return (
    <SafeAreaView style={dashStyles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#080c14" />

      {/* ── Header ── */}
      <View style={dashStyles.header}>
        <Text style={dashStyles.headerBrand}>Provider Portal</Text>
        <View style={dashStyles.headerRight}>
          <TouchableOpacity style={dashStyles.headerIcon}>
            <Icon name="bell-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={dashStyles.avatarBtn}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
              style={dashStyles.avatarImage} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={dashStyles.scroll}
        contentContainerStyle={dashStyles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Welcome */}
        <View style={dashStyles.welcomeBlock}>
          <Text style={dashStyles.welcomeText}>Welcome back,{'\n'}Fernando</Text>
          <Text style={dashStyles.welcomeSub}>Your surveillance overview for today.</Text>
        </View>

        {/* Status Card */}
        <View style={dashStyles.statusCard}>
          <Text style={dashStyles.statusCaption}>ACTIVE MONITORING</Text>
          <Text style={dashStyles.statusTitle}>All Systems Operational</Text>
          <View style={dashStyles.statusBadgeRow}>
            <View style={dashStyles.greenDot} />
            <Text style={dashStyles.statusBadgeText}>Live feeds encrypted & verified</Text>
          </View>
          <View style={dashStyles.statusIcon}>
            <Icon name="camera-outline" size={36} color="#a78bfa" style={{ opacity: 0.35 }} />
          </View>
        </View>

        {/* Camera Count */}
        <View style={dashStyles.cameraCard}>
          <Icon name="video-outline" size={32} color="#a78bfa" style={{ marginBottom: 8 }} />
          <Text style={dashStyles.cameraCount}>07</Text>
          <Text style={dashStyles.cameraLabel}>TOTAL CAMERAS</Text>
        </View>

        {/* Your Projects */}
        <View style={dashStyles.sectionHeader}>
          <Text style={dashStyles.sectionTitle}>Your Projects</Text>
          <TouchableOpacity>
            <Text style={dashStyles.viewAll}>View All &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Project Cards */}
        {PROJECTS.map(project => (
          <TouchableOpacity 
            key={project.id} 
            style={dashStyles.projectCard} 
            activeOpacity={0.9}
            onPress={onOpenProject}
          >
            <View style={dashStyles.projectThumbBg}>
              <Image source={project.image} style={dashStyles.projectImage} />
              <View style={dashStyles.liveBadge}>
                <View style={dashStyles.liveDot} />
                <Text style={dashStyles.liveText}>LIVE</Text>
              </View>
            </View>
            
            <View style={dashStyles.projectInfo}>
              <Text style={dashStyles.projectTitle}>{project.title}</Text>
              <View style={dashStyles.locationRow}>
                <Icon name="map-marker-outline" size={14} color="#ffffff" />
                <Text style={dashStyles.locationText}>{project.location}</Text>
              </View>
              
              <View style={dashStyles.separator} />
              
              <View style={dashStyles.cameraRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="video-outline" size={18} color="#a78bfa" />
                  <Text style={dashStyles.cameraInfoText}>{project.cameras} Accessible Cameras</Text>
                </View>
                <Icon name="arrow-right" size={18} color="#ffffff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* ── Bottom Nav ── */}
      <View style={dashStyles.bottomNav}>
        {([
          { key: 'dashboard', icon: 'view-dashboard-outline', label: 'Dashboard' },
          { key: 'projects', icon: 'video-outline', label: 'Projects' },
          { key: 'profile', icon: 'account-outline', label: 'Profile' },
        ] as { key: DashboardTab; icon: string; label: string }[]).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={dashStyles.navTab}
            onPress={() => {
              if (tab.key === 'projects') {
                onOpenProject();
              } else {
                setActiveTab(tab.key);
              }
            }}>
            <Icon 
              name={tab.icon} 
              size={24} 
              color={activeTab === tab.key ? '#a78bfa' : '#7a8a9a'} 
              style={{ opacity: activeTab === tab.key ? 1 : 0.7 }}
            />
            <Text style={[dashStyles.navLabel, activeTab === tab.key && dashStyles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const dashStyles = StyleSheet.create({
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  welcomeBlock: { marginTop: 8, marginBottom: 20 },
  welcomeText: { fontSize: 26, fontWeight: '800', color: '#d0b0ff', lineHeight: 34 },
  welcomeSub: { fontSize: 13, color: '#a0aab0', marginTop: 6 },
  statusCard: {
    backgroundColor: '#0c1a14',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#1e3828',
    position: 'relative',
    overflow: 'hidden',
  },
  statusCaption: { fontSize: 10, color: '#a78bfa', letterSpacing: 2, fontWeight: '700', marginBottom: 8 },
  statusTitle: { fontSize: 20, fontWeight: '800', color: '#e8f0fe', marginBottom: 14 },
  statusBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#329662' },
  statusBadgeText: { fontSize: 13, color: '#ffffff' },
  statusIcon: { position: 'absolute', right: 16, bottom: 12 },
  cameraCard: {
    backgroundColor: '#0c1a14',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#1e3828',
  },
  cameraIcon: { marginBottom: 8 },
  cameraCount: { fontSize: 48, fontWeight: '900', color: '#e8f0fe', lineHeight: 56 },
  cameraLabel: { fontSize: 11, color: '#ffffff', letterSpacing: 2, fontWeight: '700', marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#e8f0fe' },
  viewAll: { fontSize: 13, color: '#7c6aed' },
  projectCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0c1a14',
    borderWidth: 1.2,
    borderColor: '#1e3828',
    marginBottom: 16,
  },
  projectThumbBg: {
    height: 160,
    backgroundColor: '#0a1a10',
    position: 'relative',
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  projectInfo: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#a78bfa',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: '#ffffff',
  },
  separator: {
    height: 1,
    backgroundColor: '#3a5a48',
    marginBottom: 16,
    opacity: 0.8,
  },
  cameraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraInfoText: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '500',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#329662' },
  liveText: { fontSize: 10, color: '#ffffff', fontWeight: '800', letterSpacing: 1 },
  // Bottom Nav
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

export default DashboardScreen;
