'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  account_type: string;
  expires_at: string | null;
  is_active: boolean;
  last_login: string | null;
}

interface Props {
  users: User[];
}

const EMPTY_FORM = { name: '', email: '', company: '', days: 2, password: '', role: 'client' };

export default function AdminPanel({ users }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const showNotice = (type: 'ok' | 'err', msg: string) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 6000);
  };

  const adminCall = async (
    body: Record<string, unknown>,
    successMsg?: string,
  ) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      showNotice('ok', successMsg ?? 'Done.');
      return data;
    }
    showNotice('err', data.error ?? 'Something went wrong.');
    return null;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const result = await adminCall({ action: 'create', ...form });
    if (result) {
      if (result.tempPass) {
        showNotice('ok', `✓ User created! Auto-generated password: ${result.tempPass}`);
      } else {
        showNotice('ok', `✓ User created with the password you set.`);
      }
      setForm(EMPTY_FORM);
      refresh();
    }
    setCreating(false);
  };

  const handleRevoke = async (id: number, name: string) => {
    if (!confirm(`Revoke access for ${name}?`)) return;
    setActionId(id);
    await adminCall({ action: 'revoke', id }, `${name}'s access revoked.`);
    setActionId(null);
    refresh();
  };

  const handleExtend = async (id: number, name: string) => {
    setActionId(id);
    await adminCall({ action: 'extend', id, days: 1 }, `${name}'s access extended by 1 day.`);
    setActionId(null);
    refresh();
  };

  const handleConvert = async (id: number, name: string) => {
    if (!confirm(`Convert ${name} to a full account?`)) return;
    setActionId(id);
    await adminCall({ action: 'convert', id }, `${name} converted to full account.`);
    setActionId(null);
    refresh();
  };

  const fmt = (ts: string | null) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', {
      dateStyle: 'medium', timeStyle: 'short',
    });
  };

  return (
    <div className="ap">
      {/* Notice banner */}
      {notice && (
        <div className={`ap-notice ap-notice--${notice.type}`}>
          {notice.msg}
        </div>
      )}

      {/* ── Create form ── */}
      <section className="ap-section">
        <h2 className="ap-section-title">Create User</h2>
        <form onSubmit={handleCreate} className="ap-create-form">

          {/* Row 1 — Name + Email */}
          <div className="ap-form-group">
            <label className="ap-label">Full Name *</label>
            <input required className="ap-input" placeholder="Full name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="ap-form-group">
            <label className="ap-label">Email *</label>
            <input type="email" required className="ap-input" placeholder="user@company.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="ap-form-group">
            <label className="ap-label">Company</label>
            <input className="ap-input" placeholder="Company name"
              value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>

          {/* Password field with show/hide toggle */}
          <div className="ap-form-group ap-pass-group">
            <label className="ap-label">
              Password
              <span className="ap-label-hint">(leave blank to auto-generate)</span>
            </label>
            <div className="ap-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className="ap-input"
                placeholder="Set password or leave blank"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="ap-pass-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div className="ap-form-group ap-form-group--sm">
            <label className="ap-label">Role</label>
            <select className="ap-input ap-select"
              value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Days */}
          <div className="ap-form-group ap-form-group--sm">
            <label className="ap-label">Days</label>
            <input type="number" min={1} max={365} className="ap-input"
              value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
          </div>

          <button type="submit" disabled={creating} className="ap-btn ap-btn--primary ap-create-btn">
            {creating ? 'Creating…' : '+ Create User'}
          </button>
        </form>
      </section>

      {/* ── Users table ── */}
      <section className="ap-section">
        <div className="ap-section-header">
          <h2 className="ap-section-title">All Users ({users.length})</h2>
          <button
            onClick={refresh}
            disabled={isPending}
            className="ap-btn ap-btn--ghost"
          >
            {isPending ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Company</th>
                <th>Type</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const busy = actionId === u.id;
                const expired = u.expires_at ? new Date(u.expires_at) < new Date() : false;
                return (
                  <tr key={u.id} className={!u.is_active ? 'ap-row--inactive' : ''}>
                    <td>
                      <div className="ap-cell-name">{u.name}</div>
                      <div className="ap-cell-email">{u.email}</div>
                    </td>
                    <td>{u.company ?? '—'}</td>
                    <td>
                      <span className={`ap-badge ${u.account_type === 'full' ? 'ap-badge--full' : 'ap-badge--demo'}`}>
                        {u.account_type}
                      </span>
                    </td>
                    <td>
                      <span className={expired ? 'ap-expired' : ''}>
                        {fmt(u.expires_at)}
                      </span>
                    </td>
                    <td>
                      <span className={`ap-badge ${u.is_active ? 'ap-badge--active' : 'ap-badge--inactive'}`}>
                        {u.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td className="ap-cell-muted">{fmt(u.last_login)}</td>
                    <td>
                      <div className="ap-actions">
                        {u.account_type === 'demo' && (
                          <button
                            disabled={busy}
                            onClick={() => handleExtend(u.id, u.name)}
                            className="ap-btn ap-btn--sm ap-btn--extend"
                            title="Extend by 1 day"
                          >
                            +1 Day
                          </button>
                        )}
                        {u.account_type === 'demo' && (
                          <button
                            disabled={busy}
                            onClick={() => handleConvert(u.id, u.name)}
                            className="ap-btn ap-btn--sm ap-btn--convert"
                            title="Convert to full account"
                          >
                            → Full
                          </button>
                        )}
                        {u.is_active && (
                          <button
                            disabled={busy}
                            onClick={() => handleRevoke(u.id, u.name)}
                            className="ap-btn ap-btn--sm ap-btn--revoke"
                            title="Revoke access"
                          >
                            Revoke
                          </button>
                        )}
                        {!u.is_active && (
                          <span className="ap-cell-muted" style={{ fontSize: 12 }}>Revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    No users yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .ap { max-width: 1300px; margin: 0 auto; padding: 40px; display: flex; flex-direction: column; gap: 32px; }
        .ap-notice {
          padding: 14px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
        }
        .ap-notice--ok  { background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; }
        .ap-notice--err { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; }
        .ap-section {
          background:#fff; border-radius:16px; padding:28px 32px;
          border:1px solid #d6e4f0;
          box-shadow:0 4px 16px rgba(30,64,120,0.06);
        }
        .ap-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .ap-section-title { font-size:18px; font-weight:800; color:#1E3A5F; margin:0 0 20px; }
        .ap-section-header .ap-section-title { margin:0; }
        .ap-create-form {
          display:grid; grid-template-columns:1fr 1fr 1fr 1fr 80px 80px auto;
          gap:14px; align-items:flex-end;
        }
        .ap-pass-group { position:relative; }
        .ap-pass-wrap { position:relative; display:flex; }
        .ap-pass-wrap .ap-input { padding-right:42px; }
        .ap-pass-toggle {
          position:absolute; right:0; top:0; bottom:0; width:40px;
          background:none; border:none; cursor:pointer; font-size:16px;
          display:flex; align-items:center; justify-content:center;
          color:#6b7280;
        }
        .ap-select { cursor:pointer; }
        .ap-label-hint { display:block; font-size:10px; color:#9ca3af; font-weight:400; text-transform:none; letter-spacing:0; margin-top:2px; }
        .ap-create-btn { white-space:nowrap; height:42px; align-self:flex-end; }
        .ap-form-group { display:flex; flex-direction:column; gap:5px; }
        .ap-form-group--sm { }
        .ap-label { font-size:11px; font-weight:600; color:#374151; text-transform:uppercase; letter-spacing:0.8px; }
        .ap-input {
          background:#f8fafc; border:1.5px solid #d1dce8; border-radius:8px;
          color:#1E3A5F; padding:10px 12px; font-size:14px;
          outline:none; font-family:inherit; box-sizing:border-box; width:100%;
          transition:border-color 0.2s;
        }
        .ap-input:focus { border-color:#d4900a; background:#fffbf2; box-shadow:0 0 0 3px rgba(212,144,10,0.1); }
        .ap-btn {
          padding:10px 20px; border-radius:8px; font-weight:700; font-size:14px;
          border:none; cursor:pointer; font-family:inherit; transition:all 0.2s; white-space:nowrap;
        }
        .ap-btn--primary { background:#d4900a; color:#fff; }
        .ap-btn--primary:hover:not(:disabled) { background:#b8790a; transform:translateY(-1px); }
        .ap-btn--ghost { background:transparent; border:1.5px solid #d1dce8; color:#6b7280; }
        .ap-btn--ghost:hover:not(:disabled) { border-color:#d4900a; color:#d4900a; }
        .ap-btn--sm { padding:6px 12px; font-size:12px; }
        .ap-btn--extend  { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
        .ap-btn--convert { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
        .ap-btn--revoke  { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
        .ap-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .ap-table-wrap { overflow-x:auto; }
        .ap-table { width:100%; border-collapse:collapse; font-size:14px; }
        .ap-table th {
          background:#f8fafc; color:#374151; font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.8px;
          padding:12px 16px; text-align:left; border-bottom:2px solid #e8f0f8;
          white-space:nowrap;
        }
        .ap-table td { padding:14px 16px; border-bottom:1px solid #f0f4fa; vertical-align:middle; }
        .ap-table tbody tr:hover { background:#fafbff; }
        .ap-row--inactive { opacity:0.55; }
        .ap-cell-name  { font-weight:600; color:#1E3A5F; }
        .ap-cell-email { font-size:12px; color:#6b7280; margin-top:2px; }
        .ap-cell-muted { color:#9ca3af; font-size:13px; }
        .ap-expired    { color:#b91c1c; font-size:13px; }
        .ap-badge {
          display:inline-block; padding:3px 10px; border-radius:999px;
          font-size:11px; font-weight:700; text-transform:uppercase;
        }
        .ap-badge--demo     { background:rgba(212,144,10,0.1); color:#b45309; border:1px solid rgba(212,144,10,0.3); }
        .ap-badge--full     { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
        .ap-badge--active   { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
        .ap-badge--inactive { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
        .ap-actions { display:flex; gap:6px; flex-wrap:wrap; }
        @media (max-width:900px) {
          .ap { padding:20px; }
          .ap-create-form { grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
