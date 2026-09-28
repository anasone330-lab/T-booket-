import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Linking 
} from 'react-native';

export default function BookingScreen({ venueData, onConfirmBooking }) {
  const venue = venueData || {
    id: 1,
    name: 'ملعب الأبطال',
    price: '25,000 دينار / ساعة',
    latitude: 34.1983,
    longitude: 43.8742,
  };

  const [selectedTime, setSelectedTime] = useState(null);

  const availableTimes = [
    '04:00 مساءً - 05:00 مساءً',
    '05:00 مساءً - 06:00 مساءً',
    '08:00 مساءً - 09:00 مساءً',
    '09:00 مساءً - 10:00 مساءً',
  ];

  const openNavigation = () => {
    const wazeUrl = `https://waze.com/ul?ll=${venue.latitude},${venue.longitude}&navigate=yes`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;

    Linking.canOpenURL(wazeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(wazeUrl);
        } else {
          Linking.openURL(googleMapsUrl);
        }
      })
      .catch(() => Alert.alert('خطأ', 'تعذر فتح تطبيق الخرائط'));
  };

  const handleBooking = () => {
    if (!selectedTime) {
      Alert.alert('تنبيه', 'يرجى اختيار التوقيت المناسب للحجز أولاً');
      return;
    }

    if (onConfirmBooking) {
      onConfirmBooking({
        venueName: venue.name,
        timeSlot: selectedTime,
        price: venue.price,
      });
    } else {
      Alert.alert('تم اختيار الوقت', `تم اختيار: ${selectedTime}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{venue.name}</Text>
      <Text style={styles.priceTag}>السعر: {venue.price}</Text>

      <TouchableOpacity style={styles.wazeButton} onPress={openNavigation}>
        <Text style={styles.wazeButtonText}>🚗 فتح موقع الملعب عبر Waze / Google Maps</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>اختر الوقت المناسب:</Text>

      {availableTimes.map((time, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.timeCard,
            selectedTime === time && styles.selectedTimeCard,
          ]}
          onPress={() => setSelectedTime(time)}
        >
          <Text
            style={[
              styles.timeText,
              selectedTime === time && styles.selectedTimeText,
            ]}
          >
            {time}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        <Text style={styles.confirmButtonText}>المتابعة لتأكيد الحجز</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1F2937', marginTop: 10 },
  priceTag: { fontSize: 16, textAlign: 'center', color: '#059669', fontWeight: '600', marginVertical: 8 },
  wazeButton: { backgroundColor: '#33CCFF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginVertical: 15 },
  wazeButtonText: { color: '#000000', fontSize: 15, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 10, marginBottom: 12, textAlign: 'right' },
  timeCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, alignItems: 'center' },
  selectedTimeCard: { backgroundColor: '#10B981', borderColor: '#059669' },
  timeText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  selectedTimeText: { color: '#FFFFFF', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
