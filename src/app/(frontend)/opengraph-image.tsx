import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'H2V Araucanía — Hidrógeno Verde en La Araucanía';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1B3A5C 0%, #0D7377 60%, #4ECDC4 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* H2V molecule icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            marginBottom: 24,
            fontSize: 40,
          }}
        >
          H₂
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          H2V Araucanía
        </div>

        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 16,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Programa Estratégico Regional de Hidrógeno Verde
        </div>

        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          La Araucanía, Chile
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#F59E0B',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
