import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { testConnection } from './Supabase';

export default function App() {
  useEffect(() => {
    // اختبار الاتصال بقاعدة البيانات أول ما يشتغل التطبيق
    testConnection();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>مرحباً بك في تطبيق T-booket ⚽</Text>
      <Text style={styles.subText}>جاري الاتصال بقاعدة البيانات...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
});
