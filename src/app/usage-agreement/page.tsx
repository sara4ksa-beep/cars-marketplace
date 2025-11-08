'use client';

import Header from '../components/Header';

export default function UsageAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">اتفاقية الاستخدام</h1>
            <p className="text-gray-600 mb-8 text-center">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. الموافقة على الاتفاقية</h2>
                <p className="mb-4">
                  ترحب بك اتفاقية الاستخدام هذه في موقع السيارات المتميز. من خلال الوصول إلى موقعنا واستخدامه، 
                  فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بجميع الشروط والأحكام الواردة في هذه الاتفاقية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. تعريفات</h2>
                <div className="space-y-3">
                  <p className="mb-3"><strong>"الموقع"</strong> يشير إلى موقع السيارات المتميز وجميع صفحاته وخدماته.</p>
                  <p className="mb-3"><strong>"نحن" أو "الموقع"</strong> يشير إلى مالكي ومشغلي موقع السيارات المتميز.</p>
                  <p className="mb-3"><strong>"المستخدم" أو "أنت"</strong> يشير إلى أي شخص يصل إلى أو يستخدم الموقع.</p>
                  <p className="mb-3"><strong>"المحتوى"</strong> يشمل جميع النصوص والصور والفيديو والبيانات والمعلومات المتاحة على الموقع.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. قبول الشروط</h2>
                <p className="mb-4">
                  باستخدام موقعنا، فإنك تقبل وتوافق على:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الالتزام بجميع القوانين واللوائح المحلية والدولية</li>
                  <li>استخدام الموقع فقط للأغراض القانونية</li>
                  <li>عدم استخدام الموقع بطريقة قد تضر أو تعطل أو تضعف الموقع</li>
                  <li>احترام حقوق الملكية الفكرية للآخرين</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. إنشاء الحساب</h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 متطلبات الحساب</h3>
                  <p className="mb-3">
                    لاستخدام بعض ميزات الموقع، قد تحتاج إلى إنشاء حساب. عند إنشاء حساب، يجب عليك:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تقديم معلومات دقيقة وحديثة وكاملة</li>
                    <li>الحفاظ على أمان كلمة المرور الخاصة بك</li>
                    <li>إبلاغنا فورًا بأي استخدام غير مصرح به</li>
                    <li>أن تكون مسؤولاً عن جميع الأنشطة التي تحدث تحت حسابك</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 حسابات متعددة</h3>
                  <p className="mb-3">
                    لا يُسمح بإنشاء حسابات متعددة لنفس الشخص. نحتفظ بالحق في تعليق أو حذف أي حسابات مشبوهة.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. استخدام الخدمات</h2>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 نشر الإعلانات</h3>
                  <p className="mb-3">
                    عند نشر إعلان لسيارة، يجب أن:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تقدم معلومات دقيقة وصحيحة عن السيارة</li>
                    <li>تستخدم صورًا حقيقية للسيارة المعروضة</li>
                    <li>تضمن أن لديك الحق القانوني في بيع السيارة</li>
                    <li>تلتزم بجميع القوانين واللوائح المحلية</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 المزايدات</h3>
                  <p className="mb-3">
                    عند المشاركة في المزايدات:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>المزايدات ملزمة ولا يمكن التراجع عنها</li>
                    <li>يجب أن تكون جادًا في نيتك للشراء</li>
                    <li>أنت مسؤول عن دفع المبلغ المزايد عليه في حالة الفوز</li>
                    <li>يحظر التلاعب بالمزايدات بأي شكل من الأشكال</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. المحتوى المقدم من المستخدم</h2>
                <p className="mb-4">
                  عندما تقدم محتوى على موقعنا (مثل الإعلانات أو التعليقات):
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>أنت تمنحنا ترخيصًا غير حصري لاستخدام وعرض وتوزيع هذا المحتوى</li>
                  <li>أنت تضمن أن لديك جميع الحقوق اللازمة لمشاركة هذا المحتوى</li>
                  <li>أنت تتحمل المسؤولية الكاملة عن محتواك</li>
                  <li>يحظر نشر أي محتوى غير قانوني أو مسيء أو مخالف</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. السلوكيات المحظورة</h2>
                <p className="mb-4">
                  يحظر عليك بشكل صريح:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>استخدام الموقع لأي نشاط غير قانوني</li>
                  <li>نشر معلومات كاذبة أو مضللة</li>
                  <li>انتهاك حقوق الملكية الفكرية</li>
                  <li>إرسال بريد إلكتروني عشوائي أو رسائل غير مرغوب فيها</li>
                  <li>محاولة الوصول غير المصرح به إلى أنظمتنا</li>
                  <li>استخدام برامج آلية أو روبوتات للوصول إلى الموقع</li>
                  <li>التلاعب بأسعار المزايدات أو إنشاء مزايدات وهمية</li>
                  <li>انتهاك خصوصية المستخدمين الآخرين</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. الملكية الفكرية</h2>
                <p className="mb-4">
                  جميع المحتويات الموجودة على الموقع، بما في ذلك التصميم والنصوص والصور والشعارات والبرمجيات، 
                  هي ملك لنا أو لموفري المحتوى ومحمية بموجب قوانين حقوق الطبع والنشر والعلامات التجارية. 
                  لا يجوز نسخ أو توزيع أو تعديل أو إنشاء أعمال مشتقة من أي محتوى دون إذن كتابي منا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. إخلاء المسؤولية</h2>
                <p className="mb-4">
                  نقدم الموقع والخدمات "كما هي" و"كما هو متاح". لا نقدم أي ضمانات، صريحة أو ضمنية، 
                  بما في ذلك على سبيل المثال لا الحصر:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>ضمانات الجودة أو الملاءمة لغرض معين</li>
                  <li>ضمانات أن الموقع سيعمل دون انقطاع أو أخطاء</li>
                  <li>ضمانات دقة أو اكتمال المعلومات</li>
                  <li>ضمانات جودة أو حالة أي سيارة معروضة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. الحد من المسؤولية</h2>
                <p className="mb-4">
                  لن نكون مسؤولين بأي حال من الأحوال عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية 
                  أو عقابية ناتجة عن استخدام أو عدم القدرة على استخدام موقعنا أو الخدمات، 
                  حتى لو تم إبلاغنا بإمكانية حدوث مثل هذه الأضرار.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. التعويض</h2>
                <p className="mb-4">
                  أنت توافق على تعويضنا وحمايتنا من أي مطالبات أو أضرار أو التزامات أو خسائر 
                  (بما في ذلك الرسوم القانونية) الناتجة عن:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>استخدامك للموقع أو الخدمات</li>
                  <li>انتهاكك لهذه الاتفاقية</li>
                  <li>انتهاكك لحقوق أي طرف ثالث</li>
                  <li>المحتوى الذي تقدمه على الموقع</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. الإنهاء</h2>
                <p className="mb-4">
                  نحتفظ بالحق في إنهاء أو تعليق وصولك إلى الموقع والخدمات في أي وقت، 
                  دون إشعار مسبق، لأي سبب من الأسباب، بما في ذلك انتهاك هذه الاتفاقية. 
                  عند الإنهاء، ستفقد فورًا الوصول إلى حسابك وجميع البيانات المرتبطة به.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. التعديلات</h2>
                <p className="mb-4">
                  نحتفظ بالحق في تعديل أو تحديث هذه الاتفاقية في أي وقت. 
                  سيتم إشعارك بأي تغييرات مهمة عبر البريد الإلكتروني أو إشعار على الموقع. 
                  استمرار استخدامك للموقع بعد التغييرات يعني موافقتك على الاتفاقية المحدثة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. القانون الحاكم</h2>
                <p className="mb-4">
                  تخضع هذه الاتفاقية وتفسر وفقًا لقوانين المملكة العربية السعودية. 
                  أي نزاع ينشأ عن أو يتعلق بهذه الاتفاقية سيخضع للاختصاص الحصري 
                  لمحاكم المملكة العربية السعودية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. الاتصال بنا</h2>
                <p className="mb-4">
                  إذا كان لديك أي أسئلة أو مخاوف بشأن هذه الاتفاقية، يرجى الاتصال بنا:
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

