import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

export default function PaymentScreen({ route, navigation }) {
  const { venueName = "الملعب", timeSlot = "الموعد", price = "0 دينار" } = route?.params || {};

  const handlePayment = () => {
    Alert.alert(
      'تأكيد الدفع',
      `هل تريد تأكيد دفع ${price} عبر ماستركارد الرافدين؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تأكيد ودفع', 
          onPress: () => {
            Alert.alert('تم بنجاح', 'تمت عملية الدفع وحجز الملعب بنجاح!');
            navigation.navigate('Home'); // الرجوع للشاشة الرئيسية
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>تفاصيل الدفع</Text>

      {/* ملخص الحجز */}
      <View style={styles.card}>
        <Text style={styles.label}>الملعب:</Text>
        <Text style={styles.value}>{venueName}</Text>

        <Text style={styles.label}>الوقت:</Text>
        <Text style={styles.value}>{timeSlot}</Text>

        <Text style={styles.label}>المبلغ المطلوب:</Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      {/* طريقة الدفع الوحيدة */}
      <Text style={styles.sectionTitle}>طريقة الدفع:</Text>
      <View style={styles.paymentMethod}>
        <Text style={styles.icon}>💳</Text>
        <View>
          <Text style={styles.methodName}>ماستركارد الرافدين</Text>
          <Text style={styles.methodSub}>دفع إلكتروني مباشر</Text>
        </View>
      </View>

      {/* زر الدفع */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
        <Text style={styles.payBtnText}>إتمام الدفع الآن</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#111827' },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  label: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'right' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#059669', textAlign: 'right', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 10, textAlign: 'right' },
  paymentMethod: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 15, borderRadius: 10, borderWidth: 2, borderColor: '#10B981' },
  icon: { fontSize: 24, marginLeft: 10 },
  methodName: { fontSize: 16, fontWeight: 'bold', color: '#065F46', textAlign: 'right' },
  methodSub: { fontSize: 12, color: '#059669', textAlign: 'right' },
  payBtn: { backgroundColor: '#10B981', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  payBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
