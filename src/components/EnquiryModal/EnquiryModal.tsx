import React, { useState, useEffect, useCallback } from 'react';
import coalTypes from '../../data/coalTypes';
import './EnquiryModal.css';

interface EnquiryModalProps {
  isOpen: boolean;
  coalId: string | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, coalId, onClose }) => {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const coal = coalTypes.find((c) => c.id === coalId);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', phone: '', message: '' });
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, coalId]);

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{7,15}$/.test(form.phone)) {
      errs.phone = 'Invalid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Compose mailto
    const subject = encodeURIComponent(
      `Enquiry about ${coal?.name || 'Coal'} — from ${form.name}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCoal Type: ${coal?.name || 'General'}\n\nMessage:\n${form.message || 'N/A'}`
    );
    window.open(`mailto:info@shivatva.com?subject=${subject}&body=${body}`, '_self');
    setSubmitted(true);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div
      className={`enquiry-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
      id="enquiry-modal"
    >
      <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="enquiry-header">
              <div className="enquiry-header-text">
                <h2>Send Enquiry</h2>
                <p>We'll get back to you within 24 hours</p>
              </div>
              <button className="enquiry-close" onClick={onClose} aria-label="Close enquiry">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {coal && (
              <div className="enquiry-coal-badge">
                <img src={coal.image} alt={coal.name} />
                <span>{coal.name}</span>
              </div>
            )}

            <form className="enquiry-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="enquiry-name">Full Name</label>
                <input
                  id="enquiry-name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="enquiry-email">Email Address</label>
                <input
                  id="enquiry-email"
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="enquiry-phone">Phone Number</label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="enquiry-message">Message (Optional)</label>
                <textarea
                  id="enquiry-message"
                  placeholder="Tell us about your requirements..."
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                />
              </div>

              <button type="submit" className="btn-glow enquiry-submit" id="enquiry-submit-btn">
                Send Enquiry
              </button>
            </form>
          </>
        ) : (
          <div className="enquiry-success">
            <div className="enquiry-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3>Enquiry Sent!</h3>
            <p>
              Thank you for your interest in {coal?.name || 'our products'}. Our team will 
              review your enquiry and get back to you within 24 hours.
            </p>
            <button
              className="btn-outline"
              onClick={onClose}
              style={{ marginTop: '24px' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
