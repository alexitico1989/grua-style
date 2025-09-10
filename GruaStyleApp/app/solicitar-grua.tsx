import React, { useState } from 'react';
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
      // Aquí conectaremos con tu API de solicitudes
      console.log('Enviando solicitud:', formData);
      
      // Simulación temporal
      setTimeout(() => {
        Alert.alert('Éxito', 'Solicitud enviada correctamente');
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud');
      setLoading(false);
    }
  };

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