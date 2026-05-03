import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './HorizontalScroll.css';

/* Inline SVG icons used as "punctuation" in the ticker */
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const DiamondIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>
  </svg>
);

const PickaxeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/>
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958l-.011.002a12.5 12.5 0 0 0 7.803 8.293"/>
    <path d="m21.042 2.958-3.536 3.536"/>
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

interface TickerItem {
  type: 'word' | 'icon' | 'separator';
  content?: string;
  highlight?: boolean;
  icon?: React.FC;
}

const sentenceItems: TickerItem[] = [
  { type: 'word', content: 'From' },
  { type: 'word', content: 'the' },
  { type: 'word', content: 'depths', highlight: true },
  { type: 'word', content: 'of' },
  { type: 'word', content: 'the' },
  { type: 'word', content: 'earth,' },
  { type: 'icon', icon: PickaxeIcon },
  { type: 'word', content: 'we' },
  { type: 'word', content: 'bring' },
  { type: 'word', content: 'you' },
  { type: 'word', content: 'the' },
  { type: 'word', content: 'purest', highlight: true },
  { type: 'word', content: 'energy' },
  { type: 'icon', icon: BoltIcon },
  { type: 'word', content: '—' },
  { type: 'word', content: 'refined' },
  { type: 'word', content: 'coal', highlight: true },
  { type: 'icon', icon: DiamondIcon },
  { type: 'word', content: 'that' },
  { type: 'word', content: 'powers', highlight: true },
  { type: 'word', content: 'industries,' },
  { type: 'word', content: 'builds' },
  { type: 'word', content: 'nations,' },
  { type: 'icon', icon: FlameIcon },
  { type: 'word', content: 'and' },
  { type: 'word', content: 'fuels', highlight: true },
  { type: 'word', content: 'progress' },
  { type: 'word', content: 'across' },
  { type: 'word', content: 'the' },
  { type: 'word', content: 'globe.' },
];

const renderItem = (item: TickerItem, i: number) => {
  if (item.type === 'word') {
    return (
      <span key={i} className={`ticker-word${item.highlight ? ' highlight' : ''}`}>
        {item.content}
      </span>
    );
  }
  if (item.type === 'icon' && item.icon) {
    const Icon = item.icon;
    return (
      <span key={i} className="ticker-icon">
        <Icon />
      </span>
    );
  }
  if (item.type === 'separator') {
    return (
      <span key={i} className="ticker-separator">
        <span />
      </span>
    );
  }
  return null;
};

const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Wait for fonts/layout to settle
    const raf = requestAnimationFrame(() => {
      // Measure a single copy of the sentence (first half of children)
      const totalChildren = track.children.length;
      const halfIndex = (totalChildren - 1) / 2; // minus separator
      let singleWidth = 0;
      for (let i = 0; i <= halfIndex; i++) {
        singleWidth += (track.children[i] as HTMLElement).offsetWidth;
      }

      // Auto-scroll: continuously translate from 0 to -singleWidth, then loop
      const speed = 80; // pixels per second
      const duration = singleWidth / speed;

      const tween = gsap.to(track, {
        x: -singleWidth,
        duration,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: number) => {
            // Seamless loop: when past -singleWidth, reset
            return parseFloat(x as unknown as string) % singleWidth;
          }),
        },
      });

      // Drag interaction
      let isDragging = false;
      let startX = 0;
      let dragStartProgress = 0;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        startX = e.clientX;
        dragStartProgress = tween.progress();
        tween.pause();
        section.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const progressDelta = dx / singleWidth;
        let newProgress = dragStartProgress - progressDelta;
        // Keep progress in 0-1 range for seamless looping
        newProgress = ((newProgress % 1) + 1) % 1;
        tween.progress(newProgress);
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        tween.play();
      };

      section.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // Cleanup
      return () => {
        tween.kill();
        section.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  // Duplicate the sentence for seamless looping
  const items = [
    ...sentenceItems.map((item, i) => renderItem(item, i)),
    renderItem({ type: 'separator' }, sentenceItems.length),
    ...sentenceItems.map((item, i) => renderItem(item, sentenceItems.length + 1 + i)),
  ];

  return (
    <section className="marquee-section" ref={sectionRef}>
      <div className="marquee-track" ref={trackRef}>
        {items}
      </div>
    </section>
  );
};

export default HorizontalScroll;
