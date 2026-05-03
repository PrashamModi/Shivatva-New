/**
 * CardSwap Component — Adapted for Shivatva
 * Elegant card swapping animation using GSAP.
 * Added: programmatic next/prev via exposed ref methods.
 */
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type {
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`swap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));

Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

export const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
      width = 500,
      height = 400,
      cardDistance = 60,
      verticalDistance = 70,
      delay = 5000,
      pauseOnHover = false,
      onCardClick,
      skewAmount = 6,
      easing = 'elastic',
      children,
    },
    ref
  ) => {
    const config =
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.8,0.7)',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.6,
            returnDelay: 0.1,
          }
        : {
            ease: 'power3.inOut',
            durDrop: 0.6,
            durMove: 0.6,
            durReturn: 0.6,
            promoteOverlap: 0.5,
            returnDelay: 0.1,
          };

    const childArr = useMemo(
      () => Children.toArray(children) as ReactElement<CardProps>[],
      [children]
    );
    const refs = useMemo<CardRef[]>(
      () => childArr.map(() => React.createRef<HTMLDivElement>()),
      [childArr.length]
    );
    const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number>(0);
    const container = useRef<HTMLDivElement>(null);
    const isAnimating = useRef(false);

    const swap = () => {
      if (order.current.length < 2) return;
      if (isAnimating.current && tlRef.current) {
        tlRef.current.progress(1);
      }
      isAnimating.current = true;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) { isAnimating.current = false; return; }

      const tl = gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      });
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );

      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const swapReverse = () => {
      if (order.current.length < 2) return;
      if (isAnimating.current && tlRef.current) {
        tlRef.current.progress(1);
      }
      isAnimating.current = true;
      const last = order.current[order.current.length - 1];
      const restOrder = order.current.slice(0, -1);
      const elLast = refs[last].current;
      if (!elLast) { isAnimating.current = false; return; }

      const newOrder = [last, ...restOrder];
      const tl = gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      });
      tlRef.current = tl;

      // Move last card off screen below
      tl.set(elLast, { y: '+=500', zIndex: refs.length });

      // Shift all existing cards back one slot
      restOrder.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            zIndex: slot.zIndex,
            duration: config.durMove,
            ease: config.ease,
          },
          0
        );
      });

      // Bring last card to front
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      tl.to(
        elLast,
        {
          x: frontSlot.x,
          y: frontSlot.y,
          z: frontSlot.z,
          zIndex: frontSlot.zIndex,
          duration: config.durReturn,
          ease: config.ease,
        },
        0.3
      );

      tl.call(() => {
        order.current = newOrder;
      });
    };

    // Expose next/prev methods
    useImperativeHandle(ref, () => ({
      next: () => {
        clearInterval(intervalRef.current);
        swap();
        intervalRef.current = window.setInterval(swap, delay);
      },
      prev: () => {
        clearInterval(intervalRef.current);
        swapReverse();
        intervalRef.current = window.setInterval(swap, delay);
      },
    }));

    useEffect(() => {
      const total = refs.length;
      refs.forEach((r, i) => {
        if (r.current) {
          placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
        }
      });

      intervalRef.current = window.setInterval(swap, delay);

      if (pauseOnHover && container.current) {
        const node = container.current;
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
        };
      }

      return () => clearInterval(intervalRef.current);
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

    const rendered = childArr.map((child, i) =>
      isValidElement<CardProps>(child)
        ? cloneElement(child, {
            key: i,
            ref: refs[i],
            style: { width, height, ...(child.props.style ?? {}) },
            onClick: (e: React.MouseEvent<HTMLDivElement>) => {
              child.props.onClick?.(e);
              onCardClick?.(i);
            },
          } as CardProps & React.RefAttributes<HTMLDivElement>)
        : child
    );

    return (
      <div
        ref={container}
        className="card-swap-container"
        style={{ width, height, perspective: '1200px' }}
      >
        <div className="card-swap-inner">{rendered}</div>
      </div>
    );
  }
);

CardSwap.displayName = 'CardSwap';

export default CardSwap;
