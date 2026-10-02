import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from './Supabase';

export default function ProfileScreen({ onLogout, onBack }) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
          setBio(data.bio || '');
        }
      }
    } catch (error) {
      console.log('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        update({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('خطأ', error.message);
      } else {
        Alert.alert('نجاح', 'تم تحديث البيانات الشخصية بنجاح!');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء التحديث');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>الصفحة الشخصية 👤</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>الاسم الكامل:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="أدخل الاسم الكامل"
        />

        <Text style={styles.label}>رقم الهاتف:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardPhone="phone-pad"
          placeholder="أدخل رقم الهاتف"
        />

        <Text style={styles.label}>نبذة مختصرة (Bio):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="اكتب نبذة عنك..."
          multiline
        />

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          <Text style={styles.saveButtonText}>{updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { paddingBottom: 30 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', color: '#0f172a' },
  profileCard: { backgroundColor: '#ffffff', padding: 20, alignItems: 'center', marginTop: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  userEmail: { fontSize: 13, color: '#64748b' },
  formSection: { padding: 16, backgroundColor: '#ffffff', marginTop: 12, marginHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', color: '#334155', marginBottom: 6 },
  input: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, textAlign: 'right', marginBottom: 14, color: '#0f172a' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  saveButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  logoutButton: { backgroundColor: '#ef4444', padding: 14, marginHorizontal: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  backButton: { padding: 14, marginHorizontal: 16, alignItems: 'center', marginTop: 10 },
  backText: { color: '#2563eb', fontWeight: 'bold', fontSize: 14 }
});
