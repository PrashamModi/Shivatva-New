import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import SVGJourney from './components/SVGJourney/SVGJourney';
import HorizontalScroll from './components/HorizontalScroll/HorizontalScroll';
import About from './components/About/About';
import CoalShowcase from './components/CoalShowcase/CoalShowcase';
import CatalogueModal from './components/CatalogueModal/CatalogueModal';
import EnquiryModal from './components/EnquiryModal/EnquiryModal';
import Footer from './components/Footer/Footer';
import './App.css';

const App: React.FC = () => {
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCoalId, setEnquiryCoalId] = useState<string | null>(null);

  const handleEnquire = useCallback((coalId: string) => {
    setCatalogueOpen(false);
    setEnquiryCoalId(coalId);
    setEnquiryOpen(true);
  }, []);

  const handleCloseEnquiry = useCallback(() => {
    setEnquiryOpen(false);
    setEnquiryCoalId(null);
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Hero />
      <SVGJourney />
      <HorizontalScroll />
      <About />
      <CoalShowcase
        onEnquire={handleEnquire}
        onOpenCatalogue={() => setCatalogueOpen(true)}
      />
      <Footer />

      {/* Modals */}
      <CatalogueModal
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
        onEnquire={handleEnquire}
      />
      <EnquiryModal
        isOpen={enquiryOpen}
        coalId={enquiryCoalId}
        onClose={handleCloseEnquiry}
      />
    </div>
  );
};

export default App;
