import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, cerrar', 
          onPress: async () => {
            await AsyncStorage.clear();
            // Aquí navegarías de vuelta al login
            Alert.alert('Sesión cerrada');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Hola, {userData?.first_name || userData?.username || 'Usuario'}
        </Text>
        <Text style={styles.subtitle}>¿Qué necesitas hoy?</Text>
      </View>

      <View style={styles.servicesGrid}>
        <TouchableOpacity style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>🚗</Text>
          </View>
          <Text style={styles.serviceTitle}>Solicitar Grúa</Text>
          <Text style={styles.serviceDesc}>Servicio de grúa 24/7</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>🔧</Text>
          </View>
          <Text style={styles.serviceTitle}>Asistencia Mecánica</Text>
          <Text style={styles.serviceDesc}>Ayuda técnica inmediata</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>📋</Text>
          </View>
          <Text style={styles.serviceTitle}>Revisión Técnica</Text>
          <Text style={styles.serviceDesc}>Agenda tu revisión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>📱</Text>
          </View>
          <Text style={styles.serviceTitle}>Mis Servicios</Text>
          <Text style={styles.serviceDesc}>Historial y estado</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Mi Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  servicesGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 213, 99, 0.3)',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D563',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
  bottomSection: {
    padding: 20,
    gap: 15,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});