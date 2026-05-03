import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SVGJourney.css';

gsap.registerPlugin(ScrollTrigger);

const SVGJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill();
      });
    };
  }, []);

  return (
    <div className="svg-journey" ref={containerRef}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          ref={pathRef}
          className="journey-path"
          d="M0 80 C200 80, 250 20, 400 40 S600 100, 800 50 S1000 20, 1200 60"
        />
      </svg>
    </div>
  );
};

export default SVGJourney;
