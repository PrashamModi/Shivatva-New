import React, { useRef } from 'react';
import { CardSwap, Card } from '../CardSwap/CardSwap';
import type { CardSwapHandle } from '../CardSwap/CardSwap';
import coalTypes from '../../data/coalTypes';
import './CoalShowcase.css';

interface CoalShowcaseProps {
  onEnquire: (coalId: string) => void;
  onOpenCatalogue: () => void;
}

const CoalShowcase: React.FC<CoalShowcaseProps> = ({ onEnquire, onOpenCatalogue }) => {
  const swapRef = useRef<CardSwapHandle>(null);

  return (
    <section className="coal-showcase section-padding" id="products">
      <div className="container">
        <div className="coal-showcase-header">
          <div className="section-label">Our Products</div>
          <h2>
            Discover Our <span>Coal Range</span>
          </h2>
          <p>
            From high-energy anthracite to versatile thermal coal, explore our comprehensive 
            portfolio of premium coal products.
          </p>
        </div>

        <div className="coal-showcase-body">
          {/* Prev button */}
          <button
            className="coal-nav-btn"
            onClick={() => swapRef.current?.prev()}
            aria-label="Previous coal type"
            id="coal-prev-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* CardSwap */}
          <div className="card-swap-wrapper">
            <CardSwap
              ref={swapRef}
              width={400}
              height={320}
              cardDistance={35}
              verticalDistance={35}
              delay={5000}
              pauseOnHover={true}
              skewAmount={4}
              easing="elastic"
              onCardClick={(idx) => onEnquire(coalTypes[idx].id)}
            >
              {coalTypes.map((coal) => (
                <Card key={coal.id}>
                  <img
                    src={coal.image}
                    alt={coal.name}
                    className="swap-card-image"
                    loading="lazy"
                  />
                  <div className="swap-card-overlay" />
                  <div className="swap-card-content">
                    <div
                      className="swap-card-grade"
                      style={{ color: coal.accentColor, borderColor: coal.accentColor }}
                    >
                      {coal.grade}
                    </div>
                    <h3 className="swap-card-title">{coal.name}</h3>
                    <p className="swap-card-desc">{coal.description}</p>
                    <button
                      className="swap-card-enquire"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnquire(coal.id);
                      }}
                    >
                      Enquire Now
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>

          {/* Next button */}
          <button
            className="coal-nav-btn"
            onClick={() => swapRef.current?.next()}
            aria-label="Next coal type"
            id="coal-next-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="coal-controls">
          <button className="btn-outline" onClick={onOpenCatalogue} id="view-catalogue-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            View Full Catalogue
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoalShowcase;
