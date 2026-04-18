'use client';

import { useEffect, useState } from 'react';

const links = [
  { href: '#aboutpzk', label: 'О ПЦК' },
  { href: '#teachers', label: 'ПРЕПОДАВАТЕЛИ' },
  { href: '#disciplines', label: 'ДИСЦИПЛИНЫ' },
  { href: '#umr', label: 'УМР' },
  { href: '#nirs', label: 'НИРС' },
  { href: '#activities', label: 'ВНЕАУДИТОРНАЯ РАБОТА' },
  { href: '#news', label: 'НОВОСТИ' },
  { href: '#students', label: 'СТУДЕНТАМ' },
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="header liquid-glass">
      <div className="mobile-header-bar">
        <nav className="desktop-nav">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`burger-button ${isOpen ? 'open' : ''}`}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
