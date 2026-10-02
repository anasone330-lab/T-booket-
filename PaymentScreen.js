import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PaymentScreen({ route, navigation, onPaymentComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('mastercard');

  const handleConfirmPayment = () => {
    Alert.alert(
      'تأكيد الدفع',
      selectedMethod === 'mastercard' 
        ? 'تم اختيار الدفع عبر ماستركارد الرافدين بنجاح.' 
        : 'تم اختيار الدفع نقداً عند الوصول.',
      [
        {
          text: 'حسناً',
          onPress: () => {
            if (onPaymentComplete) onPaymentComplete(selectedMethod);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>طرق الدفع 💳</Text>
      <Text style={styles.subtitle}>اختر طريقة الدفع المناسبة لك لإتمام حجز الملعب</Text>

      {/* خيار ماستركارد الرافدين */}
      <TouchableOpacity 
        style={[styles.cardOption, selectedMethod === 'mastercard' && styles.selectedCard]}
        onPress={() => setSelectedMethod('mastercard')}
      >
        <Text style={styles.cardIcon}>💳</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>ماستركارد الرافدين</Text>
          <Text style={styles.cardDetails}>**** **** **** 4321 (افتراضي)</Text>
        </View>
        <Text style={styles.radio}>{selectedMethod === 'mastercard' ? '🔘' : '⚪'}</Text>
      </TouchableOpacity>

      {/* خيار الدفع النقدي */}
      <TouchableOpacity 
        style={[styles.cardOption, selectedMethod === 'cash' && styles.selectedCard]}
        onPress={() => setSelectedMethod('cash')}
      >
        <Text style={styles.cardIcon}>💵</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>الدفع نقداً عند الوصول</Text>
          <Text style={styles.cardDetails}>الدفع مباشرة لدى إدارة الملعب</Text>
        </View>
        <Text style={styles.radio}>{selectedMethod === 'cash' ? '🔘' : '⚪'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
        <Text style={styles.confirmButtonText}>تأكيد ومتابعة الدفع</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 8, color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'right', marginBottom: 24 },
  cardOption: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 14 },
  selectedCard: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  cardIcon: { fontSize: 28, marginLeft: 14 },
  cardInfo: { flex: 1, alignItems: 'flex-end' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  cardDetails: { fontSize: 12, color: '#64748b', marginTop: 3 },
  radio: { fontSize: 18, marginRight: 10 },
  confirmButton: { backgroundColor: '#16a34a', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  confirmButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
