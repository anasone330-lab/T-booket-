import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function PaymentScreen({ onPaymentComplete }) {
  const [cardNumber, setCardNumber] = useState('4321 **** **** ****');
  const [cardHolder, setCardHolder] = useState('لاعب احجز وملعب');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('***');
  const [loading, setLoading] = useState(false);

  const handleMastercardPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'نجاح الدفع 💳',
        'تم خصم المبلغ بنجاح عبر ماستركارد الرافدين. تم تأكيد حجز الملعب!',
        [
          {
            text: 'حسناً',
            onPress: () => {
              if (onPaymentComplete) onPaymentComplete('mastercard');
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الدفع الإلكتروني 💳</Text>
      <Text style={styles.subtitle}>بوابة ماستركارد الرافدين الآمنة للحجوزات</Text>

      {/* تصميم بطاقة ماستركارد الرافدين */}
      <View style={styles.cardPreview}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.bankName}>مصرف الرافدين - Rafidain Bank</Text>
          <Text style={styles.mastercardLogo}>MC</Text>
        </View>
        <Text style={styles.cardNumberDisplay}>{cardNumber}</Text>
        <View style={styles.cardFooterRow}>
          <View>
            <Text style={styles.cardLabel}>حامل البطاقة</Text>
            <Text style={styles.cardValue}>{cardHolder}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>الانتهاء</Text>
            <Text style={styles.cardValue}>{expiryDate}</Text>
          </View>
        </View>
      </View>

      {/* تفاصيل إدخال البطاقة */}
      <View style={styles.formSection}>
        <Text style={styles.label}>رقم بطاقة ماستركارد الرافدين:</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="أدخل رقم البطاقة"
          keyboardType="numeric"
        />

        <View style={styles.rowInputs}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>تاريخ الانتهاء:</Text>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="MM/YY"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>رمز الأمان (CVV):</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={setCvv}
              placeholder="123"
              secureTextEntry
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handleMastercardPayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'جاري معالجة الدفع الإلكتروني...' : 'إتمام الدفع عبر ماستركارد الرافدين 🔒'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 4, color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'right', marginBottom: 20 },
  cardPreview: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  cardHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  bankName: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  mastercardLogo: { color: '#f59e0b', fontSize: 18, fontWeight: 'bold' },
  cardNumberDisplay: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 2, textAlign: 'right', marginBottom: 20 },
  cardFooterRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  cardLabel: { color: '#94a3b8', fontSize: 10 },
  cardValue: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  formSection: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 13, fontWeight: 'bold', textAlign: 'right', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, textAlign: 'right', marginBottom: 12, color: '#0f172a' },
  rowInputs: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  halfInputContainer: { width: '48%' },
  payButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  payButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
