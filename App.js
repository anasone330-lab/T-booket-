import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';

// استيراد كافة الشاشات
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import BookingScreen from './BookingScreen';
import SupportScreen from './SupportScreen';
import ProfileScreen from './ProfileScreen';
import OwnerDashboardScreen from './OwnerDashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('customer'); // 'customer' أو 'owner'
  const [currentTab, setCurrentTab] = useState('Home');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('customer');
    setCurrentTab('Home');
    setIsRegistering(false);
  };

  // 1. شاشات قبل تسجيل الدخول (دخول / تسجيل حساب)
  if (!isLoggedIn) {
    if (isRegistering) {
      return (
        <SafeAreaView style={styles.container}>
          <RegisterScreen 
            onRegisterSuccess={() => setIsRegistering(false)}
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
            setIsLoggedIn(true);
          }}
          onNavigateToRegister={() => setIsRegistering(true)}
        />
      </SafeAreaView>
    );
  }

  // 2. لوحة تحكم صاحب الملعب (Owner)
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
        return <HomeScreen userRole={userRole} />;
      case 'Booking':
        return <BookingScreen userRole={userRole} />;
      case 'Support':
        return <SupportScreen />;
      case 'Profile':
        return <ProfileScreen userRole={userRole} onLogout={handleLogout} />;
      default:
        return <HomeScreen userRole={userRole} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.content}>{renderScreen()}</View>
      
      {/* شريط التنقل السفلي للزبون */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Home')}>
          <Text style={[styles.tabText, currentTab === 'Home' && styles.activeTabText]}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Booking')}>
          <Text style={[styles.tabText, currentTab === 'Booking' && styles.activeTabText]}>الحجوزات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Support')}>
          <Text style={[styles.tabText, currentTab === 'Support' && styles.activeTabText]}>الدعم</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Profile')}>
          <Text style={[styles.tabText, currentTab === 'Profile' && styles.activeTabText]}>حسابي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  tabText: { fontSize: 14, color: '#7f8c8d', fontWeight: '500' },
  activeTabText: { color: '#2ecc71', fontWeight: 'bold' },
});
