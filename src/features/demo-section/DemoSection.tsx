'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './DemoSection.module.css';

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  service: string;
  message: string;
  accepted: boolean;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  service?: string;
  accepted?: string;
}

const EMPTY_FORM: FormState = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  service: '',
  message: '',
  accepted: false,
};

export default function DemoSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'This field is required';
    if (!form.phone.trim()) {
      e.phone = 'This field is required';
    } else if (form.phone.replace(/[\s\-+()]/g, '').replace(/\D/g, '').length < 10) {
      e.phone = 'Please enter a valid phone number';
    }
    if (!form.email.trim()) {
      e.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!form.service) e.service = 'Please select a service';
    if (!form.accepted) e.accepted = 'This field is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm(EMPTY_FORM);
  };

  return (
    <div id="get-demo" className={styles.demoSection}>
      <div className={styles.demoCard}>
      <div className={styles.demoInner}>

        {/* ── LEFT COLUMN ── */}
        <div className={styles.demoLeft}>
          <span className={styles.demoLabel}>READY TO GET STARTED?</span>
          <h2 className={styles.demoHeading}>
            Get a Demo<br />
            <span className={styles.demoAccent}>That Changes Everything.</span>
          </h2>
          <p className={styles.demoBody}>
            Discover how Resurgent India&apos;s AML/CFT intelligence platform can transform
            your compliance operations. Our specialists will walk you through a live demo
            tailored to your business needs.
          </p>

          <div className={styles.demoButtonWrapper}>
            <button className={styles.demoButton} onClick={() => {
              const el = document.querySelector('#get-demo .formCard');
              el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}>
              Request a Demo →
            </button>
          </div>

          <hr className={styles.demoDivider} />

          {/* Row 1 — Office Address */}
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" width="20" height="20" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <span className={styles.infoLabel}>OFFICE ADDRESS</span>
              <p className={styles.infoValue}>
                Unit 903-906, 9th Floor, Tower C, Unitech Business Zone,
                Nirvana Country, Sector 50, Gurugram 122018
              </p>
            </div>
          </div>

          {/* Row 2 — Email */}
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" width="20" height="20" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <span className={styles.infoLabel}>EMAIL</span>
              <a href="mailto:aditya.kumar@resurgentindia.com" className={styles.infoLink}>
                aditya.kumar@resurgentindia.com
              </a>
            </div>
          </div>

          {/* Row 3 — Phone */}
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" width="20" height="20" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.48 2 2 0 0 1 3.59 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <span className={styles.infoLabel}>CONTACT</span>
              <a href="tel:+917840000667" className={styles.infoLink}>+91-78400 00667</a>
              <a href="tel:+919992001041" className={styles.infoLink}>+91-99920 01041</a>
            </div>
          </div>

          {/* Row 4 — Business Hours */}
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span className={styles.infoLabel}>BUSINESS HOURS</span>
              <p className={styles.infoValue}>Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — White enquiry form ── */}
        <div className={styles.demoRight}>
          <div className={styles.formCard}>
            <div className={styles.formCardInner}>
            {submitted ? (

              /* Success state */
              <div className={styles.successState} role="status">
                <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
                  <circle cx="30" cy="30" r="28"
                    fill="rgba(76,175,80,0.1)" stroke="#4CAF50" strokeWidth="2" />
                  <path d="M18 30l9 9 15-18"
                    fill="none" stroke="#4CAF50" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className={styles.successTitle}>Thank You!</h3>
                <p className={styles.successText}>
                  Your enquiry has been received.<br />
                  Our AML specialist will contact you within 24 hours.
                </p>
                <button className={styles.resetLink} onClick={() => setSubmitted(false)}>
                  Send another enquiry
                </button>
              </div>

            ) : (

              /* Form */
              <>
                <h2 className={styles.formTitle}>Send an Enquiry</h2>
                <p className={styles.formSubtext}>We respond within 24 hours — guaranteed.</p>
                <hr className={styles.formHeaderDivider} />

                <form onSubmit={handleSubmit} noValidate className={styles.formBody}>

                  {/* Row 1 — Name + Phone */}
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ds-fullName">
                        Full Name<span className={styles.formRequired}>*</span>
                      </label>
                      <input
                        id="ds-fullName"
                        type="text"
                        className={styles.formInput}
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={(e) => set('fullName', e.target.value)}
                      />
                      {errors.fullName && (
                        <span className={styles.fieldError}>{errors.fullName}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ds-phone">
                        Phone<span className={styles.formRequired}>*</span>
                      </label>
                      <input
                        id="ds-phone"
                        type="text"
                        className={styles.formInput}
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                      />
                      {errors.phone && (
                        <span className={styles.fieldError}>{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2 — Email + Company */}
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ds-email">
                        Email<span className={styles.formRequired}>*</span>
                      </label>
                      <input
                        id="ds-email"
                        type="email"
                        className={styles.formInput}
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                      />
                      {errors.email && (
                        <span className={styles.fieldError}>{errors.email}</span>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="ds-company">Company</label>
                      <input
                        id="ds-company"
                        type="text"
                        className={styles.formInput}
                        placeholder="Your organisation"
                        value={form.company}
                        onChange={(e) => set('company', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 3 — Service */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="ds-service">
                      Service Required<span className={styles.formRequired}>*</span>
                    </label>
                    <select
                      id="ds-service"
                      className={styles.formSelect}
                      value={form.service}
                      onChange={(e) => set('service', e.target.value)}
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="sanction-screening">Sanction Screening</option>
                      <option value="pep-screening">PEP Screening</option>
                      <option value="regulatory-monitoring">
                        Regulatory &amp; Enforcement Monitoring
                      </option>
                      <option value="aml-screening">AML Screening</option>
                      <option value="credit-risk">Credit &amp; Risk Analytics (BRE)</option>
                      <option value="full-suite">Full AML Suite</option>
                      <option value="enterprise">Custom Enterprise Solution</option>
                    </select>
                    {errors.service && (
                      <span className={styles.fieldError}>{errors.service}</span>
                    )}
                  </div>

                  {/* Row 4 — Message: grows to fill remaining height */}
                  <div className={styles.formTextareaGroup}>
                    <label className={styles.formLabel} htmlFor="ds-message">Message</label>
                    <textarea
                      id="ds-message"
                      className={styles.formTextarea}
                      rows={4}
                      placeholder="Describe your compliance requirements, number of customers to screen, current challenges..."
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                    />
                  </div>

                  {/* Row 5 — Checkbox */}
                  <div className={styles.formCheckboxRow}>
                    <input
                      id="ds-accepted"
                      type="checkbox"
                      checked={form.accepted}
                      onChange={(e) => set('accepted', e.target.checked)}
                    />
                    <label htmlFor="ds-accepted">
                      I accept Resurgent India&apos;s{' '}
                      <Link href="/privacy-policy" className={styles.privacyLink}>
                        Privacy Policy
                      </Link>{' '}
                      and agree to receive communications.
                    </label>
                  </div>
                  {errors.accepted && (
                    <span className={styles.fieldError}>{errors.accepted}</span>
                  )}

                  <p className={styles.formLegend}>* All marked fields are required</p>

                  <button type="submit" className={styles.submitButton}>
                    SEND ENQUIRY →
                  </button>

                </form>
              </>

            )}
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
