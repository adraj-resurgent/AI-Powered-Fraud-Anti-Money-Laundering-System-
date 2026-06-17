'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import s from './LoginPage.module.css';

const EyeOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();

  // Hide the root site-wide footer (we render our own sticky footer)
  useEffect(() => {
    const f = document.querySelector<HTMLElement>('body > footer');
    if (f) f.style.display = 'none';
    return () => { if (f) f.style.display = ''; };
  }, []);

  // Parallax: top gap starts at 48px and shrinks to 0 as user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const wrapper = document.querySelector<HTMLElement>(`.${s.scrollWrapper}`);
      if (wrapper) {
        const newPadding = Math.max(0, 48 - window.scrollY * 0.48);
        wrapper.style.paddingTop = newPadding + 'px';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) { router.push('/dashboard'); }
      else        { setError(data.error || 'Login failed. Please try again.'); }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>

      {/* ── Content area ───────────────────────────────────── */}
      <div className={s.content}>
        <div className={s.scrollWrapper}>
        <div className={s.splitCard}>

          {/* ── LEFT — navy branding panel ─────────────────── */}
          <div className={s.left}>
            <div className={s.logoWrap}>
              <Image
                src="/resurgent-logo.png"
                alt="Resurgent India"
                width={200}
                height={52}
                style={{ objectFit: 'contain', height: '48px', width: 'auto' }}
                priority
              />
            </div>

            <h1 className={s.tagline}>
              AI-Powered<br />
              <span className={s.taglineAccent}>AML/CFT Compliance</span><br />
              for BFSI
            </h1>

            <p className={s.taglineSub}>
              Real-time financial crime prevention powered by 13M+ proprietary
              records from 1,000+ global sources.
            </p>

            <ul className={s.features}>
              {[
                { icon: '🛡️', text: '13M+ Proprietary Data Records' },
                { icon: '🌐', text: '1,000+ Global & Indian Sources' },
                { icon: '⚡', text: 'Real-time Sanction & PEP Screening' },
                { icon: '📊', text: 'RBI / SEBI / PMLA Compliant' },
                { icon: '🔒', text: 'Bank-grade Security & Encryption' },
              ].map(f => (
                <li key={f.text} className={s.feature}>
                  <span className={s.featureIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <p className={s.support}>
              Need access?&nbsp;
              <a href="mailto:sales@resurgentindia.com" className={s.supportLink}>
                Contact sales →
              </a>
            </p>
          </div>

          {/* ── RIGHT — form panel with 3D card ────────────── */}
          <div className={s.right}>
            <div className={s.formCard}>

              <div className={s.formHeader}>
                <h2 className={s.formTitle}>Welcome back</h2>
                <p className={s.formSubtitle}>Sign in to your compliance platform</p>
              </div>

              <form onSubmit={handleSubmit} className={s.form} noValidate>

                {/* Email */}
                <div className={s.field}>
                  <label className={s.label} htmlFor="lp-email">Email Address</label>
                  <input
                    id="lp-email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className={s.input}
                  />
                </div>

                {/* Password */}
                <div className={s.field}>
                  <label className={s.label} htmlFor="lp-pass">Password</label>
                  <div className={s.passWrap}>
                    <input
                      id="lp-pass"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className={s.input}
                    />
                    <button
                      type="button"
                      className={s.eye}
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff /> : <EyeOn />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot */}
                <div className={s.checkRow}>
                  <label className={s.checkLabel}>
                    <input
                      type="checkbox"
                      className={s.checkInput}
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span className={`${s.checkBox}${rememberMe ? ` ${s.checked}` : ''}`} aria-hidden="true" />
                    Remember me
                  </label>
                  <a href="#" className={s.forgot} onClick={e => e.preventDefault()}>
                    Forgot Password?
                  </a>
                </div>

                {/* Error */}
                {error && (
                  <div className={s.error} role="alert">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      width="14" height="14" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} className={s.btn}>
                  {loading
                    ? <><span className={s.spinner} /> Signing in…</>
                    : 'Sign In →'
                  }
                </button>

              </form>

              {/* Trust badges */}
              <div className={s.badges}>
                <span className={s.badge}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  256-bit Encryption
                </span>
                <span className={s.badge}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Session protected
                </span>
              </div>

            </div>
          </div>

        </div>
        </div>{/* /scrollWrapper */}
      </div>

      {/* ── Footer — sticky, always visible at bottom ─── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <span className={s.footerCopy}>
            © 2026 Resurgent India Pvt Ltd. All rights reserved.
          </span>
          <nav className={s.footerLinks}>
            <a href="#" className={s.footerLink}>Privacy Policy</a>
            <span className={s.footerSep}>·</span>
            <a href="#" className={s.footerLink}>Terms of Service</a>
            <span className={s.footerSep}>·</span>
            <a href="/contact-us" className={s.footerLink}>Contact Us</a>
          </nav>
        </div>
      </footer>

    </div>
  );
}
