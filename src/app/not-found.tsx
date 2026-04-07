import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#ffffff',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <p style={{ fontSize: '3.75rem', fontWeight: 700, color: '#0D7377', marginBottom: '1rem' }}>
              404
            </p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1B3A5C', marginBottom: '0.75rem' }}>
              Página no encontrada
            </h1>
            <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.6 }}>
              La página que buscas no existe o fue movida. Puedes volver al inicio o explorar las secciones del programa.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0D7377',
                  color: '#ffffff',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Volver al inicio
              </Link>
              <Link
                href="/proyectos"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #1B3A5C',
                  color: '#1B3A5C',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Ver proyectos
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
