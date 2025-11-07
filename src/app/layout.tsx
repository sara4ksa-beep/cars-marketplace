import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "موقع السيارات المتميز | أفضل السيارات في الشرق الأوسط",
  description: "اكتشف أفضل السيارات الفاخرة والاقتصادية في الشرق الأوسط. نقدم لك أحدث الموديلات وأفضل الأسعار مع خدمة عملاء متميزة.",
  keywords: "سيارات, سيارات فاخرة, سيارات اقتصادية, شراء سيارات, بيع سيارات",
  icons: {
    icon: '/newlogo1.png',
    shortcut: '/newlogo1.png',
    apple: '/newlogo1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo bg-gray-50 pb-16 md:pb-0">
        {children}
      </body>
    </html>
  );
}
