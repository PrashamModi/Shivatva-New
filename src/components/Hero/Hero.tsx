import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Hero.css';

/* -------- Typing Animation Hook -------- */
function useTypingAnimation(text: string, delayMs = 50, startDelay = 800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    let timer: number;

    const startTimer = setTimeout(() => {
      const tick = () => {
        if (idx < text.length) {
          idx++;
          setDisplayed(text.slice(0, idx));
          timer = window.setTimeout(tick, delayMs);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, delayMs, startDelay]);

  return { displayed, done };
}

/* -------- Ember Particle -------- */
const EmberParticle: React.FC<{ index: number }> = ({ index }) => {
  const style: React.CSSProperties = {
    left: `${Math.random() * 100}%`,
    animationDuration: `${6 + Math.random() * 8}s`,
    animationDelay: `${Math.random() * 5}s`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
    opacity: 0.4 + Math.random() * 0.6,
  };
  return <div className="ember-particle" style={style} key={index} />;
};

/* -------- Hero Component -------- */
const HEADLINE = 'Premium Coal Solutions';
const TARGET_WORD = 'Coal';

const Hero: React.FC = () => {
  const { displayed, done } = useTypingAnimation(HEADLINE, 50);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [underlineVisible, setUnderlineVisible] = useState(false);

  // Intersection observer for hand-drawn underline
  useEffect(() => {
    if (!done || !underlineRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUnderlineVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(underlineRef.current);
    return () => obs.disconnect();
  }, [done]);

  // Render typed text with underline on target word
  const renderTypedText = useCallback(() => {
    const idx = displayed.indexOf(TARGET_WORD);
    if (idx === -1 || !done) {
      return <span className="typed-text">{displayed}</span>;
    }
    const before = displayed.slice(0, idx);
    const after = displayed.slice(idx + TARGET_WORD.length);
    return (
      <>
        <span className="typed-text">{before}</span>
        <span
          ref={underlineRef}
          className={`underline-word${underlineVisible ? ' animate' : ''}`}
        >
          {TARGET_WORD}
          <svg viewBox="0 0 200 12" preserveAspectRatio="none">
            <path d="M2 9 C40 2, 80 2, 100 6 S160 12, 198 4" />
          </svg>
        </span>
        <span className="typed-text">{after}</span>
      </>
    );
  }, [displayed, done, underlineVisible]);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      {/* Ember particles */}
      <div className="hero-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <EmberParticle index={i} key={i} />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-label">
          <span className="dot" />
          Trusted Coal Supplier Since 2005
        </div>

        <h1 className="hero-title">
          {renderTypedText()}
          {!done && <span className="cursor" />}
        </h1>

        <p className="hero-subtitle">
          Powering industries worldwide with premium-grade coal. From anthracite to coking coal, 
          we deliver unmatched quality, reliability, and energy solutions tailored to your needs.
        </p>

        <div className="hero-cta-group">
          <button className="btn-glow" onClick={scrollToProducts}>
            Explore Products
          </button>
          <button className="btn-outline" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
