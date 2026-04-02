import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('allows requests under the limit', () => {
    const check = rateLimit('test-under', 60_000, 5);

    const r1 = check('192.168.1.1');
    const r2 = check('192.168.1.1');
    const r3 = check('192.168.1.1');

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r1.retryAfterMs).toBe(0);
  });

  it('blocks requests over the limit', () => {
    const check = rateLimit('test-over', 60_000, 3);

    check('10.0.0.1'); // 1
    check('10.0.0.1'); // 2
    check('10.0.0.1'); // 3 — hits the limit

    const blocked = check('10.0.0.1'); // 4 — should be blocked
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('resets after the window expires', () => {
    vi.useFakeTimers();

    const windowMs = 1_000;
    const check = rateLimit('test-reset', windowMs, 2);

    check('172.16.0.1'); // 1
    check('172.16.0.1'); // 2 — hits the limit

    const blocked = check('172.16.0.1');
    expect(blocked.allowed).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(windowMs + 1);

    const afterReset = check('172.16.0.1');
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.retryAfterMs).toBe(0);

    vi.useRealTimers();
  });
});

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
    expect(getClientIp(headers)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '9.8.7.6' });
    expect(getClientIp(headers)).toBe('9.8.7.6');
  });

  it('returns "unknown" when no IP headers are present', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('unknown');
  });
});
