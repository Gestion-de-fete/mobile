import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [zoom, setZoom] = useState(0); // 0 = pas de zoom, 1 = max zoom
  const [torch, setTorch] = useState('off'); // 'on' ou 'off'

  // Fonction logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'utilisateur_id',
        'role_utilisateur',
        'email_utilisateur',
      ]);
      navigation.replace('Login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  // Fonction de scan QR code
  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code détecté', `Données : ${data}`);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  // Redemander les permissions si null
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Affichage de chargement si permissions inconnues
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la permission caméra...</Text>
      </View>
    );
  }

  // Affichage si permission refusée
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>L'accès à la caméra est refusé</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Redemander l'accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner un QR Code</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          zoom={zoom}
          torch={torch}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Contrôles Zoom */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setZoom(Math.max(0, zoom - 0.1))}
        >
          <Icon name="minus" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setZoom(Math.min(1, zoom + 0.1))}
        >
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Bouton torche */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setTorch(torch === 'on' ? 'off' : 'on')}
        >
          <Icon name={torch === 'on' ? 'zap-off' : 'zap'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Icon name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    alignItems: 'center',
    marginBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 100,
    fontWeight: 'bold',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    backgroundColor: '#000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#424242',
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
