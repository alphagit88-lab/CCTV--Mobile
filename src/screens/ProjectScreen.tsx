import React from 'react';
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
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { API_ENDPOINTS } from '../config/api';

interface ProjectScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: 'dashboard' | 'projects' | 'profile') => void;
  onOpenCamera: (camera: any) => void;
}

const ProjectScreen: React.FC<ProjectScreenProps> = ({ onBack, onNavigateTab, onOpenCamera }) => {
  const [cameras, setCameras] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  
  // Form State
  const [newCam, setNewCam] = React.useState({
    name: '',
    ip: '',
    port: '8000',
    username: '',
    password: '',
    link: '',
  });

  React.useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CAMERAS);
      const data = await response.json();
      if (data.success) {
        // Map backend cameras to frontend format
        const formatted = data.cameras.map((c: any) => ({
          id: c.id.toString(),
          title: c.name,
          timestamp: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
          image: require('../assets/images/south_gate.jpg'),
          ip: c.ip,
          port: c.port,
          link: c.stream_link,
        }));
        setCameras(formatted);
      }
    } catch (error) {
      console.error('Fetch cameras error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamera = async () => {
    if (!newCam.name || (!newCam.ip && !newCam.link)) {
      Alert.alert('Missing Information', 'Please provide a Camera Name and either an IP Address or a Stream Link.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CAMERAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCam.name,
          ip: newCam.ip,
          port: newCam.port,
          username: newCam.username,
          password: newCam.password,
          streamLink: newCam.link,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCameras();
        setModalVisible(false);
        setNewCam({ name: '', ip: '', port: '8000', username: '', password: '', link: '' });
      }
    } catch (error) {
      console.error('Add camera error:', error);
    }
  };
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

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Title Block */}
        <View style={styles.welcomeBlock}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.welcomeText}>Marina Bay</Text>
              <Text style={styles.welcomeSub}>Your surveillance overview for today.</Text>
            </View>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <LinearGradient
                colors={['#186641', '#3ab075']}
                style={StyleSheet.absoluteFill}
              />
              <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Camera Cards */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#7ab89a" />
            <Text style={styles.loaderText}>Fetching camera streams...</Text>
          </View>
        ) : cameras.length > 0 ? (
          cameras.map(cam => (
            <TouchableOpacity 
              key={cam.id} 
              style={styles.cameraCard} 
              onPress={() => onOpenCamera(cam)}
              activeOpacity={0.9}
            >
              <View style={styles.cameraThumbBg}>
                <Image source={cam.image} style={styles.cameraImage} />
                
                {/* LIVE Badge */}
                <View style={styles.liveBadge}>
                  <View style={styles.liveDotRed} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>

                {/* Timestamp Badge */}
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{cam.timestamp}</Text>
                </View>
              </View>
              
              <View style={styles.cameraInfo}>
                <View style={styles.cameraTitleRow}>
                  <Icon name="video-outline" size={20} color="#7a9a8a" />
                  <Text style={styles.cameraTitle}>{cam.title}</Text>
                </View>
                <TouchableOpacity>
                  <Icon name="cog-outline" size={20} color="#7a9a8a" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="video-off-outline" size={64} color="#1e3828" />
            <Text style={styles.emptyText}>No cameras found</Text>
            <Text style={styles.emptySub}>Add a new camera to start monitoring.</Text>
          </View>
        )}

      </ScrollView>

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

      {/* ── Add Camera Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Camera</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#7a9a8a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>CAMERA NAME</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Front Entrance"
                placeholderTextColor="#3a5a48"
                value={newCam.name}
                onChangeText={(t) => setNewCam({ ...newCam, name: t })}
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.formLabel}>IP ADDRESS</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="192.168.1.100"
                    placeholderTextColor="#3a5a48"
                    value={newCam.ip}
                    onChangeText={(t) => setNewCam({ ...newCam, ip: t })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>PORT</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="8000"
                    placeholderTextColor="#3a5a48"
                    value={newCam.port}
                    onChangeText={(t) => setNewCam({ ...newCam, port: t })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.formLabel}>LOGIN USERNAME</Text>
              <TextInput
                style={styles.formInput}
                placeholder="admin"
                placeholderTextColor="#3a5a48"
                value={newCam.username}
                onChangeText={(t) => setNewCam({ ...newCam, username: t })}
              />

              <Text style={styles.formLabel}>LOGIN PASSWORD</Text>
              <TextInput
                style={styles.formInput}
                placeholder="••••••••"
                placeholderTextColor="#3a5a48"
                secureTextEntry
                value={newCam.password}
                onChangeText={(t) => setNewCam({ ...newCam, password: t })}
              />

              <Text style={styles.formLabel}>STREAM LINK</Text>
              <TextInput
                style={styles.formInput}
                placeholder="rtsp://admin:pass@192.168.1.100/stream"
                placeholderTextColor="#3a5a48"
                value={newCam.link}
                onChangeText={(t) => setNewCam({ ...newCam, link: t })}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddCamera}>
                <LinearGradient
                  colors={['#186641', '#3ab075']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.submitBtnText}>ADD CAMERA</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  welcomeBlock: { marginTop: 24, marginBottom: 24 },
  welcomeText: { fontSize: 26, fontWeight: '800', color: '#d0b0ff', lineHeight: 34 },
  welcomeSub: { fontSize: 13, color: '#a0aab0', marginTop: 6 },
  cameraCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0c1a14',
    borderWidth: 1.2,
    borderColor: '#1e3828',
    marginBottom: 20,
  },
  cameraThumbBg: {
    height: 200,
    backgroundColor: '#0a1a10',
    position: 'relative',
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  cameraInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cameraTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  liveDotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4d4d' },
  liveText: { fontSize: 10, color: '#ffffff', fontWeight: '800', letterSpacing: 1 },
  timeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timeText: { fontSize: 10, color: '#a0aab0', fontWeight: '600', letterSpacing: 0.5 },
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
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#3ab075',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loaderContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: '#7ab89a',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0c1a14',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#1e3828',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#a78bfa',
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4e8a6a',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  formInput: {
    backgroundColor: '#08120e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e3828',
    color: '#ffffff',
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
  },
  submitBtn: {
    marginTop: 32,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4e8a6a',
  },
  emptySub: {
    fontSize: 14,
    color: '#a0aab0',
    textAlign: 'center',
  },
});

export default ProjectScreen;
