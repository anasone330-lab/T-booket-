import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

export default function SupportScreen({ setActiveTab }) {
  const handleCallSupport = () => {
    Linking.openURL('tel:+9647700000000').catch(() => {
      Alert.alert('خطأ', 'لا يمكن إجراء المكالمة حالياً');
    });
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@tbooket.com').catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح البريد الإلكتروني');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الدعم الفني والساعدة 🎧</Text>
      
      <View style={styles.card}>
        <Text style={styles.description}>
          هل تواجه مشكلة في الحجز أو التطبيق؟ فريق الدعم متواجد لمساعدتك على مدار الساعة.
        </Text>

        <TouchableOpacity style={styles.supportButton} onPress={handleCallSupport}>
          <Text style={styles.buttonText}>📞 الاتصال بخدمة العملاء</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportButton} onPress={handleEmailSupport}>
          <Text style={styles.buttonText}>✉️ مراسلة عبر البريد الإلكتروني</Text>
        </TouchableOpacity>
      </View>

      {/* زر العودة إلى الصفحة الرئيسية */}
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={() => {
          if (setActiveTab) setActiveTab('home');
        }}
      >
        <Text style={styles.homeButtonText}>⬅️ العودة إلى الصفحة الرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#0f172a' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, marginBottom: 20 },
  description: { fontSize: 14, color: '#64748b', textAlign: 'right', marginBottom: 20, lineHeight: 22 },
  supportButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  homeButton: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center' },
  homeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
