
/**
 * ملف مساعد للمصادقة JWT مع TinyMCE
 * يتضمن دوال لإنشاء توقيع JWT لاستخدامه مع TinyMCE
 */

// مفتاح خاص RSA من المفاتيح التي تم إنشاؤها
// تنبيه: في الإنتاج، لا تقم بتخزين المفتاح الخاص في الواجهة الأمامية
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

// مفتاح عام RSA من المفاتيح التي تم إنشاؤها
const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEAsCxNENs+qXCfaKHqGRfAY24RLwLdG5MmEPEekShrQS+CqAgs4rKx
jlb2f/tLd2uELhP5bI7jBGqByE9hhvfu9fW1Yc0xcQK3WK5bwSAa/nV1xa/Wi5an
6+cGx25kspDKGJRL6VN7DmgpE1wU9VwGqWsR4T3yfuuxmcLlQP3jQrmw76kBTkA3
Ucy+aug1/8ZXta53XHBz9w8oCRL3XGGuo4r6sV35FJOgQQUZLG8HEr3eRdGSotcA
GzHqhcelOitL6HoldafeLWU5p+JwIpZoBNzX+cFoT98ncUQZ/vyUMhVS3Uw46LZ7
xFZi7tkp8PHcSc/0vhhLlJri1b/x36zBIYmON84C7NfiMGV90HZZHR/y52FScNMH
KWa/XxSP89Vbl/f8fpjeEwgTINXow9E2O3hM6Z+RSGGzurI2fAWUlDf1vNaBZan+
bEca6Cuj2p7Z3yoi3gVOi1icuuCs1uDcf7CqcbbC6BY/vbRefKaz47HwIsl8OTBI
Q365oyWLmDnoUHnObfKBMibj+EKmQK93aO3LFzYS0j2MZtTzTnzIutOQDAHumL4c
GOAH9RO0z2dHRcIVIIexf8qIRsi6xukG4o3mh3EC44/Qp7aLJNcVC+SK5NouCF7F
5dDoWp4X4N8jDukmEiXZTwi/gQCk/RP/MXSliYkMR+Dom9d5D8N6i+MCAwEAAQ==
-----END RSA PUBLIC KEY-----`;

/**
 * إنشاء رمز JWT موقع باستخدام المفتاح الخاص
 * في الإنتاج، يجب أن تتم هذه العملية في الخادم وليس في المتصفح
 */
function generateTinyMCEJWT() {
  // ملاحظة: هذه نسخة مبسطة - في الإنتاج ستحتاج لاستخدام مكتبة لتوقيع JWT
  // مثل jsonwebtoken في Node.js
  
  // بناء الرأس
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  
  // الحصول على الوقت الحالي بالثواني
  const now = Math.floor(Date.now() / 1000);
  
  // بناء الحمولة
  const payload = {
    sub: "replit-user",           // معرف المستخدم
    iat: now,                     // وقت الإصدار
    exp: now + 3600,              // تاريخ انتهاء الصلاحية (ساعة واحدة من الآن)
    origin: window.location.origin // المنشأ المسموح به
  };
  
  // تشفير الرأس والحمولة بـ base64
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // التوقيع سيتم في الخادم في الإنتاج
  // هذا مجرد مثال وهمي للتوضيح
  
  // إرجاع رمز JWT بتنسيق header.payload.signature
  return `${encodedHeader}.${encodedPayload}.signature`;
}

// إضافة الدالة للنطاق العالمي
window.generateTinyMCEJWT = generateTinyMCEJWT;
