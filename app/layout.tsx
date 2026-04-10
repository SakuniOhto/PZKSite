import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Сайт ПЦК ТПП и ЕД",
  description: "Конкурсный сайт Предметно-цикловой комиссии технологии продуктов питания и естественно-научных дисциплин. Автор: Бадегшанов Владислав Русланович",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <div className="wrapper">
          <header className="header">
            <nav>
              <a href="#">О ПЦК</a>
              <a href="#">ПРЕПОДАВАТЕЛИ</a>
              <a href="#">ДИСЦИПЛИНЫ</a>
              <a href="#">УМР</a>
              <a href="#">НИРС</a>
              <a href="#">ВНЕАУДИТОРНАЯ РАБОТА</a>
              <a href="#">НОВОСТИ</a>
              <a href="#">СТУДЕНТАМ</a>
            </nav>
          </header>

          <main className="main">
            <div className="wrapper">{children}</div>
          </main>

          <footer className="footer">
            <div className="wrapper">
              <p>&copy; {new Date().getFullYear()} ПЦК ТПП и ЕД. Все права защищены.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
