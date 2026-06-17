export default function Custom404() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '96px', fontWeight: 800, color: '#172e52', margin: 0, lineHeight: 1 }}>404</h1>
      <p style={{ fontSize: '20px', color: '#4b5563', margin: '16px 0 32px' }}>Page not found.</p>
      <a href="/" style={{ background: '#172e52', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
        Go to Homepage
      </a>
    </div>
  );
}
