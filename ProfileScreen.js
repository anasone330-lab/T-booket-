import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen({ onLogout, onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الملف الشخصي 👤</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>لاعب احجز وملعب</Text>
        <Text style={styles.userEmail}>user@ehjez-walaab.com</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>طريقة الدفع الافتراضية</Text>
        <View style={styles.cardDetail}>
          <Text style={styles.cardIcon}>💳</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardName}>ماستركارد الرافدين</Text>
            <Text style={styles.cardNumber}>**** **** **** 4321</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', color: '#0f172a' },
  profileCard: { backgroundColor: '#ffffff', padding: 20, alignItems: 'center', marginTop: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  userEmail: { fontSize: 13, color: '#64748b', marginTop: 4 },
  infoSection: { padding: 16, marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', color: '#475569', marginBottom: 10 },
  cardDetail: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#ffffff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  cardIcon: { fontSize: 24, marginLeft: 12 },
  cardTextContainer: { alignItems: 'flex-end' },
  cardName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  cardNumber: { fontSize: 12, color: '#64748b', marginTop: 2 },
  logoutButton: { backgroundColor: '#ef4444', padding: 14, marginHorizontal: 16, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  logoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  backButton: { padding: 14, marginHorizontal: 16, alignItems: 'center', marginTop: 10 },
  backText: { color: '#2563eb', fontWeight: 'bold', fontSize: 14 }
});
