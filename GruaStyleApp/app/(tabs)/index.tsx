import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SolicitarGruaScreen from '../solicitar-grua';

export default function MainScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando request a:', 'http://192.168.1.4:8000/api/v1/auth/login/');
      console.log('Datos enviados:', { username, password });
      
      const response = await fetch('http://192.168.1.4:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setUserData(data.user);
        setShowDashboard(true);
        setCurrentScreen('dashboard');
        console.log('Login exitoso');
      } else {
        alert('Error: ' + (data.error || data.detail || 'Usuario o contraseña incorrectos'));
      }
      
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar pantalla de Solicitar Grúa
  if (showDashboard && currentScreen === 'solicitar-grua') {
    return <SolicitarGruaScreen onBack={() => setCurrentScreen('dashboard')} />;
  }

  // Mostrar dashboard
  if (showDashboard && currentScreen === 'dashboard') {
    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.welcome}>
          Hola, {userData?.first_name || userData?.username}
        </Text>
        <Text style={styles.subtitle}>¿Qué necesitas hoy?</Text>
        
        <TouchableOpacity 
          style={styles.serviceButton}
          onPress={() => setCurrentScreen('solicitar-grua')}
        >
          <Text style={styles.serviceText}>🚗 Solicitar Grúa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.serviceButton}>
          <Text style={styles.serviceText}>🔧 Asistencia Mecánica</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.serviceButton}>
          <Text style={styles.serviceText}>📋 Revisión Técnica</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.serviceButton}>
          <Text style={styles.serviceText}>📱 Mis Servicios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            setShowDashboard(false);
            setCurrentScreen('dashboard');
            setUsername('');
            setPassword('');
            setUserData(null);
          }}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Mostrar login
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grúa Style</Text>
        <Text style={styles.subtitle}>Servicio de Grúa 24/7</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Usuario o Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    padding: 20,
    paddingTop: 80,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
    padding: 20,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00D563',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 40,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00D563',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceButton: {
    backgroundColor: 'rgba(0, 213, 99, 0.2)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00D563',
  },
  serviceText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});