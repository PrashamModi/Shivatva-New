import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    const elements = section.querySelectorAll('.about-animate');
    elements.forEach((el, i) => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    // Animate stat numbers
    const statNumbers = section.querySelectorAll('.stat-number');
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const tween = gsap.fromTo(
        { val: 0 },
        { val: 0 },
        {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onUpdate: function () {
            (el as HTMLElement).textContent = Math.floor(this.targets()[0].val) + suffix;
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="about section-padding" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <div className="section-label about-animate">About Us</div>
            <h2 className="about-animate">
              Fueling <span>Progress</span> with Premium Coal
            </h2>
            <p className="about-animate">
              Shivatva is a leading supplier of premium-grade coal, serving industries 
              across power generation, steel manufacturing, and cement production. With decades 
              of experience, we ensure every shipment meets the highest standards of quality 
              and consistency.
            </p>
            <p className="about-animate">
              Our extensive network of mines and processing facilities allows us to offer 
              a diverse range of coal types — from high-energy anthracite to versatile 
              thermal coal — tailored to meet the specific needs of our global clientele.
            </p>

            <div className="about-stats about-animate">
              <div className="stat-card">
                <div className="stat-number" data-count="20" data-suffix="+">0</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" data-count="50" data-suffix="M+">0</div>
                <div className="stat-label">Tons Delivered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" data-count="30" data-suffix="+">0</div>
                <div className="stat-label">Countries Served</div>
              </div>
            </div>
          </div>

          <div className="about-image-wrapper about-animate">
            <img src="/images/coal-hero.jpg" alt="Premium coal from Shivatva" />
            <div className="about-image-badge">ISO 9001 Certified</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
