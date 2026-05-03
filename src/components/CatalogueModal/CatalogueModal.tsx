import React from 'react';
import coalTypes from '../../data/coalTypes';
import './CatalogueModal.css';

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (coalId: string) => void;
}

const CatalogueModal: React.FC<CatalogueModalProps> = ({ isOpen, onClose, onEnquire }) => {
  return (
    <div
      className={`catalogue-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
      id="catalogue-modal"
    >
      <div className="catalogue-modal" onClick={(e) => e.stopPropagation()}>
        <div className="catalogue-header">
          <h2>Coal Catalogue</h2>
          <button className="catalogue-close" onClick={onClose} aria-label="Close catalogue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="catalogue-grid">
          {coalTypes.map((coal) => (
            <div className="catalogue-card" key={coal.id}>
              <div className="catalogue-card-img-wrapper">
                <img
                  src={coal.image}
                  alt={coal.name}
                  className="catalogue-card-img"
                  loading="lazy"
                />
              </div>
              <div className="catalogue-card-body">
                <h3>{coal.name}</h3>
                <span className="grade-tag" style={{ color: coal.accentColor }}>
                  {coal.grade} Grade
                </span>

                <dl className="catalogue-card-specs">
                  <dt>Calorific Value</dt>
                  <dd>{coal.calorificValue}</dd>
                  <dt>Moisture</dt>
                  <dd>{coal.moisture}</dd>
                  <dt>Ash Content</dt>
                  <dd>{coal.ashContent}</dd>
                </dl>

                <button
                  className="catalogue-card-enquire"
                  onClick={() => onEnquire(coal.id)}
                  id={`catalogue-enquire-${coal.id}`}
                >
                  Enquire About {coal.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogueModal;
