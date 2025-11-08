'use client';

import Header from '../components/Header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">سياسة الخصوصية</h1>
            <p className="text-gray-600 mb-8 text-center">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. مقدمة</h2>
                <p className="mb-4">
                  نحن في موقع السيارات المتميز نلتزم بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. 
                  تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا الإلكتروني.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. المعلومات التي نجمعها</h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 المعلومات الشخصية</h3>
                  <p className="mb-3">
                    قد نجمع المعلومات التالية عند استخدامك لموقعنا:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>الاسم الكامل</li>
                    <li>عنوان البريد الإلكتروني</li>
                    <li>رقم الهاتف</li>
                    <li>العنوان</li>
                    <li>معلومات الدفع (عند إتمام المعاملات)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. كيفية استخدام المعلومات</h2>
                <p className="mb-4">
                  نستخدم المعلومات التي نجمعها للأغراض التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>توفير وتحسين خدماتنا</li>
                  <li>معالجة المعاملات والطلبات</li>
                  <li>التواصل معك بشأن خدماتنا</li>
                  <li>إرسال التحديثات والعروض الترويجية (بموافقتك)</li>
                  <li>تحسين تجربة المستخدم</li>
                  <li>الامتثال للالتزامات القانونية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. حماية المعلومات</h2>
                <p className="mb-4">
                  نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. 
                  تشمل هذه التدابير:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>التشفير الآمن للبيانات الحساسة</li>
                  <li>الوصول المقيد للمعلومات الشخصية</li>
                  <li>مراقبة أنظمتنا بانتظام للكشف عن الثغرات الأمنية</li>
                  <li>التحديثات الأمنية المستمرة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. مشاركة المعلومات</h2>
                <p className="mb-4">
                  لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية فقط:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>مع موفري الخدمات الذين يساعدوننا في تشغيل موقعنا</li>
                  <li>عندما يكون ذلك مطلوبًا بموجب القانون</li>
                  <li>لحماية حقوقنا وممتلكاتنا</li>
                  <li>مع موافقتك الصريحة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. ملفات تعريف الارتباط (Cookies)</h2>
                <p className="mb-4">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. حقوقك</h2>
                <p className="mb-4">
                  لديك الحق في:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>تصحيح المعلومات غير الدقيقة</li>
                  <li>حذف معلوماتك الشخصية</li>
                  <li>الاعتراض على معالجة معلوماتك</li>
                  <li>سحب موافقتك في أي وقت</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. التغييرات على سياسة الخصوصية</h2>
                <p className="mb-4">
                  قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر البريد الإلكتروني أو إشعار على موقعنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. الاتصال بنا</h2>
                <p className="mb-4">
                  إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى الاتصال بنا:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>البريد الإلكتروني:</strong> info@abrajsa.com</p>
                  <p className="mb-2"><strong>الهاتف:</strong> 0551781111</p>
                  <p><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

