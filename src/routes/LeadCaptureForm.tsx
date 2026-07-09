"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { insertAgencyNotification } from '../lib/notifications';

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

export function LeadCaptureFormView({ agencyId }: { agencyId?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!agencyId) {
      setErrors({ name: 'Agency information missing. Please use a valid form link.' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          agency_id: agencyId,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          property_type: formData.propertyType || null,
          budget: formData.budget ? parseFloat(formData.budget.replace(/[^0-9.]/g, '')) : null,
          notes: formData.message.trim() || null,
          source: 'public_form',
          status: 'new',
          currency: 'USD',
        })
        .select('id');

      if (error) throw error;

      const leadId = data?.[0]?.id;
      if (leadId) {
        // Notify agency of new lead (non-blocking)
        insertAgencyNotification(
          agencyId,
          'new_lead',
          `New lead: ${formData.name.trim()}`,
          'A lead submitted your public form.',
          { lead_id: leadId, form: 'public' }
        ).catch(() => {});
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrors({ name: err.message || 'Failed to submit lead. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ marginTop: 0, color: '#28a745' }}>Thank You!</h1>
            <p style={{ color: '#666' }}>We've received your inquiry. Our team will contact you soon.</p>
          </div>
        ) : (
          <>
            <h1 style={{ marginTop: 0, textAlign: 'center' }}>Find Your Dream Property</h1>
            <p style={{ textAlign: 'center', color: '#666' }}>Fill out the form below and we'll help you find the perfect home.</p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.name ? '#dc3545' : '#dee2e6'}`,
                    boxSizing: 'border-box',
                    fontSize: 16,
                  }}
                />
                {errors.name && <span style={{ color: '#dc3545', fontSize: 12 }}>{errors.name}</span>}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.email ? '#dc3545' : '#dee2e6'}`,
                    boxSizing: 'border-box',
                    fontSize: 16,
                  }}
                />
                {errors.email && <span style={{ color: '#dc3545', fontSize: 12 }}>{errors.email}</span>}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: `1px solid ${errors.phone ? '#dc3545' : '#dee2e6'}`,
                    boxSizing: 'border-box',
                    fontSize: 16,
                  }}
                />
                {errors.phone && <span style={{ color: '#dc3545', fontSize: 12 }}>{errors.phone}</span>}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6',
                    boxSizing: 'border-box',
                    fontSize: 16,
                  }}
                >
                  <option value="">-- Select --</option>
                  {['apartment','villa','house','condo','commercial','land','townhouse','penthouse'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$200,000 - $500,000"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6',
                    boxSizing: 'border-box',
                    fontSize: 16,
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your needs..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    fontSize: 16,
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: loading ? '#94a3b8' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function LeadCaptureForm() {
  const { agencyId } = useParams<{ agencyId: string }>();
  return <LeadCaptureFormView agencyId={agencyId} />;
}

export default LeadCaptureForm;
