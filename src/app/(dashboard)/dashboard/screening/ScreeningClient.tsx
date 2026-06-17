'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import s from './Screening.module.css';

/* ─── Types ─────────────────────────────────────────────────── */
interface Match {
  name: string;
  source_agency: string;
  source_list: string;
  dob: string | null;
  similarity: number | null;
  risk_category: string;
  detail_page_url: string | null;
}

interface Normalized {
  queriedName: string;
  matches: Match[];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  total: number;
  timeSec: string;
  odi: Record<string, any> | null;
  fatf: string | null;
}

interface HistoryEntry {
  id: number;
  query: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  matchCount: number;
  screeningTimeMs: number | null;
  timestamp: number;
  fullResults?: any;   // raw API response; may be absent on old entries
}

/* ─── Normaliser ────────────────────────────────────────────── */
function normalize(raw: any, queriedName: string): Normalized {
  const arr = raw?.matches ?? raw?.results ?? [];
  const matches: Match[] = (Array.isArray(arr) ? arr : []).map((m: any) => ({
    name: m?.name ?? m?.entity_name ?? '—',
    source_agency: m?.source_agency ?? '—',
    source_list: m?.source_list ?? '—',
    dob: m?.date_of_birth ?? m?.dob ?? null,
    similarity: typeof m?.similarity === 'number' ? m.similarity : null,
    risk_category: (m?.risk_category ?? '').toString().toLowerCase(),
    detail_page_url:
      [m?.detail_page_url, m?.source_url, m?.source_page_url, m?.document_url]
        .find((u: unknown) => typeof u === 'string' && u.trim().length > 0) ?? null,
  }));
  let rl = (raw?.risk_level ?? '').toString().toUpperCase();
  if (!['HIGH', 'MEDIUM', 'LOW'].includes(rl)) {
    rl = matches.length > 5 ? 'HIGH' : matches.length > 0 ? 'MEDIUM' : 'LOW';
  }
  const ms = raw?.screening_time_ms ?? null;
  return {
    queriedName,
    matches,
    riskLevel: rl as 'HIGH' | 'MEDIUM' | 'LOW',
    total: raw?.total_matches ?? matches.length,
    timeSec: ms !== null ? `${(ms / 1000).toFixed(1)}s` : '—',
    odi: raw?.odi_cross_reference ?? null,
    fatf: raw?.fatf_jurisdiction_flag ?? null,
  };
}

/* ─── Similarity cell ───────────────────────────────────────── */
function SimCell({ value }: { value: number | null }) {
  if (value === null) return <span className={`${s.simPill} ${s.simGrey}`}>N/A</span>;
  const pct = Math.round(value * 100);
  const pillCls = value >= 0.9 ? s.simGold : value >= 0.6 ? s.simOrange : s.simGrey;
  const barCls  = value >= 0.9 ? s.barGold  : value >= 0.6 ? s.barOrange  : s.barGrey;
  return (
    <div className={s.simCell}>
      <span className={`${s.simPill} ${pillCls}`}>{pct}%</span>
      <div className={s.simBar}>
        <div className={`${s.simBarFill} ${barCls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Risk category badge ────────────────────────────────────── */
function RiskBadge({ category }: { category: string }) {
  const c = category.toLowerCase();
  if (c === 'criminal')       return <span className={`${s.catBadge} ${s.catCriminal}`}>Criminal</span>;
  if (c === 'informational')  return <span className={`${s.catBadge} ${s.catInfo}`}>Info</span>;
  if (c.includes('sanction')) return <span className={`${s.catBadge} ${s.catSanction}`}>Sanctioned</span>;
  if (c === 'pep')            return <span className={`${s.catBadge} ${s.catPep}`}>PEP</span>;
  const label = category ? category.charAt(0).toUpperCase() + category.slice(1) : '—';
  return <span className={`${s.catBadge} ${s.catDefault}`}>{label}</span>;
}

/* ─── Time formatter ─────────────────────────────────────────── */
function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const now = new Date();
  const d   = new Date(ts);
  const hhmm = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (
    d.getDate()  === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) return `Today, ${hhmm}`;
  const dd  = d.getDate().toString().padStart(2, '0');
  const mmm = d.toLocaleString('en-IN', { month: 'short' });
  return `${dd} ${mmm}, ${hhmm}`;
}

/* ─── localStorage helpers ───────────────────────────────────── */
const LS_KEY = 'ri_search_history';

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(0, 50))); } catch { /* ignore */ }
}

/* ─── Pagination constant ────────────────────────────────────── */
const PAGE_SIZE = 10;

/* ─── Component ─────────────────────────────────────────────── */
export default function ScreeningClient() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query,       setQuery]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [rawResults,  setRawResults]  = useState<any>(null);
  const [queryUsed,   setQueryUsed]   = useState('');   // query that produced current results
  const [error,       setError]       = useState(false);
  const [activeView,  setActiveView]  = useState<'inbox' | 'results'>('inbox');
  const [history,     setHistory]     = useState<HistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted,     setMounted]     = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ── On mount ── */
  useEffect(() => {
    setMounted(true);
    setHistory(loadHistory());
    const f = document.querySelector<HTMLElement>('body > footer');
    if (f) f.style.display = 'none';
    document.body.style.background = '#f8f9fa';
    return () => {
      if (f) f.style.display = '';
      document.body.style.background = '';
    };
  }, []);

  /* ── Escape key closes palette ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && paletteOpen) closePalette(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [paletteOpen]);

  /* ── Palette open / close ── */
  const openPalette = () => {
    setPaletteOpen(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closePalette = () => {
    setPaletteOpen(false);
    document.body.style.overflow = '';
  };

  const prefillAndOpen = (name: string) => {
    setQuery(name);
    openPalette();
  };

  /* ── Search ── */
  const handleSearch = async () => {
    const name = query.trim();
    if (!name || isLoading) return;
    setIsLoading(true);
    setError(false);
    try {
      const res  = await fetch('/api/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) { setError(true); return; }

      /* Save full response in history */
      const entry: HistoryEntry = {
        id: Date.now(),
        query: name,
        riskLevel:
          (['HIGH','MEDIUM','LOW'].includes((data.risk_level ?? '').toUpperCase())
            ? data.risk_level.toUpperCase()
            : data.matches?.length > 5 ? 'HIGH' : data.matches?.length > 0 ? 'MEDIUM' : 'LOW'
          ) as 'HIGH' | 'MEDIUM' | 'LOW',
        matchCount: data.total_matches ?? (data.matches?.length ?? 0),
        screeningTimeMs: data.screening_time_ms ?? null,
        timestamp: Date.now(),
        fullResults: data,
      };
      const updated = [entry, ...history].slice(0, 50);
      saveHistory(updated);
      setHistory(updated);

      setRawResults(data);
      setQueryUsed(name);
      setCurrentPage(1);
      closePalette();
      setActiveView('results');
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── View results from history ── */
  const viewResults = (entry: HistoryEntry) => {
    if (entry.fullResults) {
      setRawResults(entry.fullResults);
      setQueryUsed(entry.query);
      setQuery(entry.query);
      setCurrentPage(1);
      setActiveView('results');
    } else {
      /* Old entry without stored results → re-open palette pre-filled */
      prefillAndOpen(entry.query);
    }
  };

  /* ── Back to inbox ── */
  const backToInbox = () => setActiveView('inbox');

  /* ── Clear history ── */
  const clearHistory = () => {
    localStorage.removeItem(LS_KEY);
    setHistory([]);
    if (activeView === 'results') setActiveView('inbox');
  };

  /* ── Derived / pagination ── */
  const norm = rawResults ? normalize(rawResults, queryUsed) : null;
  const showDOB = (norm?.matches ?? []).some(m => m.dob && m.dob.trim().length > 0);
  const totalMatches = norm?.matches.length ?? 0;
  const totalPages   = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));
  const displayed    = (norm?.matches ?? []).slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);

  const riskBorderColor =
    norm?.riskLevel === 'HIGH'   ? '#dc2626'
    : norm?.riskLevel === 'MEDIUM' ? '#d97706'
    : '#16a34a';

  /* ── Render ── */
  return (
    <div className={s.screeningPage}>

      {/* ── Breadcrumb (fixed) ── */}
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/dashboard" className={s.breadcrumbLink}>Dashboard</Link>
        <span className={s.breadcrumbSep}>›</span>
        <span className={s.breadcrumbCurrent}>Entity Screening</span>
      </nav>

      {/* ═══════════════════════════════════════
          TOP BAR — always visible
          ═══════════════════════════════════════ */}
      <div className={s.topBar}>
        <div className={s.topBarLeft}>
          <h1 className={s.pageTitle}>Entity &amp; Organisation Screening</h1>
          <p className={s.pageSubtitle}>
            Screen individuals and entities across 13M+ global sanctions, PEP, and criminal records instantly.
          </p>
        </div>
        <div className={s.topBarRight}>
          <div className={s.searchTrigger} onClick={openPalette} role="button" tabIndex={0}
               onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openPalette(); }}>
            <span className={s.searchTriggerIcon}>🔍</span>
            <span className={s.searchTriggerText}>Search any entity or individual...</span>
            <span className={s.searchTriggerHint}>Click to search</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT AREA — inbox / results
          ═══════════════════════════════════════ */}
      <div className={s.mainContent}>

        {/* ── VIEW 1: INBOX ── */}
        <div className={activeView === 'inbox' ? s.inboxView : s.inboxViewHidden}
             aria-hidden={activeView !== 'inbox'}>
          <div className={s.inboxHeader}>
            <div className={s.inboxHeaderLeft}>
              <h2 className={s.inboxTitle}>Recent Screenings</h2>
              {mounted && (
                <span className={s.inboxCount}>
                  {history.length} screening{history.length === 1 ? '' : 's'} this session
                </span>
              )}
            </div>
            {mounted && history.length > 0 && (
              <button className={s.clearHistoryBtn} onClick={clearHistory}>Clear History</button>
            )}
          </div>

          {!mounted ? null : history.length === 0 ? (
            /* Empty state */
            <div className={s.emptyInbox}>
              <div className={s.emptyInboxIcon}>🔍</div>
              <h3>No screenings yet</h3>
              <p>
                Search for any individual or organisation to begin.
                Your screening history will appear here.
              </p>
              <div className={s.exampleChips}>
                {['Nirav Modi', 'Goldman Sachs', 'Vijay Mallya'].map(name => (
                  <span key={name} className={s.chip}
                        onClick={() => prefillAndOpen(name)} role="button" tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') prefillAndOpen(name); }}>
                    Try: {name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* History table */
            <div className={s.historyTable}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Entity / Individual</th>
                    <th>Risk Level</th>
                    <th>Matches</th>
                    <th>Screened At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, i) => (
                    <tr key={entry.id ?? i} onClick={() => viewResults(entry)} className={s.historyRow}>
                      <td className={s.cellMuted}>{i + 1}</td>
                      <td className={s.historyQuery}>{entry.query}</td>
                      <td>
                        <span className={`${s.riskBadge} ${
                          entry.riskLevel === 'HIGH'   ? s.riskHigh
                          : entry.riskLevel === 'MEDIUM' ? s.riskMedium
                          : s.riskLow
                        }`}>{entry.riskLevel}</span>
                      </td>
                      <td>{entry.matchCount} matches</td>
                      <td className={s.cellMuted}>{formatTime(entry.timestamp)}</td>
                      <td onClick={e => e.stopPropagation()} className={s.actionCell}>
                        {entry.fullResults && (
                          <button className={s.viewReportBtn}
                                  onClick={() => viewResults(entry)}>View Report</button>
                        )}
                        <button className={s.reScreenBtn}
                                onClick={() => prefillAndOpen(entry.query)}>Re-screen</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── VIEW 3: RESULTS ── */}
        <div className={activeView === 'results' ? s.resultsView : s.resultsViewHidden}
             aria-hidden={activeView !== 'results'}>
          {norm && (
            <>
              {/* Results header */}
              <div className={s.resultsViewHeader}>
                <button className={s.backToInbox} onClick={backToInbox}>
                  ← Back to Screenings
                </button>
                <div className={s.resultsSummaryBar}
                     style={{ borderLeft: `4px solid ${riskBorderColor}` }}>
                  <div className={s.resultsSummaryLeft}>
                    <h2 className={s.resultsEntityName}>{norm.queriedName}</h2>
                    <span className={s.resultsMetaLine}>
                      {norm.total} match{norm.total === 1 ? '' : 'es'} found
                      {' · '}Screened in {norm.timeSec}
                    </span>
                  </div>
                  <div className={s.resultsSummaryRight}>
                    <span className={`${s.riskBadgeXL} ${
                      norm.riskLevel === 'HIGH'   ? s.riskBadgeXLHigh
                      : norm.riskLevel === 'MEDIUM' ? s.riskBadgeXLMedium
                      : s.riskBadgeXLLow
                    }`}>{norm.riskLevel} RISK</span>
                    <button className={s.newSearchBtn} onClick={openPalette}>+ New Search</button>
                  </div>
                </div>
              </div>

              {/* FATF flag */}
              {norm.fatf && (
                <div className={s.fatfBanner}>
                  ⚠️ FATF Jurisdiction Flag: <strong>{norm.fatf}</strong>
                </div>
              )}

              {/* Results table */}
              {norm.matches.length > 0 ? (
                <>
                  <div className={s.resultsTableWrap}>
                    <table className={s.resultsTable}>
                      <thead>
                        <tr>
                          <th>#</th><th>Name</th><th>Source Agency</th><th>Source List</th>
                          {showDOB && <th>DOB</th>}
                          <th>Similarity</th><th>Risk Category</th>
                          <th className={s.stickyRight}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayed.map((m, i) => {
                          const c = m.risk_category;
                          const rowCls =
                            c === 'criminal' || c.includes('sanction') ? s.rowDanger
                            : c === 'informational' ? s.rowInfo
                            : c === 'pep' ? s.rowPep
                            : '';
                          return (
                            <tr key={(currentPage-1)*PAGE_SIZE+i} className={rowCls}>
                              <td className={s.cellMuted}>{(currentPage-1)*PAGE_SIZE+i+1}</td>
                              <td className={s.cellName}>{m.name}</td>
                              <td>{m.source_agency}</td>
                              <td>{m.source_list}</td>
                              {showDOB && <td className={s.cellMuted}>{m.dob || '—'}</td>}
                              <td><SimCell value={m.similarity} /></td>
                              <td><RiskBadge category={m.risk_category} /></td>
                              <td className={s.stickyRight}>
                                {m.detail_page_url ? (
                                  <a className={s.viewBtn} href={m.detail_page_url}
                                     target="_blank" rel="noopener noreferrer">View Source</a>
                                ) : (
                                  <span className={`${s.viewBtn} ${s.viewBtnDisabled}`}>View Source</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className={s.pagination}>
                      <button className={s.pageBtn}
                              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                              disabled={currentPage === 1}>← Prev</button>
                      <span className={s.pageInfo}>Page {currentPage} of {totalPages}</span>
                      <button className={s.pageBtn}
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                              disabled={currentPage === totalPages}>Next →</button>
                    </div>
                  )}
                </>
              ) : (
                <div className={s.noMatches}>✓ No matches found. This entity appears clear.</div>
              )}

              {/* ODI */}
              <div className={s.odiCard}>
                <h3 className={s.odiTitle}>ODI Cross Reference</h3>
                {norm.odi?.found ? (
                  <>
                    <div className={s.odiSummary}>
                      {norm.odi.total_investments != null && (
                        <span><strong>{norm.odi.total_investments}</strong> investment{norm.odi.total_investments === 1 ? '' : 's'}</span>
                      )}
                      {norm.odi.total_usd_mn != null && (
                        <span><strong>${norm.odi.total_usd_mn}M</strong></span>
                      )}
                      {Array.isArray(norm.odi.countries) && norm.odi.countries.length > 0 && (
                        <span>{norm.odi.countries.join(', ')}</span>
                      )}
                    </div>
                    {(Array.isArray(norm.odi.top_investments) ? norm.odi.top_investments : []).map((inv: any, i: number) => (
                      <div key={i} className={s.odiItem}>
                        <strong>{inv.indian_party ?? '—'}</strong>
                        {inv.jv_wos_name ? ` → ${inv.jv_wos_name}` : ''}
                        {inv.country ? ` · ${inv.country}` : ''}
                        {inv.total_usd_mn != null ? ` · $${inv.total_usd_mn}M` : ''}
                        {inv.period_from ? ` · from ${inv.period_from}` : ''}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className={s.odiEmpty}>ℹ️ No ODI cross-reference data found for this entity.</p>
                )}
              </div>
            </>
          )}
        </div>

      </div>{/* /mainContent */}

      {/* ═══════════════════════════════════════
          COMMAND PALETTE — VIEW 2
          ═══════════════════════════════════════ */}
      <div
        className={`${s.paletteOverlay} ${paletteOpen ? s.paletteOverlayOpen : ''}`}
        onClick={closePalette}
        aria-hidden={!paletteOpen}
      >
        <div
          className={`${s.palette} ${paletteOpen ? s.paletteOpen : ''}`}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Search entities"
        >
          {/* Palette header */}
          <div className={s.paletteHeader}>
            <span className={s.paletteLogoMark}>🔍</span>
            <h3 className={s.paletteTitle}>Screen Entity or Individual</h3>
            <button className={s.paletteClose} onClick={closePalette} aria-label="Close">✕</button>
          </div>

          {/* Search input */}
          <div className={s.paletteInputRow}>
            <span className={s.paletteInputIcon}>🏢</span>
            <input
              ref={inputRef}
              className={s.paletteInput}
              type="text"
              placeholder="e.g. Goldman Sachs, Nirav Modi, Vijay Mallya..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              disabled={isLoading}
              autoComplete="off"
            />
            {query && !isLoading && (
              <button className={s.clearInputBtn} onClick={() => setQuery('')} aria-label="Clear">✕</button>
            )}
          </div>

          {/* Example chips — only when query empty and not loading */}
          {!query && !isLoading && !error && (
            <div className={s.paletteExamples}>
              <p className={s.paletteExamplesLabel}>Suggested searches</p>
              <div className={s.paletteChips}>
                {['Nirav Modi', 'Goldman Sachs', 'Vijay Mallya'].map(name => (
                  <span key={name} className={s.paletteChip}
                        onClick={() => { setQuery(name); setTimeout(() => inputRef.current?.focus(), 10); }}
                        role="button" tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') { setQuery(name); inputRef.current?.focus(); } }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className={s.paletteLoading}>
              <div className={s.paletteSpinner} />
              <div className={s.paletteLoadingText}>
                <p className={s.paletteLoadingTitle}>Screening in progress...</p>
                <p className={s.paletteLoadingSubtitle}>
                  Checking across 13M+ records from global sanctions, Interpol, PEP databases and more
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className={s.paletteError}>
              <span>⚠️ Screening failed. Please check your connection and try again.</span>
              <button onClick={handleSearch} className={s.paletteRetryBtn}>↺ Retry</button>
            </div>
          )}

          {/* Footer */}
          <div className={s.paletteFooter}>
            <span className={s.paletteFooterHint}>Press Enter or click Screen Now to search</span>
            <button
              className={s.paletteScreenBtn}
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? 'Screening...' : 'Screen Now →'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
