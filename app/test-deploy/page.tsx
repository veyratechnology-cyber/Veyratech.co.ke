/**
 * Simple test page to verify deployment is working
 * URL: /test-deploy
 */

export default function TestDeployPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#10b981', marginBottom: '20px', fontSize: '32px' }}>
          ✅ Deployment Working!
        </h1>
        
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
          This page confirms your VeyraTech website is successfully deployed.
        </p>

        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h2 style={{ color: '#333', fontSize: '20px', marginBottom: '15px' }}>
            📋 Admin URLs:
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              🔐 <a href="/admin-login" style={{ color: '#FC8436', textDecoration: 'none' }}>
                Login: /admin-login
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              📊 <a href="/admin" style={{ color: '#FC8436', textDecoration: 'none' }}>
                Dashboard: /admin
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              👥 <a href="/admin/leads" style={{ color: '#FC8436', textDecoration: 'none' }}>
                Leads: /admin/leads
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              📅 <a href="/admin/consultations" style={{ color: '#FC8436', textDecoration: 'none' }}>
                Consultations: /admin/consultations
              </a>
            </li>
          </ul>
        </div>

        <div style={{
          background: '#fef3c7',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <strong style={{ color: '#92400e' }}>🔑 Admin Credentials:</strong>
          <p style={{ color: '#78350f', margin: '10px 0 0 0', fontSize: '14px' }}>
            Email: admin@veyratech.co.ke<br />
            Password: Bonaventure123kenya
          </p>
        </div>

        <p style={{ 
          color: '#999', 
          fontSize: '14px', 
          marginTop: '30px',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          Deploy time: {new Date().toISOString()}<br />
          You can delete this test page after confirming deployment.
        </p>
      </div>
    </div>
  );
}
