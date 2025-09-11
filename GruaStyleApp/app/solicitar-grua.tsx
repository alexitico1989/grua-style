import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface SolicitarGruaScreenProps {
  onBack?: () => void;
}

export default function SolicitarGruaScreen({ onBack }: SolicitarGruaScreenProps) {
  const [formData, setFormData] = useState({
    direccionOrigen: '',
    direccionDestino: '',
    tipoVehiculo: 'auto',
    marcaVehiculo: '',
    modeloVehiculo: '',
    placaVehiculo: '',
    metodoPago: 'efectivo',
    comentarios: '',
  });

  const [loading, setLoading] = useState(false);

  const tiposVehiculo = [
    { value: 'auto', label: 'Auto' },
    { value: 'camioneta', label: 'Camioneta' },
    { value: 'suv', label: 'SUV' },
    { value: 'moto', label: 'Moto' },
  ];

  const metodosPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'mercadopago', label: 'Mercado Pago' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.direccionOrigen || !formData.direccionDestino) {
      Alert.alert('Error', 'Por favor completa origen y destino');
      return;
    }

    if (!formData.marcaVehiculo || !formData.modeloVehiculo) {
      Alert.alert('Error', 'Por favor completa los datos del vehículo');
      return;
    }

    setLoading(true);
    try {
      // Obtener token de autenticación
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Sesión expirada. Por favor inicia sesión nuevamente.');
        return;
      }

      // Preparar datos para enviar
      const solicitudData = {
        direccionOrigen: formData.direccionOrigen,
        direccionDestino: formData.direccionDestino,
        tipoVehiculo: formData.tipoVehiculo,
        marcaVehiculo: formData.marcaVehiculo,
        modeloVehiculo: formData.modeloVehiculo,
        placaVehiculo: formData.placaVehiculo,
        metodoPago: formData.metodoPago,
        comentarios: formData.comentarios,
        tipoServicio: 'inmediato',
        fechaServicio: new Date().toISOString(),
        distanciaKm: 10,
      };

      console.log('Enviando solicitud:', solicitudData);

      // Hacer request a la API CON TOKEN
      const response = await fetch('http://192.168.1.4:8000/api/v1/solicitar-servicio/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(solicitudData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        // Solicitud creada exitosamente
        Alert.alert(
          'Solicitud Enviada', 
          `Tu solicitud ${responseData.numero_orden} ha sido creada exitosamente.\n\nTotal: $${responseData.costo_total?.toLocaleString()}`,
          [
            {
              text: 'Ver Detalles',
              onPress: () => {
                console.log('Ver detalles de solicitud:', responseData.id);
              }
            },
            {
              text: 'Volver al Dashboard',
              onPress: () => {
                if (onBack) onBack();
              }
            }
          ]
        );

        // Limpiar formulario
        setFormData({
          direccionOrigen: '',
          direccionDestino: '',
          tipoVehiculo: 'auto',
          marcaVehiculo: '',
          modeloVehiculo: '',
          placaVehiculo: '',
          metodoPago: 'efectivo',
          comentarios: '',
        });

      } else {
        // Error en la solicitud
        const errorMessage = responseData.error || responseData.detail || 'Error al crear la solicitud';
        
        // Si el token expiró, redirigir al login
        if (response.status === 401 || errorMessage.includes('Token') || errorMessage.includes('expirado')) {
          Alert.alert(
            'Sesión Expirada', 
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
            [
              {
                text: 'Ir a Login',
                onPress: () => {
                  // Limpiar tokens expirados
                  AsyncStorage.removeItem('access_token');
                  AsyncStorage.removeItem('refresh_token');
                  AsyncStorage.removeItem('user_data');
                  // Aquí deberías navegar al login
                  if (onBack) onBack(); // Por ahora volver al dashboard
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
      
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F0F23',
    },
    header: {
      padding: 20,
      paddingTop: 60,
      alignItems: 'center',
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      left: 20,
      top: 70,
      padding: 10,
    },
    backButtonText: {
      color: '#00D563',
      fontSize: 16,
      fontWeight: 'bold',
    },
    title: {
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
    section: {
      padding: 20,
      paddingTop: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#00D563',
      marginBottom: 15,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      marginBottom: 15,
      color: '#000000',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    optionButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      flex: 1,
      minWidth: '45%',
    },
    optionSelected: {
      backgroundColor: '#00D563',
      borderColor: '#00D563',
    },
    optionText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontSize: 16,
    },
    optionTextSelected: {
      color: '#000000',
      fontWeight: 'bold',
    },
    submitButton: {
      backgroundColor: '#00D563',
      borderRadius: 12,
      padding: 18,
      margin: 20,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottomSpace: {
      height: 50,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Solicitar Grúa</Text>
        <Text style={styles.subtitle}>Completa los datos del servicio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicaciones</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Dirección de origen"
          value={formData.direccionOrigen}
          onChangeText={(value) => handleInputChange('direccionOrigen', value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Dirección de destino"
          value={formData.direccionDestino}
          onChangeText={(value) => handleInputChange('direccionDestino', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Vehículo</Text>
        <View style={styles.optionsGrid}>
          {tiposVehiculo.map((tipo) => (
            <TouchableOpacity
              key={tipo.value}
              style={[
                styles.optionButton,
                formData.tipoVehiculo === tipo.value && styles.optionSelected
              ]}
              onPress={() => handleInputChange('tipoVehiculo', tipo.value)}
            >
              <Text style={[
                styles.optionText,
                formData.tipoVehiculo === tipo.value && styles.optionTextSelected
              ]}>
                {tipo.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Vehículo</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Marca"
          value={formData.marcaVehiculo}
          onChangeText={(value) => handleInputChange('marcaVehiculo', value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={formData.modeloVehiculo}
          onChangeText={(value) => handleInputChange('modeloVehiculo', value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Patente"
          value={formData.placaVehiculo}
          onChangeText={(value) => handleInputChange('placaVehiculo', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <View style={styles.optionsGrid}>
          {metodosPago.map((metodo) => (
            <TouchableOpacity
              key={metodo.value}
              style={[
                styles.optionButton,
                formData.metodoPago === metodo.value && styles.optionSelected
              ]}
              onPress={() => handleInputChange('metodoPago', metodo.value)}
            >
              <Text style={[
                styles.optionText,
                formData.metodoPago === metodo.value && styles.optionTextSelected
              ]}>
                {metodo.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Comentarios adicionales (opcional)"
          value={formData.comentarios}
          onChangeText={(value) => handleInputChange('comentarios', value)}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Enviando...' : 'Solicitar Grúa'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}