import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { supabase } from './Supabase';

// استيراد كافة الشاشات
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import BookingScreen from './BookingScreen';
import SupportScreen from './SupportScreen';
import ProfileScreen from './ProfileScreen';
import OwnerDashboardScreen from './OwnerDashboardScreen';

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('customer'); // 'customer' أو 'owner'
  const [currentTab, setCurrentTab] = useState('Home');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. جلب الجلسة الحالية عند فتح التطبيق (تجنب إعادة تسجيل الدخول)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. الاستماع لتغييرات حالة المصادقة (تسجيل دخول / خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole('customer');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // جلب دور المستخدم من جدول profiles
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (data && data.role) {
        setUserRole(data.role);
      } else {
        // إذا لم يوجد دور، نحدد الافتراضي بناءً على البريد أو customer
        setUserRole('customer');
      }
    } catch (err) {
      console.log('Error fetching role:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole('customer');
    setCurrentTab('Home');
    setIsRegistering(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </SafeAreaView>
    );
  }

  // 1. شاشات قبل تسجيل الدخول (دخول / تسجيل حساب)
  if (!session) {
    if (isRegistering) {
      return (
        <SafeAreaView style={styles.container}>
          <RegisterScreen 
            onRegisterSuccess={(user) => {
              setIsRegistering(false);
            }}
            onNavigateToLogin={() => setIsRegistering(false)}
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen
          onLogin={(role) => {
            setUserRole(role);
          }}
          onNavigateToRegister={() => setIsRegistering(true)}
        />
      </SafeAreaView>
    );
  }

  // 2. لوحة تحكم صاحب الملعب (Owner Dashboard)
  if (userRole === 'owner') {
    return (
      <SafeAreaView style={styles.container}>
        <OwnerDashboardScreen onLogout={handleLogout} />
      </SafeAreaView>
    );
  }

  // 3. شاشات الزبون العادي (Customer)
  const renderScreen = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen userRole={userRole} setActiveTab={setCurrentTab} />;
      case 'Booking':
        return <BookingScreen userRole={userRole} />;
      case 'Support':
        return <SupportScreen setActiveTab={setCurrentTab} />;
      case 'Profile':
        return <ProfileScreen userRole={userRole} onLogout={handleLogout} onBack={() => setCurrentTab('Home')} />;
      default:
        return <HomeScreen userRole={userRole} setActiveTab={setCurrentTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.content}>{renderScreen()}</View>
      
      {/* شريط التنقل السفلي الموحد للزبون */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Home')}>
          <Text style={styles.tabIcon}>🏟️</Text>
          <Text style={[styles.tabText, currentTab === 'Home' && styles.activeTabText]}>الرئيسية</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Booking')}>
          <Text style={styles.tabIcon}>📅</Text>
          <Text style={[styles.tabText, currentTab === 'Booking' && styles.activeTabText]}>الحجوزات</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Support')}>
          <Text style={styles.tabIcon}>🎧</Text>
          <Text style={[styles.tabText, currentTab === 'Support' && styles.activeTabText]}>الدعم</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Profile')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabText, currentTab === 'Profile' && styles.activeTabText]}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  bottomBar: {
    flexDirection: 'row-reverse',
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabIcon: { fontSize: 16 },
  tabText: { fontSize: 11, color: '#7f8c8d', fontWeight: '500', marginTop: 2 },
  activeTabText: { color: '#2ecc71', fontWeight: 'bold' },
});
