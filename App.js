import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
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
  // ====================================================
  // حالة تشغيل التطبيق
  // ====================================================

  const [appLoading, setAppLoading] = useState(true);

  // ====================================================
  // حالة تسجيل الدخول
  // ====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ====================================================
  // نوع المستخدم
  // customer = زبون
  // owner = صاحب ملعب
  // ====================================================

  const [userRole, setUserRole] = useState('customer');

  // ====================================================
  // الشاشة الحالية
  // ====================================================

  const [currentScreen, setCurrentScreen] = useState('login');

  // ====================================================
  // التبويب السفلي الحالي
  // ====================================================

  const [activeTab, setActiveTab] = useState('home');

  // ====================================================
  // الملعب المحدد للحجز
  // ====================================================

  const [selectedStadium, setSelectedStadium] = useState(null);

  // ====================================================
  // بيانات الحجز الأخير
  // ====================================================

  const [bookingData, setBookingData] = useState(null);

  // ====================================================
  // الملعب الذي يريد المستخدم مشاهدة تقييماته
  // ====================================================

  const [ratingStadium, setRatingStadium] = useState(null);

  // ====================================================
  // الحجوزات
  // ====================================================

  const [bookings, setBookings] = useState([]);


  // ====================================================
  // تشغيل التطبيق
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        if (session?.user) {
          const role = await loadUserRole(session.user.id);

          if (!mounted) {
            return;
          }

          setIsLoggedIn(true);
          setActiveTab('home');

          if (role === 'owner') {
            setCurrentScreen('owner');
          } else {
            setCurrentScreen('home');
          }
        } else {
          setIsLoggedIn(false);
          setUserRole('customer');
          setCurrentScreen('login');
        }
      } catch (error) {
        console.log(
          'خطأ أثناء تشغيل التطبيق:',
          error?.message || error
        );

        if (mounted) {
          setIsLoggedIn(false);
          setUserRole('customer');
          setCurrentScreen('login');
        }
      } finally {
        if (mounted) {
          setAppLoading(false);
        }
      }
    };

    initializeApp();

    // ==================================================
    // مراقبة حالة تسجيل الدخول
    // ==================================================

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          return;
        }

        if (event === 'SIGNED_OUT' || !session?.user) {
          setIsLoggedIn(false);
          setUserRole('customer');
          setCurrentScreen('login');
          setActiveTab('home');
          setSelectedStadium(null);
          setBookingData(null);
          setBookings([]);
        }
      }
    );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);


  // ====================================================
  // جلب نوع المستخدم من profiles
  // ====================================================

  const loadUserRole = async (userId) => {
    try {
      if (!userId) {
        setUserRole('customer');
        return 'customer';
      }

      const {
        data,
        error,
      } = await supabase
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
        return 'customer';
      }

      const role =
        data?.role === 'owner'
          ? 'owner'
          : 'customer';

      setUserRole(role);

      return role;
    } catch (error) {
      console.log(
        'خطأ غير متوقع في نوع المستخدم:',
        error?.message || error
      );

      setUserRole('customer');

      return 'customer';
    }
  };


  // ====================================================
  // تسجيل الدخول
  // ====================================================

  const handleLogin = async (roleFromLogin) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        setIsLoggedIn(false);
        setCurrentScreen('login');
        return;
      }

      // -----------------------------------------------
      // الدور الحقيقي يؤخذ من profiles
      // وليس من اسم الإيميل
      // -----------------------------------------------

      const realRole = await loadUserRole(user.id);

      setIsLoggedIn(true);
      setActiveTab('home');

      if (realRole === 'owner') {
        setCurrentScreen('owner');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.log(
        'خطأ بعد تسجيل الدخول:',
        error?.message || error
      );

      // -----------------------------------------------
      // لا نعتمد على roleFromLogin كصلاحية نهائية
      // -----------------------------------------------

      const fallbackRole =
        roleFromLogin === 'owner'
          ? 'owner'
          : 'customer';

      setUserRole(fallbackRole);
      setIsLoggedIn(true);
      setActiveTab('home');

      if (fallbackRole === 'owner') {
        setCurrentScreen('owner');
      } else {
        setCurrentScreen('home');
      }
    }
  };


  // ====================================================
  // نجاح إنشاء حساب
  // ====================================================

  const handleRegisterSuccess = () => {
    setCurrentScreen('login');
  };


  // ====================================================
  // اختيار ملعب
  // ====================================================

  const handleSelectStadium = (stadium) => {
    if (!stadium) {
      return;
    }

    setSelectedStadium(stadium);
    setCurrentScreen('booking');
  };


  // ====================================================
  // فتح تقييمات الملعب
  // ====================================================

  const handleOpenRating = (stadium) => {
    if (!stadium) {
      return;
    }

    setRatingStadium(stadium);
    setCurrentScreen('rating');
  };


  // ====================================================
  // نجاح الحجز
  // ====================================================

  // مهم:
  // BookingScreen يرسل بيانات الحجز هنا.
  // النسخة القديمة كانت تتجاهل البيانات.
  // الآن نخزن الحجز الحقيقي حتى تعرضه شاشة التأكيد.

  const handleBookingSuccess = (createdBooking) => {
    if (!createdBooking) {
      return;
    }

    setBookingData(createdBooking);

    // إضافة الحجز إلى القائمة المحلية
    // حتى يظهر مباشرة في "حجوزاتي".

    setBookings((previousBookings) => {
      const bookingId = createdBooking?.id;

      if (
        bookingId &&
        previousBookings.some(
          (booking) => booking.id === bookingId
        )
      ) {
        return previousBookings;
      }

      return [
        createdBooking,
        ...previousBookings,
      ];
    });

    setCurrentScreen('confirmation');
  };


  // ====================================================
  // العودة للرئيسية
  // ====================================================

  const goHome = () => {
    setActiveTab('home');
    setCurrentScreen('home');
  };


  // ====================================================
  // تغيير التبويب السفلي
  // ====================================================

  const handleChangeTab = (tab) => {
    setActiveTab(tab);

    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;

      case 'profile':
        setCurrentScreen('profile');
        break;

      case 'support':
        setCurrentScreen('support');
        break;

      case 'bookings':
        setCurrentScreen('bookings');
        break;

      default:
        setCurrentScreen('home');
        setActiveTab('home');
        break;
    }
  };


  // ====================================================
  // تسجيل الخروج
  // ====================================================

  const handleLogout = async () => {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.log(
          'خطأ أثناء تسجيل الخروج:',
          error.message
        );
      }
    } catch (error) {
      console.log(
        'خطأ غير متوقع أثناء تسجيل الخروج:',
        error?.message || error
      );
    } finally {
      setIsLoggedIn(false);
      setUserRole('customer');
      setCurrentScreen('login');
      setActiveTab('home');
      setSelectedStadium(null);
      setBookingData(null);
      setRatingStadium(null);
      setBookings([]);
    }
  };


  // ====================================================
  // شاشة التحميل
  // ====================================================

  if (appLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <View style={styles.loadingContent}>
          <ActivityIndicator
            size="large"
            color="#16A34A"
          />
        </View>
      </SafeAreaView>
    );
  }


  // ====================================================
  // تسجيل الدخول
  // ====================================================

  if (
    !isLoggedIn &&
    currentScreen === 'login'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() =>
            setCurrentScreen('register')
          }
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // إنشاء حساب
  // ====================================================

  if (
    !isLoggedIn &&
    currentScreen === 'register'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <RegisterScreen
          onRegisterSuccess={
            handleRegisterSuccess
          }
          onNavigateToLogin={() =>
            setCurrentScreen('login')
          }
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // حماية إضافية
  // ====================================================

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() =>
            setCurrentScreen('register')
          }
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // لوحة صاحب الملعب
  // ====================================================

  if (
    currentScreen === 'owner' &&
    userRole === 'owner'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <OwnerDashboardScreen
          bookings={bookings}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // حماية:
  // المستخدم العادي لا يدخل لوحة المالك
  // ====================================================

  if (
    currentScreen === 'owner' &&
    userRole !== 'owner'
  ) {
    setCurrentScreen('home');
  }


  // ====================================================
  // الرئيسية
  // ====================================================

  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <HomeScreen
          onSelectStadium={
            handleSelectStadium
          }
          onOpenRating={
            handleOpenRating
          }
          activeTab={activeTab}
          setActiveTab={handleChangeTab}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // شاشة الحجز
  // ====================================================

  if (currentScreen === 'booking') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <BookingScreen
          stadium={selectedStadium}
          onBack={goHome}
          onBookingSuccess={
            handleBookingSuccess
          }
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // شاشة تأكيد الحجز
  // ====================================================

  if (
    currentScreen === 'confirmation'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <ConfirmationScreen
          bookingData={bookingData}
          onHome={goHome}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // حجوزاتي
  // ====================================================

  if (
    currentScreen === 'bookings'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <BookingsListScreen
          bookings={bookings}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // الملف الشخصي
  // ====================================================

  if (
    currentScreen === 'profile'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <ProfileScreen
          onLogout={handleLogout}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // الدعم الفني
  // ====================================================

  if (
    currentScreen === 'support'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <SupportScreen
          setActiveTab={handleChangeTab}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // التقييمات
  // ====================================================

  if (
    currentScreen === 'rating'
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <RatingScreen
          stadium={ratingStadium}
          onBack={goHome}
        />
      </SafeAreaView>
    );
  }


  // ====================================================
  // إذا حصلت حالة غير معروفة
  // ====================================================

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <View style={styles.loadingContent}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />
      </View>
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
  },

  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
