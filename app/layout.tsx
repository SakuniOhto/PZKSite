// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InfoSection from "./components/InfoSection"; // <-- Измените путь, если нужно

export const metadata: Metadata = {
  title: "PZK Site",
  description: "Конкурсный сайт ПЦК технологии продуктов питания и естественно-научных дисциплин. Автор: Бадегшанов В.Р.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`h-full antialiased`}
    >
      <body>
        <div className="wrapper">
          <header className="header liquid-glass">
            <nav>
              <a href="#aboutpzk">О ПЦК</a>
              <a href="#teachers">ПРЕПОДАВАТЕЛИ</a>
              <a href="#disciplines">ДИСЦИПЛИНЫ</a>
              <a href="#umr">УМР</a>
              <a href="#nirs">НИРС</a>
              <a href="#activities">ВНЕАУДИТОРНАЯ РАБОТА</a>
              <a href="#news">НОВОСТИ</a>
              <a href="#students">СТУДЕНТАМ</a>
            </nav>
          </header>
        </div>

        <main className="main">{children}</main>


        <div>
          <footer className="footer">
            <div className="wrapper">
              <InfoSection />
              <p className="copy">&copy; {new Date().getFullYear()} ПЦК ТПП и ЕД. Все права защищены.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}