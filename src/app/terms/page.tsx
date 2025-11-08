'use client';

import Header from '../components/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">الشروط والأحكام</h1>
            <p className="text-gray-600 mb-8 text-center">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. القبول بالشروط</h2>
                <p className="mb-4">
                  من خلال الوصول إلى موقع السيارات المتميز واستخدامه، فإنك تقبل وتوافق على الالتزام بهذه الشروط والأحكام. 
                  إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام موقعنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. استخدام الموقع</h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 الأهلية</h3>
                  <p className="mb-3">
                    يجب أن تكون قد بلغت سن 18 عامًا على الأقل لاستخدام موقعنا. باستخدام الموقع، فإنك تؤكد أنك تفي بمتطلبات الأهلية.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 الحساب</h3>
                  <p className="mb-3">
                    عند إنشاء حساب، أنت مسؤول عن:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>الحفاظ على سرية معلومات تسجيل الدخول</li>
                    <li>جميع الأنشطة التي تحدث تحت حسابك</li>
                    <li>إبلاغنا فورًا بأي استخدام غير مصرح به</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. بيع وشراء السيارات</h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 إعلانات السيارات</h3>
                  <p className="mb-3">
                    عند نشر إعلان لسيارة، أنت تضمن أن:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>جميع المعلومات المقدمة صحيحة ودقيقة</li>
                    <li>أنت المالك القانوني للسيارة أو لديك التفويض الكامل</li>
                    <li>السيارة خالية من أي قيود قانونية أو مالية</li>
                    <li>الصور المرفقة تعود للسيارة الفعلية المعروضة</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 عمليات الشراء</h3>
                  <p className="mb-3">
                    عند شراء سيارة:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>أنت مسؤول عن فحص السيارة قبل الشراء</li>
                    <li>جميع المعاملات تتم بين البائع والمشتري مباشرة</li>
                    <li>نحن لسنا طرفًا في أي معاملة بيع</li>
                    <li>نحن لا نضمن جودة أو حالة أي سيارة معروضة</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. المزايدات</h2>
                <p className="mb-4">
                  عند المشاركة في المزايدات:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>المزايدات ملزمة قانونيًا ولا يمكن التراجع عنها</li>
                  <li>أنت مسؤول عن دفع المبلغ المزايد عليه في حالة الفوز</li>
                  <li>نحتفظ بالحق في إلغاء أي مزايدة نشتبه في صحتها</li>
                  <li>يجب أن تكون المزايدة أعلى من المزايدة السابقة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. المحتوى والعلامات التجارية</h2>
                <p className="mb-4">
                  جميع المحتويات الموجودة على الموقع، بما في ذلك النصوص والصور والشعارات، محمية بحقوق الطبع والنشر والعلامات التجارية. 
                  لا يجوز نسخ أو توزيع أو تعديل أي محتوى دون إذن كتابي منا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. السلوك المحظور</h2>
                <p className="mb-4">
                  يحظر عليك:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>استخدام الموقع لأي غرض غير قانوني</li>
                  <li>نشر معلومات كاذبة أو مضللة</li>
                  <li>التلاعب بالمزايدات أو إنشاء حسابات وهمية</li>
                  <li>محاولة الوصول غير المصرح به إلى أنظمتنا</li>
                  <li>إرسال بريد إلكتروني عشوائي أو رسائل غير مرغوب فيها</li>
                  <li>انتهاك حقوق الملكية الفكرية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. إخلاء المسؤولية</h2>
                <p className="mb-4">
                  نقدم الموقع "كما هو" دون أي ضمانات. لا نضمن:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>دقة أو اكتمال المعلومات المعروضة</li>
                  <li>أن الموقع سيعمل دون انقطاع أو أخطاء</li>
                  <li>جودة أو حالة أي سيارة معروضة</li>
                  <li>نتائج أي معاملة بين المستخدمين</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. الحد من المسؤولية</h2>
                <p className="mb-4">
                  لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام موقعنا، 
                  بما في ذلك على سبيل المثال لا الحصر، فقدان الأرباح أو البيانات أو السمعة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. الإنهاء</h2>
                <p className="mb-4">
                  نحتفظ بالحق في إنهاء أو تعليق وصولك إلى الموقع في أي وقت، دون إشعار مسبق، لأي سبب من الأسباب، 
                  بما في ذلك انتهاك هذه الشروط والأحكام.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. التغييرات على الشروط</h2>
                <p className="mb-4">
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة، 
                  وسيكون تاريخ "آخر تحديث" في أعلى الصفحة. استمرار استخدامك للموقع بعد التغييرات يعني موافقتك على الشروط المحدثة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. القانون الحاكم</h2>
                <p className="mb-4">
                  تخضع هذه الشروط والأحكام وتفسر وفقًا لقوانين المملكة العربية السعودية. 
                  أي نزاع ينشأ عن هذه الشروط سيخضع للاختصاص الحصري لمحاكم المملكة العربية السعودية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. الاتصال بنا</h2>
                <p className="mb-4">
                  إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا:
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

