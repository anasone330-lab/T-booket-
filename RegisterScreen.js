import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from './Supabase';

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    
    // إنشاء حساب في نظام المصادقة Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setLoading(false);
      alert('خطأ في إنشاء الحساب: ' + error.message);
      return;
    }

    // حفظ بيانات الحساب في جدول profiles
    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          name: name.trim(),
          phone: phone.trim(),
          role: 'user',
        },
      ]);

      setLoading(false);

      if (profileError) {
        console.log('Profile Error:', profileError.message);
      }

      alert('تم إنشاء الحساب بنجاح!');
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>⚽ T booket</Text>
          <Text style={styles.subtitleText}>إنشاء حساب جديد</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="الاسم الكامل"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>إنشاء الحساب</Text>
            )}
          </TouchableOpacity>

          {onNavigateToLogin && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={onNavigateToLogin}
            >
              <Text style={styles.linkText}>
                لديك حساب بالفعل؟ تسجيل الدخول
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e2e' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#4caf50' },
  subtitleText: { fontSize: 16, color: '#ccc', marginTop: 5 },
  formContainer: { backgroundColor: '#2b2b3d', padding: 20, borderRadius: 15 },
  input: { backgroundColor: '#3b3b4f', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#4caf50', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#4caf50', fontSize: 14 },
});
