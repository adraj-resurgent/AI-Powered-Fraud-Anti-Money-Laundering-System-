'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ContactSection.module.css';

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

export default function ContactSection() {
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
    if (!form.service) e.service = 'This field is required';
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
    <div className={styles.pageWrapper}>

      {/* ============================================================
          SECTION 1 — Hero strip (untouched)
          ============================================================ */}
      <section className={styles.heroStrip}>
        <div className={styles.heroStripInner}>

          <span className={styles.heroLabel}>GET IN TOUCH</span>

          <h1 className={styles.heroTitle}>
            Your Compliance.<br />
            <span className={styles.heroAccent}>Our Intelligence.</span><br />
            Zero Compromise.
          </h1>

          <p className={styles.heroSubtext}>
            Tell us about your compliance needs and our AML specialists will respond with a
            tailored solution within 24 hours. No obligation, no hidden fees.
          </p>

          <div className={styles.trustBadgesRow}>
            <div className={styles.trustBadge}>
              <span className={styles.trustBadgeIcon}>
                <svg viewBox="0 0 18 18" fill="none" width="18" height="18" aria-hidden="true">
                  <path d="M2 14V8M6 14V5M10 14V9M14 14V3"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              13M+ Data Records
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.trustBadgeIcon}>
                <svg viewBox="0 0 18 18" fill="none" width="18" height="18" aria-hidden="true">
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5M9 1.5C9 1.5 12 5 12 9s-3 7.5-3 7.5M1.5 9h15"
                    stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              1,000+ Global Sources
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.trustBadgeIcon}>
                <svg viewBox="0 0 18 18" fill="none" width="18" height="18" aria-hidden="true">
                  <circle cx="9" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.5 10.5L4 16l5-2.5 5 2.5-1.5-5.5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              25+ Years Expertise
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 2 — Split card (exact DemoSection structure)
          ============================================================ */}
      <div className={styles.splitWrapper}>
        <div className={styles.splitCard}>
          <div className={styles.splitRow}>

            {/* ── LEFT COLUMN (navy gradient) ── */}
            <div className={styles.splitLeft}>
              <span className={styles.csLabel}>READY TO GET STARTED?</span>
              <h2 className={styles.csHeading}>
                Get a Demo<br />
                <span className={styles.csAccent}>That Changes Everything.</span>
              </h2>
              <p className={styles.csBody}>
                Discover how Resurgent India&apos;s AML/CFT intelligence platform can transform
                your compliance operations. Our specialists will walk you through a live demo
                tailored to your business needs.
              </p>

              {/* Button with halo animation */}
              <div className={styles.csBtnWrap}>
                <button className={styles.csBtn}>
                  Request a Demo →
                </button>
              </div>

              <hr className={styles.csDivider} />

              {/* Row 1 — Office Address */}
              <div className={styles.csInfoRow}>
                <div className={styles.csInfoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div>
                  <span className={styles.csInfoLabel}>OFFICE ADDRESS</span>
                  <p className={styles.csInfoValue}>
                    Unit 903-906, 9th Floor, Tower C, Unitech Business Zone,
                    Nirvana Country, Sector 50, Gurugram 122018
                  </p>
                </div>
              </div>

              {/* Row 2 — Email */}
              <div className={styles.csInfoRow}>
                <div className={styles.csInfoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className={styles.csInfoLabel}>EMAIL</span>
                  <a href="mailto:aditya.kumar@resurgentindia.com" className={styles.csInfoLink}>
                    aditya.kumar@resurgentindia.com
                  </a>
                </div>
              </div>

              {/* Row 3 — Phone */}
              <div className={styles.csInfoRow}>
                <div className={styles.csInfoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.48 2 2 0 0 1 3.59 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className={styles.csInfoLabel}>CONTACT</span>
                  <a href="tel:+917840000667" className={styles.csInfoLink}>+91-78400 00667</a>
                  <a href="tel:+919992001041" className={styles.csInfoLink}>+91-99920 01041</a>
                </div>
              </div>

              {/* Row 4 — Business Hours */}
              <div className={styles.csInfoRow}>
                <div className={styles.csInfoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <span className={styles.csInfoLabel}>BUSINESS HOURS</span>
                  <p className={styles.csInfoValue}>Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (white form card) ── */}
            <div className={styles.splitRight}>
              <div className={styles.csFormCard}>
                <div className={styles.csFormInner}>
                  {submitted ? (

                    /* Success state */
                    <div className={styles.csSuccess} role="status">
                      <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
                        <circle cx="30" cy="30" r="28"
                          fill="rgba(76,175,80,0.1)" stroke="#4CAF50" strokeWidth="2" />
                        <path d="M18 30l9 9 15-18"
                          fill="none" stroke="#4CAF50" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <h3 className={styles.csSuccessTitle}>Thank You!</h3>
                      <p className={styles.csSuccessText}>
                        Your enquiry has been received.<br />
                        Our AML specialist will contact you within 24 hours.
                      </p>
                      <button className={styles.csResetLink} onClick={() => setSubmitted(false)}>
                        Send another enquiry
                      </button>
                    </div>

                  ) : (

                    /* Form */
                    <>
                      <h2 className={styles.csFormTitle}>Send an Enquiry</h2>
                      <p className={styles.csFormSubtext}>We respond within 24 hours — guaranteed.</p>
                      <hr className={styles.csFormDivider} />

                      <form onSubmit={handleSubmit} noValidate className={styles.csFormBody}>

                        {/* Row 1 — Name + Phone */}
                        <div className={styles.csFormGrid}>
                          <div className={styles.csFormGroup}>
                            <label className={styles.csFormLabel} htmlFor="cs-fullName">
                              Full Name<span className={styles.csFormRequired}>*</span>
                            </label>
                            <input
                              id="cs-fullName"
                              type="text"
                              className={styles.csFormInput}
                              placeholder="Your full name"
                              value={form.fullName}
                              onChange={(e) => set('fullName', e.target.value)}
                            />
                            {errors.fullName && <span className={styles.csFieldError}>{errors.fullName}</span>}
                          </div>
                          <div className={styles.csFormGroup}>
                            <label className={styles.csFormLabel} htmlFor="cs-phone">
                              Phone<span className={styles.csFormRequired}>*</span>
                            </label>
                            <input
                              id="cs-phone"
                              type="text"
                              className={styles.csFormInput}
                              placeholder="+91 XXXXX XXXXX"
                              value={form.phone}
                              onChange={(e) => set('phone', e.target.value)}
                            />
                            {errors.phone && <span className={styles.csFieldError}>{errors.phone}</span>}
                          </div>
                        </div>

                        {/* Row 2 — Email + Company */}
                        <div className={styles.csFormGrid}>
                          <div className={styles.csFormGroup}>
                            <label className={styles.csFormLabel} htmlFor="cs-email">
                              Email<span className={styles.csFormRequired}>*</span>
                            </label>
                            <input
                              id="cs-email"
                              type="email"
                              className={styles.csFormInput}
                              placeholder="you@company.com"
                              value={form.email}
                              onChange={(e) => set('email', e.target.value)}
                            />
                            {errors.email && <span className={styles.csFieldError}>{errors.email}</span>}
                          </div>
                          <div className={styles.csFormGroup}>
                            <label className={styles.csFormLabel} htmlFor="cs-company">Company</label>
                            <input
                              id="cs-company"
                              type="text"
                              className={styles.csFormInput}
                              placeholder="Your organisation"
                              value={form.company}
                              onChange={(e) => set('company', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Row 3 — Service */}
                        <div className={styles.csFormGroup}>
                          <label className={styles.csFormLabel} htmlFor="cs-service">
                            Service Required<span className={styles.csFormRequired}>*</span>
                          </label>
                          <select
                            id="cs-service"
                            className={styles.csFormSelect}
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
                          {errors.service && <span className={styles.csFieldError}>{errors.service}</span>}
                        </div>

                        {/* Row 4 — Message (grows to fill height) */}
                        <div className={styles.csTextareaGroup}>
                          <label className={styles.csFormLabel} htmlFor="cs-message">Message</label>
                          <textarea
                            id="cs-message"
                            className={styles.csFormTextarea}
                            rows={4}
                            placeholder="Describe your compliance requirements, number of customers to screen, current challenges..."
                            value={form.message}
                            onChange={(e) => set('message', e.target.value)}
                          />
                        </div>

                        {/* Row 5 — Checkbox */}
                        <div className={styles.csCheckboxRow}>
                          <input
                            id="cs-accepted"
                            type="checkbox"
                            checked={form.accepted}
                            onChange={(e) => set('accepted', e.target.checked)}
                          />
                          <label htmlFor="cs-accepted">
                            I accept Resurgent India&apos;s{' '}
                            <Link href="/privacy-policy" className={styles.csPrivacyLink}>
                              Privacy Policy
                            </Link>{' '}
                            and agree to receive communications.
                          </label>
                        </div>
                        {errors.accepted && <span className={styles.csFieldError}>{errors.accepted}</span>}

                        <p className={styles.csFormLegend}>* All marked fields are required</p>

                        <button type="submit" className={styles.csSubmitBtn}>
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

      {/* ============================================================
          SECTION 3 — Find Us / Google Maps
          ============================================================ */}
      <div className={styles.mapSection}>
        <div className={styles.mapInner}>
          <h2 className={styles.mapHeading}>Find Us</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://maps.google.com/maps?q=Unitech+Business+Zone,+Nirvana+Country,+Sector+50,+Gurugram,+Haryana+122018,+India&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Resurgent India Office Location"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
