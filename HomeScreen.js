import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';

const STADIUMS = [
  {
    id: '1',
    name: 'ملعب الأسطورة الخماسي',
    location: 'بغداد - الجادرية',
    price: '30,000 د.ع / ساعة',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
  },
  {
    id: '2',
    name: 'ملعب الملوك الدولي',
    location: 'بغداد - المنصور',
    price: '40,000 د.ع / ساعة',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500',
  },
  {
    id: '3',
    name: 'ملعب النجوم الخماسي',
    location: 'بغداد - الكرادة',
    price: '25,000 د.ع / ساعة',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500',
  },
];

export default function HomeScreen({ onSelectStadium, onOpenRating, activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStadiums = STADIUMS.filter(
    (stadium) =>
      stadium.name.includes(searchQuery) || stadium.location.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>الملاعب المتاحة للحجز ⚽</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن ملعب أو منطقة..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={filteredStadiums}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.9}
              onPress={() => {
                if (onSelectStadium) onSelectStadium(item);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <TouchableOpacity onPress={() => {
                    if (onOpenRating) onOpenRating(item);
                  }}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* الشريط السفلي الموحد (بدون تكرار وبدون حجوزات عامة) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab && setActiveTab('support')}>
          <Text style={styles.navIcon}>🎧</Text>
          <Text style={[styles.navText, activeTab === 'support' && styles.activeNavText]}>الدعم</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab && setActiveTab('profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>حسابي</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab && setActiveTab('home')}>
          <Text style={styles.navIcon}>🏟️</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>الرئيسية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerContainer: { padding: 16, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginBottom: 12, color: '#0f172a' },
  searchBox: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, height: 40, textAlign: 'right', color: '#0f172a' },
  searchIcon: { fontSize: 16, marginLeft: 8 },
  listWrapper: { flex: 1 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderBottomWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  image: { width: '100%', height: 140 },
  cardBody: { padding: 12 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  rating: { fontSize: 12, color: '#d97706', fontWeight: 'bold', backgroundColor: '#fef3c7', padding: 4, borderRadius: 6 },
  location: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 4 },
  price: { fontSize: 14, color: '#16a34a', fontWeight: 'bold', textAlign: 'right', marginTop: 6 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffffff', paddingVertical: 8, borderTopWidth: 1, borderColor: '#e2e8f0' },
  navItem: { alignItems: 'center', flex: 1 },
  navIcon: { fontSize: 18 },
  navText: { fontSize: 10, color: '#64748b', marginTop: 2 },
  activeNavText: { color: '#2563eb', fontWeight: 'bold' },
});
