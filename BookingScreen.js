import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from './Supabase';

export default function BookingScreen({ stadium, onBack, onBookingSuccess }) {
  const [selectedDate, setSelectedDate] = useState('اليوم');
  const [selectedTime, setSelectedTime] = useState('18:00 - 19:00');
  const [loading, setLoading] = useState(false);

  const times = [
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
  ];

  const handleBooking = async () => {
    try {
      setLoading(true);
      // إرسال بيانات الحجز إلى جدول bookings في قاعدة بيانات Supabase
      const { error } = await supabase.from('bookings').insert([
        {
          stadium_id: stadium?.id,
          stadium_name: stadium?.name || 'ملعب غير محدد',
          date: selectedDate,
          time_slot: selectedTime,
          price: stadium?.price || '30,000 د.ع',
          status: 'confirmed',
        },
      ]);

      if (error) {
        Alert.alert('خطأ', 'فشل تثبيت الحجز: ' + error.message);
      } else {
        Alert.alert('تم بنجاح! ⚽', 'تم تأكيد حجز الملعب بنجاح وإرساله إلى السيرفر.');
        if (onBookingSuccess) onBookingSuccess();
      }
    } catch (err) {
      Alert.alert('خطأ غير متوقع', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* زر العودة */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← عودة للملاعب</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{stadium?.name || 'تفاصيل الملعب'}</Text>
        <Text style={styles.location}>📍 {stadium?.location || 'بغداد'}</Text>
        <Text style={styles.price}>💰 {stadium?.price || '30,000 د.ع / ساعة'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اختر وقت الحجز:</Text>
        {times.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.bookButton, loading && styles.disabledButton]} 
        onPress={handleBooking}
        disabled={loading}
      >
        <Text style={styles.bookButtonText}>
          {loading ? 'جاري تثبيت الحجز...' : 'تأكيد الحجز الآن ⚽'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  backButton: { marginBottom: 16, alignSelf: 'flex-end' },
  backButtonText: { fontSize: 14, color: '#2563eb', fontWeight: 'bold' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', textAlign: 'right', marginBottom: 6 },
  location: { fontSize: 14, color: '#64748b', textAlign: 'right', marginBottom: 4 },
  price: { fontSize: 14, color: '#16a34a', fontWeight: 'bold', textAlign: 'right' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', textAlign: 'right', marginBottom: 12 },
  timeButton: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  selectedTimeButton: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  timeText: { fontSize: 14, color: '#1e293b' },
  selectedTimeText: { color: '#ffffff', fontWeight: 'bold' },
  bookButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  disabledButton: { backgroundColor: '#94a3b8' },
  bookButtonText: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
});
