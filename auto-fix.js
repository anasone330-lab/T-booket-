const fs = require('fs');
const path = require('path');

console.log('🔍 [T-booket Local AI]: جاري فحص ملفات المشروع محلياً...');

// قائمة الملفات الأساسية وهيكلتها لضمان عدم وجود أي نقص
const projectFiles = [
  {
    path: 'App.js',
    content: `import React from 'react';\nimport { View, Text, StyleSheet } from 'react-native';\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.text}>⚽ T-booket Stadium Booking App Active</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },\n  text: { fontSize: 18, fontWeight: 'bold', color: '#333' }\n});`
  },
  {
    path: 'Supabase.js',
    content: `import { createClient } from '@supabase/supabase-js';\n\nconst SUPABASE_URL = 'ضع_رابط_قاعدة_البيانات_هنا';\nconst SUPABASE_ANON_KEY = 'ضع_مفتاح_الـ_anon_هنا';\n\nexport const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);`
  }
];

// فحص وإنشاء الملفات الناقصة
projectFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content, 'utf8');
    console.log(`✨ [تم الإنشاء تلقائياً]: ${file.path}`);
  } else {
    console.log(`✅ [ملف موجود وسليم]: ${file.path}`);
  }
});

// فحص مجلد الأندرويد الخام
const androidDir = path.join(__dirname, 'android');
if (!fs.existsSync(androidDir)) {
  console.log('⚠️ مجلد android غير موجود محلياً.');
} else {
  console.log('✅ هيكلة الأندرويد الخام متوفرة ومحلية.');
}

console.log('🎉 تمت عملية الفحص والأتمتة المحلية بنجاح تام!');
