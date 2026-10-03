const fs = require('fs');
const path = require('path');

console.log('🔍 [T-booket Smart Automation]: جاري فحص هيكل المشروع...');

// 1. فحص وتأمين الملفات الأساسية والشاشات
const essentialFiles = [
  {
    path: 'App.js',
    content: `import React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.text}>⚽ T-booket Ready & Active</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },\n  text: { fontSize: 18, fontWeight: 'bold', color: '#333' }\n});`
  },
  {
    path: 'Supabase.js',
    content: `import { createClient } from '@supabase/supabase-js';\n\nconst SUPABASE_URL = 'YOUR_SUPABASE_URL';\nconst SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';\n\nexport const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);`
  }
];

essentialFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content, 'utf8');
    console.log(`✨ [تم إنشاء الملف تلقائياً]: ${file.path}`);
  } else {
    console.log(`✅ [الملف موجود وسليم]: ${file.path}`);
  }
});

// 2. فحص مجلد أندرويد
const androidDir = path.join(__dirname, 'android');
if (!fs.existsSync(androidDir)) {
  console.log('⚠️ تنبيه: مجلد android غير موجود في المستودع الرئيسي.');
} else {
  console.log('✅ هيكلة الأندرويد متوفرة بالكامل.');
}

console.log('🎉 تمت عملية الفحص الذكي بنجاح!');
