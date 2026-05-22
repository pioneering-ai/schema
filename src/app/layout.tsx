import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '跨境电商 Schema 管理系统',
  description: '管理跨境电商平台的 Schema、实体属性和规则',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
