import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

import { supabase } from './Supabase';


// ======================================================
// T-BOOKET
// شاشة حجز الملعب
// ======================================================

export default function BookingScreen({
  stadium,
  onBack,
  onBookingSuccess,
}) {
  // ------------------------------------------------------
  // الأيام المتاحة للحجز
  // ------------------------------------------------------
  const availableDates = useMemo(() => {
    const dates = [];

    for (let i = 0; i < 7; i += 1) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + i);

      dates.push(date);
    }

    return dates;
  }, []);


  // ------------------------------------------------------
  // أوقات الحجز الحالية
  // ------------------------------------------------------
  const times = [
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
  ];


  // ------------------------------------------------------
  // التاريخ المحدد
  // ------------------------------------------------------
  const [selectedDate, setSelectedDate] = useState(
    availableDates[0]
  );


  // ------------------------------------------------------
  // الوقت المحدد
  // ------------------------------------------------------
  const [selectedTime, setSelectedTime] = useState(
    '18:00 - 19:00'
  );


  // ------------------------------------------------------
  // الأوقات المحجوزة
  // ------------------------------------------------------
  const [bookedTimes, setBookedTimes] = useState([]);


  // ------------------------------------------------------
  // حالة تحميل الأوقات
  // ------------------------------------------------------
  const [loadingTimes, setLoadingTimes] = useState(false);


  // ------------------------------------------------------
  // حالة إنشاء الحجز
  // ------------------------------------------------------
  const [bookingLoading, setBookingLoading] = useState(false);


  // ------------------------------------------------------
  // السعر
  // ------------------------------------------------------
  const stadiumPrice = useMemo(() => {
    const rawPrice = stadium?.price;

    if (typeof rawPrice === 'number') {
      return rawPrice;
    }

    if (typeof rawPrice === 'string') {
      const numericPrice = Number(
        rawPrice.replace(/[^\d]/g, '')
      );

      if (!Number.isNaN(numericPrice) && numericPrice > 0) {
        return numericPrice;
      }
    }

    return 30000;
  }, [stadium]);


  // ======================================================
  // تحويل التاريخ إلى YYYY-MM-DD
  // ======================================================

  const formatDateForDatabase = (date) => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  // ======================================================
  // اسم اليوم بالعربي
  // ======================================================

  const getDayName = (date) => {
    const days = [
      'الأحد',
      'الاثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];

    return days[date.getDay()];
  };


  // ======================================================
  // اسم الشهر بالعربي
  // ======================================================

  const getMonthName = (date) => {
    const months = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];

    return months[date.getMonth()];
  };


  // ======================================================
  // جلب الأوقات المحجوزة
  // ======================================================

  const fetchBookedTimes = async () => {
    if (!stadium?.id || !selectedDate) {
      return;
    }

    try {
      setLoadingTimes(true);

      const databaseDate =
        formatDateForDatabase(selectedDate);

      const { data, error } = await supabase
        .from('bookings')
        .select('time_slot, status')
        .eq('stadium_id', stadium.id)
        .eq('date', databaseDate);

      if (error) {
        console.log(
          'خطأ في جلب الأوقات المحجوزة:',
          error.message
        );

        setBookedTimes([]);
        return;
      }

      const occupiedTimes = (data || [])
        .filter((item) => {
          return (
            item.status !== 'cancelled' &&
            item.status !== 'rejected'
          );
        })
        .map((item) => item.time_slot)
        .filter(Boolean);

      setBookedTimes(occupiedTimes);
    } catch (error) {
      console.log(
        'خطأ غير متوقع:',
        error?.message || error
      );

      setBookedTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };


  // ======================================================
  // عند تغيير التاريخ
  // ======================================================

  useEffect(() => {
    fetchBookedTimes();
  }, [selectedDate, stadium?.id]);


  // ======================================================
  // تغيير التاريخ
  // ======================================================

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };


  // ======================================================
  // اختيار الوقت
  // ======================================================

  const handleSelectTime = (time) => {
    if (bookedTimes.includes(time)) {
      Alert.alert(
        'الوقت محجوز',
        'هذا الموعد محجوز مسبقًا، يرجى اختيار موعد آخر.'
      );

      return;
    }

    setSelectedTime(time);
  };


  // ======================================================
  // إنشاء الحجز
  // ======================================================

  const handleBooking = async () => {
    if (!stadium?.id) {
      Alert.alert(
        'خطأ',
        'لم يتم تحديد الملعب بشكل صحيح.'
      );

      return;
    }

    if (!selectedDate) {
      Alert.alert(
        'اختر التاريخ',
        'يرجى اختيار تاريخ الحجز.'
      );

      return;
    }

    if (!selectedTime) {
      Alert.alert(
        'اختر الوقت',
        'يرجى اختيار وقت الحجز.'
      );

      return;
    }

    if (bookedTimes.includes(selectedTime)) {
      Alert.alert(
        'الوقت محجوز',
        'هذا الموعد أصبح محجوزًا بالفعل. اختر موعدًا آخر.'
      );

      await fetchBookedTimes();

      return;
    }

    try {
      setBookingLoading(true);


      // --------------------------------------------------
      // الحصول على المستخدم الحالي
      // --------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        Alert.alert(
          'تسجيل الدخول مطلوب',
          'يجب تسجيل الدخول قبل إجراء الحجز.'
        );

        return;
      }


      // --------------------------------------------------
      // التاريخ بصيغة قاعدة البيانات
      // --------------------------------------------------

      const databaseDate =
        formatDateForDatabase(selectedDate);


      // --------------------------------------------------
      // فحص نهائي قبل إنشاء الحجز
      // --------------------------------------------------

      const {
        data: existingBooking,
        error: existingBookingError,
      } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('stadium_id', stadium.id)
        .eq('date', databaseDate)
        .eq('time_slot', selectedTime)
        .not('status', 'in', '("cancelled","rejected")')
        .limit(1);

      if (existingBookingError) {
        throw existingBookingError;
      }

      if (
        existingBooking &&
        existingBooking.length > 0
      ) {
        Alert.alert(
          'الوقت محجوز',
          'عذرًا، شخص آخر حجز هذا الوقت قبل إتمام طلبك.'
        );

        await fetchBookedTimes();

        return;
      }


      // --------------------------------------------------
      // إنشاء الحجز
      // --------------------------------------------------

      const bookingPayload = {
        stadium_id: stadium.id,
        stadium_name:
          stadium.name || 'ملعب غير محدد',
        date: databaseDate,
        time_slot: selectedTime,
        price: stadiumPrice,
        status: 'confirmed',
      };


      // --------------------------------------------------
      // إدخال الحجز في Supabase
      // --------------------------------------------------

      const {
        data: createdBooking,
        error: bookingError,
      } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select()
        .single();


      if (bookingError) {
        throw bookingError;
      }


      // --------------------------------------------------
      // تجهيز البيانات التي سترسل إلى App.js
      // --------------------------------------------------

      const finalBookingData = {
        ...createdBooking,

        stadium: {
          ...stadium,
        },

        time: selectedTime,

        date: databaseDate,

        price: stadiumPrice,
      };


      // --------------------------------------------------
      // تحديث الأوقات بعد الحجز
      // --------------------------------------------------

      setBookedTimes((previousTimes) => [
        ...previousTimes,
        selectedTime,
      ]);


      // --------------------------------------------------
      // إرسال الحجز إلى App.js
      // --------------------------------------------------

      if (onBookingSuccess) {
        onBookingSuccess(finalBookingData);
      }


    } catch (error) {
      console.log(
        'خطأ أثناء إنشاء الحجز:',
        error?.message || error
      );

      Alert.alert(
        'تعذر إتمام الحجز',
        error?.message ||
          'حدث خطأ أثناء إنشاء الحجز. حاول مرة أخرى.'
      );
    } finally {
      setBookingLoading(false);
    }
  };


  // ======================================================
  // حماية إذا لم يتم تحديد ملعب
  // ======================================================

  if (!stadium) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⚽</Text>

        <Text style={styles.emptyTitle}>
          لم يتم تحديد الملعب
        </Text>

        <Text style={styles.emptyText}>
          ارجع إلى الصفحة الرئيسية واختر الملعب الذي تريد
          حجزه.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>
            العودة للملاعب
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  // ======================================================
  // واجهة الشاشة
  // ======================================================

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ==============================================
            زر الرجوع
        ============================================== */}

        <TouchableOpacity
          style={styles.topBackButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={styles.topBackText}>
            ← العودة للملاعب
          </Text>
        </TouchableOpacity>


        {/* ==============================================
            صورة الملعب
        ============================================== */}

        <View style={styles.imageContainer}>

          <Image
            source={{
              uri:
                stadium.image ||
                'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900',
            }}
            style={styles.stadiumImage}
          />

          <View style={styles.imageOverlay}>
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>
                ⚽ حجز ملعب
              </Text>
            </View>
          </View>

        </View>


        {/* ==============================================
            معلومات الملعب
        ============================================== */}

        <View style={styles.stadiumInfoCard}>

          <Text style={styles.stadiumName}>
            {stadium.name || 'ملعب كرة قدم'}
          </Text>

          <Text style={styles.location}>
            📍 {stadium.location || 'الموقع غير محدد'}
          </Text>

          <View style={styles.infoDivider} />

          <View style={styles.priceRow}>

            <View>
              <Text style={styles.priceLabel}>
                سعر الحجز
              </Text>

              <Text style={styles.price}>
                {stadiumPrice.toLocaleString('ar-IQ')}
                <Text style={styles.currency}>
                  {' '}د.ع / ساعة
                </Text>
              </Text>
            </View>

            <View style={styles.ratingBox}>
              <Text style={styles.rating}>
                ⭐ {stadium.rating || 'جديد'}
              </Text>
            </View>

          </View>

        </View>


        {/* ==============================================
            اختيار التاريخ
        ============================================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            📅 اختر يوم الحجز
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >

            {availableDates.map((date) => {

              const isSelected =
                formatDateForDatabase(date) ===
                formatDateForDatabase(selectedDate);

              return (
                <TouchableOpacity
                  key={formatDateForDatabase(date)}
                  style={[
                    styles.dateCard,
                    isSelected &&
                      styles.selectedDateCard,
                  ]}
                  onPress={() =>
                    handleSelectDate(date)
                  }
                  activeOpacity={0.8}
                >

                  <Text
                    style={[
                      styles.dayName,
                      isSelected &&
                        styles.selectedDateText,
                    ]}
                  >
                    {getDayName(date)}
                  </Text>

                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected &&
                        styles.selectedDateText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>

                  <Text
                    style={[
                      styles.monthName,
                      isSelected &&
                        styles.selectedDateText,
                    ]}
                  >
                    {getMonthName(date)}
                  </Text>

                </TouchableOpacity>
              );
            })}

          </ScrollView>

        </View>


        {/* ==============================================
            اختيار الوقت
        ============================================== */}

        <View style={styles.section}>

          <View style={styles.timeTitleRow}>

            <Text style={styles.sectionTitle}>
              🕐 اختر وقت الحجز
            </Text>

            {loadingTimes && (
              <ActivityIndicator
                size="small"
                color="#16A34A"
              />
            )}

          </View>


          <View style={styles.timesGrid}>

            {times.map((time) => {

              const isBooked =
                bookedTimes.includes(time);

              const isSelected =
                selectedTime === time;

              return (
                <TouchableOpacity
                  key={time}
                  disabled={isBooked}
                  style={[
                    styles.timeButton,

                    isSelected &&
                      styles.selectedTimeButton,

                    isBooked &&
                      styles.bookedTimeButton,
                  ]}
                  onPress={() =>
                    handleSelectTime(time)
                  }
                  activeOpacity={0.8}
                >

                  <Text
                    style={[
                      styles.timeText,

                      isSelected &&
                        styles.selectedTimeText,

                      isBooked &&
                        styles.bookedTimeText,
                    ]}
                  >
                    {time}
                  </Text>

                  <Text
                    style={[
                      styles.timeStatus,

                      isSelected &&
                        styles.selectedTimeStatus,

                      isBooked &&
                        styles.bookedTimeStatus,
                    ]}
                  >
                    {isBooked
                      ? 'محجوز'
                      : isSelected
                        ? 'محدد'
                        : 'متاح'}
                  </Text>

                </TouchableOpacity>
              );
            })}

          </View>

        </View>


        {/* ==============================================
            ملخص الحجز
        ============================================== */}

        <View style={styles.summaryCard}>

          <Text style={styles.summaryTitle}>
            ملخص الحجز
          </Text>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              الملعب
            </Text>

            <Text
              style={styles.summaryValue}
              numberOfLines={1}
            >
              {stadium.name || 'ملعب كرة قدم'}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              التاريخ
            </Text>

            <Text style={styles.summaryValue}>
              {selectedDate
                ? `${selectedDate.getDate()} ${getMonthName(
                    selectedDate
                  )} ${selectedDate.getFullYear()}`
                : '-'}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              الوقت
            </Text>

            <Text style={styles.summaryValue}>
              {selectedTime || 'لم يتم الاختيار'}
            </Text>

          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>

            <Text style={styles.totalLabel}>
              الإجمالي
            </Text>

            <Text style={styles.totalPrice}>
              {stadiumPrice.toLocaleString('ar-IQ')}
              {' '}د.ع
            </Text>

          </View>

        </View>


        {/* ==============================================
            ملاحظة
        ============================================== */}

        <View style={styles.notice}>

          <Text style={styles.noticeIcon}>
            ℹ️
          </Text>

          <Text style={styles.noticeText}>
            سيتم تثبيت الحجز بعد التحقق من توفر الموعد.
            الدفع الإلكتروني سيتم ربطه لاحقًا ببوابة دفع
            معتمدة.
          </Text>

        </View>


        {/* ==============================================
            زر الحجز
        ============================================== */}

        <TouchableOpacity
          style={[
            styles.bookingButton,

            (bookingLoading ||
              !selectedTime ||
              loadingTimes) &&
              styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={
            bookingLoading ||
            !selectedTime ||
            loadingTimes
          }
          activeOpacity={0.85}
        >

          {bookingLoading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.bookingButtonText}>
              تأكيد حجز الملعب ⚽
            </Text>
          )}

        </TouchableOpacity>


        <View style={styles.bottomSpace} />

      </ScrollView>

    </View>
  );
}


// ======================================================
// التصميم
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  // ----------------------------------------------------
  // الرجوع
  // ----------------------------------------------------

  topBackButton: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  topBackText: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: '700',
  },

  // ----------------------------------------------------
  // صورة الملعب
  // ----------------------------------------------------

  imageContainer: {
    width: '100%',
    height: 210,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },

  stadiumImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  availableBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  availableBadgeText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },

  // ----------------------------------------------------
  // معلومات الملعب
  // ----------------------------------------------------

  stadiumInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  stadiumName: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 7,
  },

  location: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'right',
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 3,
  },

  price: {
    color: '#16A34A',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'right',
  },

  currency: {
    fontSize: 12,
    fontWeight: '700',
  },

  ratingBox: {
    backgroundColor: '#FFF7ED',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 12,
  },

  rating: {
    color: '#C2410C',
    fontSize: 13,
    fontWeight: '800',
  },

  // ----------------------------------------------------
  // الأقسام
  // ----------------------------------------------------

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 12,
  },

  // ----------------------------------------------------
  // التاريخ
  // ----------------------------------------------------

  datesContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
    gap: 9,
  },

  dateCard: {
    width: 78,
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
  },

  selectedDateCard: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  dayName: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },

  dayNumber: {
    color: '#0F172A',
    fontSize: 23,
    fontWeight: '900',
  },

  monthName: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },

  selectedDateText: {
    color: '#FFFFFF',
  },

  // ----------------------------------------------------
  // الأوقات
  // ----------------------------------------------------

  timeTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  timeButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
  },

  selectedTimeButton: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  bookedTimeButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },

  timeText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },

  selectedTimeText: {
    color: '#FFFFFF',
  },

  bookedTimeText: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },

  timeStatus: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },

  selectedTimeStatus: {
    color: '#DCFCE7',
  },

  bookedTimeStatus: {
    color: '#94A3B8',
  },

  // ----------------------------------------------------
  // الملخص
  // ----------------------------------------------------

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  summaryTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  summaryLabel: {
    color: '#64748B',
    fontSize: 13,
  },

  summaryValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 7,
  },

  totalRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },

  totalPrice: {
    color: '#16A34A',
    fontSize: 19,
    fontWeight: '900',
  },

  // ----------------------------------------------------
  // الملاحظة
  // ----------------------------------------------------

  notice: {
    flexDirection: 'row-reverse',
    backgroundColor: '#EFF6FF',
    borderRadius: 15,
    padding: 13,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  noticeIcon: {
    fontSize: 16,
    marginLeft: 8,
  },

  noticeText: {
    flex: 1,
    color: '#475569',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'right',
  },

  // ----------------------------------------------------
  // زر الحجز
  // ----------------------------------------------------

  bookingButton: {
    backgroundColor: '#16A34A',
    minHeight: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    elevation: 3,
  },

  disabledButton: {
    backgroundColor: '#94A3B8',
  },

  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  // ----------------------------------------------------
  // حالة عدم وجود ملعب
  // ----------------------------------------------------

  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 22,
  },

  backButton: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 25,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  bottomSpace: {
    height: 20,
  },
});
