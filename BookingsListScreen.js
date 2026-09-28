import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';

export default function BookingsListScreen({ bookings, onBack }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>سجل حجوزاتي 📅</Text>
      </View>

      {bookings && bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => setSelectedBooking(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.stadiumName}>{item.stadium?.name || 'اسم الملعب'}</Text>
                <Text style={styles.statusBadge}>🟢 {item.status || 'مؤكد'}</Text>
              </View>
              <Text style={styles.cardDetail}>⏰ الوقت: {item.time}</Text>
              <Text style={styles.cardCode}>كود الحجز: {item.id}</Text>
              <Text style={styles.clickHint}>اضغط هنا لمشاهدة التفاصيل الكاملة 🔍</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا توجد حجوزات سابقة حالياً.</Text>
        </View>
      )}

      {/* نافذة تفاصيل الحجز عند الضغط */}
      <Modal visible={!!selectedBooking} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تفاصيل الحجز الكاملة 📋</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{selectedBooking?.id}</Text>
              <Text style={styles.detailLabel}>رمز الحجز:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{selectedBooking?.stadium?.name}</Text>
              <Text style={styles.detailLabel}>الملعب:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{selectedBooking?.stadium?.location || 'بغداد'}</Text>
              <Text style={styles.detailLabel}>الموقع:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{selectedBooking?.time}</Text>
              <Text style={styles.detailLabel}>الوقت المحدد:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{selectedBooking?.stadium?.price || '30,000 د.ع'}</Text>
              <Text style={styles.detailLabel}>المبلغ المدفوع:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>ماستركارد الرافدين / Qi Card</Text>
              <Text style={styles.detailLabel}>طريقة الدفع:</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailValue, { color: '#16a34a', fontWeight: 'bold' }]}>
                {selectedBooking?.status || 'مؤكد'}
              </Text>
              <Text style={styles.detailLabel}>حالة الحجز:</Text>
            </View>

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setSelectedBooking(null)}
            >
              <Text style={styles.closeBtnText}>إغلاق النافذة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: '#0f172a' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#ffffff', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#cbd5e1' },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 },
  stadiumName: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  statusBadge: { fontSize: 12, color: '#16a34a', fontWeight: 'bold' },
  cardDetail: { fontSize: 13, color: '#475569', textAlign: 'right' },
  cardCode: { fontSize: 12, color: '#2563eb', fontWeight: 'bold', textAlign: 'right', marginTop: 4 },
  clickHint: { fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 8, fontStyle: 'italic' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 14 },
  backButton: { backgroundColor: '#2563eb', padding: 12, margin: 16, borderRadius: 8, alignItems: 'center' },
  backText: { color: '#ffffff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#cbd5e1' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 16, borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 10 },
  detailRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 6, borderBottomWidth: 1, borderColor: '#f8fafc' },
  detailLabel: { fontSize: 13, color: '#64748b', fontWeight: 'bold' },
  detailValue: { fontSize: 13, color: '#0f172a' },
  closeBtn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 14 },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold' }
});
