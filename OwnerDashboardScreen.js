import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function OwnerDashboardScreen({ bookings, onLogout }) {
  const [stadiumStatus, setStadiumStatus] = useState('متاح');
  const [hourlyPrice, setHourlyPrice] = useState('30,000');
  const [tempPrice, setTempPrice] = useState('30,000');

  const handleUpdatePrice = () => {
    setHourlyPrice(tempPrice);
    alert('تم تحديث سعر الساعة بنجاح!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>لوحة إدارة الملعب 🏟️</Text>
        <Text style={styles.subtitle}>ملعب الأسطورة الخماسي - الجادرية</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* تعديل سعر الملعب */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تحديد سعر حجز الساعة (د.ع):</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              value={tempPrice}
              onChangeText={setTempPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePrice}>
              <Text style={styles.saveBtnText}>حفظ السعر</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.currentPriceText}>السعر المعروض للزبائن: {hourlyPrice} د.ع / ساعة</Text>
        </View>

        {/* حالة الملعب */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>حالة الملعب الحالية:</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[styles.statusBtn, stadiumStatus === 'متاح' && styles.availableBtn]}
              onPress={() => setStadiumStatus('متاح')}
            >
              <Text style={styles.statusText}>متاح للحجز</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusBtn, stadiumStatus === 'مغلق' && styles.closedBtn]}
              onPress={() => setStadiumStatus('مغلق')}
            >
              <Text style={styles.statusText}>مغلق للصيانة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* قائمة الحجوزات الواردة مع الأكواد التفصيلية */}
        <Text style={styles.sectionTitle}>الحجوزات الواردة للتحقق 📋</Text>
        {bookings && bookings.length > 0 ? (
          bookings.map((item) => (
            <View key={item.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.customerName}>{item.customerName || 'اسم الزبون'}</Text>
                <Text style={styles.bookingCode}>رمز الحجز: {item.id}</Text>
              </View>
              <Text style={styles.bookingDetail}>📧 البريد: {item.customerEmail}</Text>
              <Text style={styles.bookingDetail}>⏰ الوقت: {item.time}</Text>
              <View style={styles.bookingFooter}>
                <Text style={styles.bookingType}>نوع الحجز: {item.type || 'حجز عادي'}</Text>
                <Text style={styles.bookingStatus}>🟢 {item.status || 'مؤكد'}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>لا توجد حجوزات مسجلة حالياً</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, paddingTop: 40, backgroundColor: '#1e293b' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'right', marginTop: 4 },
  content: { padding: 16 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#334155', textAlign: 'right', marginBottom: 10 },
  priceRow: { flexDirection: 'row-reverse', gap: 10 },
  priceInput: { flex: 1, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  currentPriceText: { fontSize: 12, color: '#16a34a', fontWeight: 'bold', textAlign: 'right', marginTop: 8 },
  statusRow: { flexDirection: 'row-reverse', gap: 10 },
  statusBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#cbd5e1', alignItems: 'center' },
  availableBtn: { backgroundColor: '#16a34a' },
  closedBtn: { backgroundColor: '#ef4444' },
  statusText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', color: '#0f172a', marginBottom: 12 },
  bookingCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  bookingHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6, borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 6 },
  customerName: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  bookingCode: { fontSize: 12, color: '#2563eb', fontWeight: 'bold', backgroundColor: '#dbeafe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  bookingDetail: { fontSize: 13, color: '#475569', textAlign: 'right', marginTop: 2 },
  bookingFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 8 },
  bookingStatus: { fontSize: 12, color: '#16a34a', fontWeight: 'bold' },
  bookingType: { fontSize: 12, color: '#64748b' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginVertical: 20 },
  logoutButton: { backgroundColor: '#ef4444', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logoutText: { color: '#ffffff', fontWeight: 'bold' }
});
