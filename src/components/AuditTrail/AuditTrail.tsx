'use client';

import s from './AuditTrail.module.css';

export interface AuditEntry {
  id: string;
  query: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  matchCount: number;
  timestamp: number;
}

interface Props {
  history: AuditEntry[];
  onSelect: (query: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const RISK_PILL: Record<string, string> = {
  HIGH: s.riskHigh,
  MEDIUM: s.riskMedium,
  LOW: s.riskLow,
};

export default function AuditTrail({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  return (
    <div className={s.auditTrail}>
      <h4 className={s.heading}>🕐 Recent Searches</h4>
      <div className={s.list}>
        {history.map((entry) => (
          <button
            key={entry.id}
            className={s.auditRow}
            onClick={() => onSelect(entry.query)}
            title={`Re-screen "${entry.query}"`}
          >
            <span className={s.auditQuery}>{entry.query}</span>
            <span className={`${s.riskPill} ${RISK_PILL[entry.riskLevel] ?? ''}`}>
              {entry.riskLevel}
            </span>
            <span className={s.auditMeta}>
              {entry.matchCount} match{entry.matchCount === 1 ? '' : 'es'} · {timeAgo(entry.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Utility: load the last 5 audit entries from localStorage. */
export function loadAuditHistory(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ri_search_history');
    return raw ? (JSON.parse(raw) as AuditEntry[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

/** Utility: prepend a new entry and persist (keeps last 5). */
export function saveAuditEntry(entry: Omit<AuditEntry, 'id'>): AuditEntry[] {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const newEntry: AuditEntry = { id, ...entry };
  const updated = [newEntry, ...loadAuditHistory()].slice(0, 5);
  try {
    localStorage.setItem('ri_search_history', JSON.stringify(updated));
  } catch { /* storage full — silent fail */ }
  return updated;
}
