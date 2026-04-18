// layout.tsx
import type { Metadata } from "next";;
import "./globals.css";

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
              <div className="address-block">
                <h4>Адрес ПЦК</h4>
                <p>г. Оренбург, ул. Терешковой, 134, каб. 2315<br /><span>&copy; {new Date().getFullYear()} ПЦК ТПП и ЕД. Все права защищены.</span></p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}