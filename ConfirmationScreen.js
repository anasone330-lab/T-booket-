import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ConfirmationScreen({ bookingData, onHome }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>تم تأكيد الحجز بنجاح!</Text>
        <Text style={styles.subtitle}>يرجى إبراز رمز الحجز التالي لصاحب الملعب عند الوصول:</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>رمز الحجز الخاص بك:</Text>
          <Text style={styles.codeText}>{bookingData?.id || '#HB-9921'}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailText}>الملعب: {bookingData?.stadium?.name}</Text>
          <Text style={styles.detailText}>الوقت: {bookingData?.time}</Text>
          <Text style={styles.detailText}>طريقة الدفع: ماستركارد الرافدين</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onHome}>
          <Text style={styles.buttonText}>العودة للرئيسية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  icon: { fontSize: 50, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  codeContainer: { backgroundColor: '#f1f5f9', width: '100%', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  codeLabel: { fontSize: 12, color: '#64748b' },
  codeText: { fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginTop: 4 },
  details: { width: '100%', marginBottom: 20, borderTopWidth: 1, borderColor: '#f1f5f9', paddingTop: 12 },
  detailText: { fontSize: 14, color: '#334155', textAlign: 'right', marginBottom: 6 },
  button: { backgroundColor: '#2563eb', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 }
});
