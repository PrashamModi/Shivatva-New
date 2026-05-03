import React, { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="navbar-brand">Shivatva</div>

      <ul className="navbar-links">
        <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>Home</a></li>
        <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
        <li><a href="#products" onClick={(e) => { e.preventDefault(); scrollTo('products'); }}>Products</a></li>
        <li>
          <a
            href="#products"
            className="btn-glow navbar-cta"
            onClick={(e) => { e.preventDefault(); scrollTo('products'); }}
          >
            Enquire Now
          </a>
        </li>
      </ul>

      <div className="navbar-mobile-toggle">
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
};

export default Navbar;
