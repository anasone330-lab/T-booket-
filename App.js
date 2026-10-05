import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
} from 'react-native';

import { supabase } from './Supabase';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import BookingScreen from './BookingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import BookingsListScreen from './BookingsListScreen';
import ProfileScreen from './ProfileScreen';
import SupportScreen from './SupportScreen';
import RatingScreen from './RatingScreen';
import OwnerDashboardScreen from './OwnerDashboardScreen';


// ======================================================
// T-BOOKET
// التطبيق الرئيسي
// ======================================================

export default function App() {
  // ------------------------------------------------------
  // حالة تحميل التطبيق
  // ------------------------------------------------------
  const [appLoading, setAppLoading] = useState(true);

  // ------------------------------------------------------
  // حالة تسجيل الدخول
  // ------------------------------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ------------------------------------------------------
  // نوع المستخدم
  // customer = زبون
  // owner = صاحب ملعب
  // ------------------------------------------------------
  const [userRole, setUserRole] = useState('customer');

  // ------------------------------------------------------
  // الشاشة الحالية
  // ------------------------------------------------------
  const [currentScreen, setCurrentScreen] = useState('login');

  // ------------------------------------------------------
  // التبويب الحالي داخل التطبيق
  // ------------------------------------------------------
  const [activeTab, setActiveTab] = useState('home');

  // ------------------------------------------------------
  // الملعب الذي اختاره المستخدم
  // ------------------------------------------------------
  const [selectedStadium, setSelectedStadium] = useState(null);

  // ------------------------------------------------------
  // بيانات الحجز الأخير
  // ------------------------------------------------------
  const [bookingData, setBookingData] = useState(null);

  // ------------------------------------------------------
  // الملعب الذي يريد المستخدم مشاهدة تقييماته
  // ------------------------------------------------------
  const [ratingStadium, setRatingStadium] = useState(null);

  // ------------------------------------------------------
  // الحجوزات
  // سيتم ربطها بقاعدة البيانات بشكل كامل في مرحلة لاحقة
  // ------------------------------------------------------
  const [bookings, setBookings] = useState([]);


  // ======================================================
  // تشغيل التطبيق
  // ======================================================

  useEffect(() => {
    checkExistingSession();
  }, []);


  // ======================================================
  // فحص جلسة المستخدم الموجودة مسبقاً
  // ======================================================

  const checkExistingSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserRole(session.user.id);

        setIsLoggedIn(true);
        setCurrentScreen('home');
        setActiveTab('home');
      } else {
        setIsLoggedIn(false);
        setCurrentScreen('login');
      }
    } catch (error) {
      console.log(
        'خطأ أثناء فحص جلسة المستخدم:',
        error?.message || error
      );

      setIsLoggedIn(false);
      setCurrentScreen('login');
    } finally {
      setAppLoading(false);
    }
  };


  // ======================================================
  // جلب نوع المستخدم من profiles
  // ======================================================

  const loadUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.log(
          'خطأ في جلب نوع المستخدم:',
          error.message
        );

        setUserRole('customer');
        return;
      }

      if (data?.role === 'owner') {
        setUserRole('owner');
      } else {
        setUserRole('customer');
      }
    } catch (error) {
      console.log(
        'خطأ غير متوقع في نوع المستخدم:',
        error?.message || error
      );

      setUserRole('customer');
    }
  };


  // ======================================================
  // تسجيل الدخول
  // ======================================================

  const handleLogin = async (roleFromLogin) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await loadUserRole(user.id);
      } else {
        setUserRole(
          roleFromLogin === 'owner'
            ? 'owner'
            : 'customer'
        );
      }

      setIsLoggedIn(true);
      setActiveTab('home');

      if (roleFromLogin === 'owner') {
        setCurrentScreen('owner');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.log(
        'خطأ بعد تسجيل الدخول:',
        error?.message || error
      );

      setUserRole(
        roleFromLogin === 'owner'
          ? 'owner'
          : 'customer'
      );

      setIsLoggedIn(true);
      setCurrentScreen(
        roleFromLogin === 'owner'
          ? 'owner'
          : 'home'
      );
    }
  };


  // ======================================================
  // تسجيل حساب جديد
  // ======================================================

  const handleRegisterSuccess = () => {
    setCurrentScreen('login');
  };


  // ======================================================
  // فتح الملعب
  // ======================================================

  const handleSelectStadium = (stadium) => {
    setSelectedStadium(stadium);
    setCurrentScreen('booking');
  };


  // ======================================================
  // فتح التقييمات
  // ======================================================

  const handleOpenRating = (stadium) => {
    setRatingStadium(stadium);
    setCurrentScreen('rating');
  };


  // ======================================================
  // نجاح الحجز
  // ======================================================

  const handleBookingSuccess = () => {
    setCurrentScreen('confirmation');
  };


  // ======================================================
  // العودة للرئيسية
  // ======================================================

  const goHome = () => {
    setActiveTab('home');
    setCurrentScreen('home');
  };


  // ======================================================
  // تغيير التبويب السفلي
  // ======================================================

  const handleChangeTab = (tab) => {
    setActiveTab(tab);

    if (tab === 'home') {
      setCurrentScreen('home');
      return;
    }

    if (tab === 'profile') {
      setCurrentScreen('profile');
      return;
    }

    if (tab === 'support') {
      setCurrentScreen('support');
      return;
    }

    if (tab === 'bookings') {
      setCurrentScreen('bookings');
      return;
    }
  };


  // ======================================================
  // تسجيل الخروج
  // ======================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log(
        'خطأ أثناء تسجيل الخروج:',
        error?.message || error
      );
    }

    setIsLoggedIn(false);
    setUserRole('customer');
    setCurrentScreen('login');
    setActiveTab('home');
    setSelectedStadium(null);
    setBookingData(null);
  };


  // ======================================================
  // شاشة التحميل الأولى
  // ======================================================

  if (appLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // تسجيل الدخول
  // ======================================================

  if (!isLoggedIn && currentScreen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() =>
            setCurrentScreen('register')
          }
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // إنشاء حساب
  // ======================================================

  if (!isLoggedIn && currentScreen === 'register') {
    return (
      <SafeAreaView style={styles.container}>
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() =>
            setCurrentScreen('login')
          }
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // لوحة صاحب الملعب
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'owner'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <OwnerDashboardScreen
          bookings={bookings}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // الرئيسية
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'home'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <HomeScreen
          onSelectStadium={handleSelectStadium}
          onOpenRating={handleOpenRating}
          activeTab={activeTab}
          setActiveTab={handleChangeTab}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // شاشة الحجز
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'booking'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <BookingScreen
          stadium={selectedStadium}
          onBack={goHome}
          onBookingSuccess={handleBookingSuccess}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // تأكيد الحجز
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'confirmation'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <ConfirmationScreen
          bookingData={bookingData}
          onHome={goHome}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // حجوزاتي
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'bookings'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <BookingsListScreen
          bookings={bookings}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // الملف الشخصي
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'profile'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileScreen
          onLogout={handleLogout}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // الدعم الفني
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'support'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <SupportScreen
          setActiveTab={handleChangeTab}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // التقييمات
  // ======================================================

  if (
    isLoggedIn &&
    currentScreen === 'rating'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <RatingScreen
          stadium={ratingStadium}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ======================================================
  // حماية إضافية
  // ======================================================

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color="#16A34A"
      />
    </SafeAreaView>
  );
}


// ======================================================
// التصميم العام
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
