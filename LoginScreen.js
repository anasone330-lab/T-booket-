import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// نمرر onLogin و onNavigateToRegister كـ props
export default function LoginScreen({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // نحدد الدور: إذا كان الإيميل يحتوي على كلمة owner يعتبر مالك ملعب، وإلا فهو زبون عادي
    const role = email.toLowerCase().includes('owner') ? 'owner' : 'customer';
    
    // استدعاء دالة الدخول وتمرين الدور
    if (onLogin) {
      onLogin(role);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>

      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>دخول</Text>
      </TouchableOpacity>

      {/* زر للانتقال لشاشة إنشاء حساب جديد */}
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => onNavigateToRegister && onNavigateToRegister()}
      >
        <Text style={styles.linkText}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#3498db', fontSize: 14 },
});
