'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUserSession } from '@/hooks/useUserSession';
import { loadAuditHistory } from '@/components/AuditTrail/AuditTrail';
import s from './Dashboard.module.css';

/* ─── Time of day greeting ──────────────────────────────────── */
function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── Particle network (light bg, subtle gold) ──────────────── */
type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number };

function useHeroParticles(ref: React.RefObject<HTMLCanvasElement>) {
  const raf  = useRef(0);
  const dots = useRef<Dot[]>([]);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const parent = cv.parentElement!;
    const init = () => {
      cv.width = parent.clientWidth;
      cv.height = parent.clientHeight;
      const n = Math.min(Math.floor((cv.width * cv.height) / 22_000), 40);
      dots.current = Array.from({ length: n }, () => ({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.22 + 0.06,
      }));
    };
    init();
    window.addEventListener('resize', init);
    const LINK = 110;
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const p = dots.current;
      for (const d of p) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > cv.width)  d.vx *= -1;
        if (d.y < 0 || d.y > cv.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${d.a * 0.3})`;
        ctx.fill();
      }
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[j].x, p[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${(1 - dist / LINK) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', init); };
  }, [ref]);
}

/* ─── Product card data ─────────────────────────────────────── */
const PRODUCTS = [
  { id: 'screening', icon: '🔍', name: 'Entity & Organisation Screening',
    desc: 'Screen individuals and entities against global sanctions, PEP, and criminal databases.',
    active: true, href: '/dashboard/screening' },
  { id: 'sanction', icon: '🛡️', name: 'Sanction Screening',
    desc: 'Real-time screening against global sanction lists.', active: false },
  { id: 'pep', icon: '👤', name: 'PEP Screening',
    desc: 'Identify Politically Exposed Persons instantly.', active: false },
  { id: 'regulatory', icon: '📋', name: 'Regulatory & Enforcement Monitoring',
    desc: 'Monitor regulatory actions and enforcement alerts.', active: false },
  { id: 'aml', icon: '🔎', name: 'AML Screening',
    desc: 'Detect money laundering patterns in real time.', active: false },
  { id: 'bre', icon: '📊', name: 'Credit & Risk Analytics (BRE)',
    desc: 'AI-driven credit scoring and risk assessment.', active: false },
];

/* ─── Props ─────────────────────────────────────────────────── */
interface Props {
  userName: string;
  userRole: string;
  userCompany: string;
}

export default function DashboardClient({ userName, userRole, userCompany }: Props) {
  const router    = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHeroParticles(canvasRef);

  /* Quick stats from localStorage audit history */
  const [stats, setStats] = useState({ total: 0, highRisk: 0, last: 'None yet' });

  useEffect(() => {
    /* Save session so DashboardNav can read user info */
    saveUserSession({ name: userName, role: userRole, company: userCompany });

    /* Hide root site footer */
    const f = document.querySelector<HTMLElement>('body > footer');
    if (f) f.style.display = 'none';
    document.body.style.background = '#f8f9fa';

    /* Compute quick stats */
    const history = loadAuditHistory();
    const highRisk = history.filter((e) => e.riskLevel === 'HIGH').length;
    const last = history[0]?.query?.slice(0, 12) || 'None yet';
    setStats({ total: history.length, highRisk, last });

    return () => {
      if (f) f.style.display = '';
      document.body.style.background = '';
    };
  }, [userName, userRole, userCompany]);

  /* Display name = company || firstName */
  const displayName = userCompany || userName.split(' ')[0] || userName;
  const greeting    = getTimeOfDay();

  return (
    <div className={s.page}>

      {/* ── SECTION 1 — Hero (two-column) ── */}
      <section className={s.hero}>
        <canvas ref={canvasRef} className={s.heroCanvas} aria-hidden="true" />
        <div className={s.heroRow}>

          {/* Left: greeting */}
          <div className={s.heroLeft}>
            <p className={s.greetingLabel}>{greeting},</p>
            <h2 className={s.greetingName}>
              <span className={s.nameGold}>{displayName}</span>
              <span className={s.wave}> 👋</span>
            </h2>
            <p className={s.greetingSubtitle}>
              Your AI-powered compliance command centre is ready.
              Stay ahead of financial crime with real-time intelligence.
            </p>
            <div className={s.goldUnderline} />
          </div>

          {/* Right: quick stat cards */}
          <div className={s.heroRight}>
            <div className={s.statCard}>
              <span className={s.statIcon}>🔍</span>
              <span className={s.statValue}>{stats.total || '—'}</span>
              <span className={s.statLabel}>Total Screenings</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statIcon}>⚠️</span>
              <span
                className={s.statValue}
                style={{ color: stats.highRisk > 0 ? '#dc2626' : '#16a34a' }}
              >
                {stats.total > 0 ? stats.highRisk : '—'}
              </span>
              <span className={s.statLabel}>High Risk Flagged</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statIcon}>🕐</span>
              <span className={s.statValue} style={{ fontSize: stats.last === 'None yet' ? '13px' : '16px' }}>
                {stats.last}
              </span>
              <span className={s.statLabel}>Last Screened</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2 — Compliance Modules ── */}
      <section className={s.modulesSection}>
        <div className={s.modulesLabel}>
          <div className={s.labelAccent} aria-hidden="true" />
          <span>Compliance Modules</span>
          <div className={s.labelLine} aria-hidden="true" />
        </div>

        <div className={s.cardsGrid}>
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className={p.active ? s.cardActive : s.cardSoon}
              onClick={() => p.active && p.href && router.push(p.href)}
              role={p.active ? 'button' : undefined}
              tabIndex={p.active ? 0 : undefined}
              onKeyDown={(e) => {
                if (p.active && p.href && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  router.push(p.href);
                }
              }}
              aria-disabled={!p.active}
            >
              <span className={s.cardIcon}>{p.icon}</span>
              <span className={`${s.badge} ${p.active ? s.badgeActive : s.badgeSoon}`}>
                {p.active ? 'Active' : 'Coming Soon'}
              </span>
              <h3 className={s.cardName}>{p.name}</h3>
              <p className={s.cardDesc}>{p.desc}</p>

              {/* Risk distribution reveal — active card only */}
              {p.active && (
                <div className={s.cardReveal}>
                  <p className={s.revealTitle}>Recent Risk Distribution</p>
                  <div className={s.riskBar}>
                    <div className={`${s.seg} ${s.segRed}`}   style={{ width: '30%' }} />
                    <div className={`${s.seg} ${s.segAmber}`} style={{ width: '45%' }} />
                    <div className={`${s.seg} ${s.segGreen}`} style={{ width: '25%' }} />
                  </div>
                  <div className={s.riskLegend}>
                    <span><i className={`${s.dot} ${s.dotRed}`}   />High</span>
                    <span><i className={`${s.dot} ${s.dotAmber}`} />Medium</span>
                    <span><i className={`${s.dot} ${s.dotGreen}`} />Low</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <span className={s.footerCopy}>© 2026 Resurgent India Pvt Ltd. All rights reserved.</span>
          <a href="#" className={s.footerLink}>Privacy Policy</a>
          <span className={s.footerSep}>·</span>
          <a href="#" className={s.footerLink}>Terms of Service</a>
          <span className={s.footerSep}>·</span>
          <a href="/contact-us" className={s.footerLink}>Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
