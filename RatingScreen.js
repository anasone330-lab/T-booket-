import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';

export default function RatingScreen({ stadiumName, onBack }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { id: '1', userName: 'حيدر الكرخي', rating: 5, comment: 'ملعب ممتاز والإنارة جداً ممتازة!' },
    { id: '2', userName: 'مصطفى العبيدي', rating: 4, comment: 'أرضية العشب الطبيعي ناعمة وجيدة.' }
  ]);

  const handleAddReview = () => {
    if (!review.trim()) return;
    const newRev = {
      id: Date.now().toString(),
      userName: 'لاعب جديد',
      rating: rating,
      comment: review
    };
    setReviewsList([newRev, ...reviewsList]);
    setReview('');
    alert('تم إضافة تقييمك بنجاح! شكراً لمشاركتك.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تقييمات {stadiumName} ⭐</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* إضافة تقييم جديد */}
        <View style={styles.addCard}>
          <Text style={styles.cardTitle}>أضف تقييمك للملعب:</Text>
          
          {/* نجوم التقييم */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={styles.starIcon}>{star <= rating ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="اكتب تعليقك هنا..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={review}
            onChangeText={setReview}
          />

          <TouchableOpacity
            style={[styles.btn, !review.trim() && styles.disabledBtn]}
            disabled={!review.trim()}
            onPress={handleAddReview}
          >
            <Text style={styles.btnText}>إرسال التقييم</Text>
          </TouchableOpacity>
        </View>

        {/* قائمة التعليقات والتقييمات */}
        <Text style={styles.sectionTitle}>آراء اللاعبين 💬</Text>
        {reviewsList.map((item) => (
          <View key={item.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.starsText}>{'⭐'.repeat(item.rating)}</Text>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: '#0f172a' },
  content: { padding: 16 },
  addCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#cbd5e1' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', textAlign: 'right', marginBottom: 10 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, gap: 8 },
  starIcon: { fontSize: 28 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, textAlign: 'right', height: 80, textAlignVertical: 'top', marginBottom: 12 },
  btn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 8, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#cbd5e1' },
  btnText: { color: '#ffffff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', textAlign: 'right', marginBottom: 10 },
  reviewItem: { backgroundColor: '#ffffff', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  reviewHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 4 },
  userName: { fontWeight: 'bold', color: '#1e293b', fontSize: 13 },
  starsText: { fontSize: 12 },
  commentText: { color: '#475569', fontSize: 13, textAlign: 'right' },
  backButton: { backgroundColor: '#2563eb', padding: 12, margin: 12, borderRadius: 8, alignItems: 'center' },
  backText: { color: '#ffffff', fontWeight: 'bold' }
});
