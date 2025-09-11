import { PrismaClient, CarStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // إنشاء مستخدم تجريبي
  const user = await prisma.user.upsert({
    where: { email: 'demo@carsite.com' },
    update: {},
    create: {
      name: 'مدير النظام',
      email: 'demo@carsite.com',
      password: 'securepassword', // في التطبيق الحقيقي يجب تشفير كلمة المرور
      role: 'ADMIN',
      phone: '+966501234567'
    },
  })

  // إنشاء 4 سيارات مميزة
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        name: 'مرسيدس AMG GT 2025',
        brand: 'مرسيدس',
        year: 2025,
        price: 750000,
        mileage: 0,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        color: 'أسود',
        description: 'سيارة رياضية فاخرة بمحرك V8 قوة 630 حصان',
        imageUrl: '/mercedes.jpg',
        images: ['/mercedes.jpg', '/bmw.jpg', '/acc.png'],
        contactName: 'أحمد محمد السعدي',
        contactPhone: '+966 50 123 4567',
        contactLocation: 'الرياض، المملكة العربية السعودية',
        contactEmail: 'ahmed.alsaadi@example.com',
        sellerId: user.id,
        featured: true,
        status: CarStatus.APPROVED
      }
    }),
    prisma.car.create({
      data: {
        name: 'لكزس LX 600 2025',
        brand: 'لكزس',
        year: 2025,
        price: 485000,
        mileage: 0,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        color: 'أبيض لؤلؤي',
        description: 'سيارة SUV فاخرة بمحرك V6 توين تيربو',
        imageUrl: '/LX.jpg',
        images: ['/LX.jpg', '/lxx.jpg', '/camry.jpg'],
        contactName: 'سارة أحمد العتيبي',
        contactPhone: '+966 55 987 6543',
        contactLocation: 'جدة، المملكة العربية السعودية',
        contactEmail: 'sara.alotaibi@example.com',
        sellerId: user.id,
        featured: true,
        status: CarStatus.APPROVED
      }
    }),
    prisma.car.create({
      data: {
        name: 'تويوتا كامري 2025',
        brand: 'تويوتا',
        year: 2025,
        price: 85000,
        mileage: 0,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        color: 'أبيض',
        description: 'سيارة اقتصادية موثوقة وعملية',
        imageUrl: '/camry.jpg',
        images: ['/camry.jpg', '/sonata.webp', '/tt.jpg'],
        contactName: 'محمد علي الغامدي',
        contactPhone: '+966 56 111 2233',
        contactLocation: 'الدمام، المملكة العربية السعودية',
        contactEmail: 'mohammed.alghamdi@example.com',
        sellerId: user.id,
        featured: true,
        status: CarStatus.APPROVED
      }
    }),
    prisma.car.create({
      data: {
        name: 'بي إم دبليو X7 2025',
        brand: 'بي إم دبليو',
        year: 2025,
        price: 625000,
        mileage: 0,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        color: 'رمادي معدني',
        description: 'سيارة SUV فاخرة بـ 7 مقاعد ومحرك V8',
        imageUrl: '/BMW-X5-2024-1.webp',
        images: ['/BMW-X5-2024-1.webp', '/bmw.jpg', '/mercedes.jpg'],
        contactName: 'فهد بن عبدالله الراشد',
        contactPhone: '+966 50 444 5566',
        contactLocation: 'مكة المكرمة، المملكة العربية السعودية',
        contactEmail: 'fahd.alrashed@example.com',
        sellerId: user.id,
        featured: true,
        status: CarStatus.APPROVED
      }
    })
  ])

  console.log({ user, cars })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 