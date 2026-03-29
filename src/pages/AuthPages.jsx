import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { Bunny } from '../components/UI';

// ── Password strength ─────────────────────────────────────────────────────────
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH_COLORS = ['#ff4444', '#ff8800', '#ffdd00', '#00ff88'];
const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

// ── Shared field styles — fixes input overflow ────────────────────────────────
const fieldWrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  // Prevent the input from punching out of the card
  minWidth: 0,
  width: '100%',
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text2)',
  letterSpacing: 1,
  flexShrink: 0,
};

// input gets width:100% + box-sizing:border-box via globals.css .input,
// but we also clamp it here so it never escapes its parent.
const inputOverride = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
};

// ── Password input ────────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <input
        className="input"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...inputOverride, paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text2)', fontSize: 16,
          padding: 0, lineHeight: 1,
        }}
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

// ── Google button ─────────────────────────────────────────────────────────────
// This renders the UI shell. Wire it up to your OAuth provider — see README
// section "Google Login" for the full integration guide.
function GoogleButton({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '11px 16px',
        background: 'var(--bg3)',
        border: '1.5px solid var(--border)',
        borderRadius: 10,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--text)',
        transition: 'all 0.2s',
        opacity: loading ? 0.6 : 1,
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = '#4285F4'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Google "G" SVG — no external dependency */}
      <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.16C6.51 42.62 14.62 48 24 48z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.16C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.75l7.97-6.16z"/>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.16C12.43 13.72 17.74 9.5 24 9.5z"/>
      </svg>
      {loading ? 'Connecting…' : 'Continue with Google'}
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
export function LoginPage({ onBack, onSignup }) {
  const [identifier,   setIdentifier]  = useState('');
  const [password,     setPassword]    = useState('');
  const [loading,      setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const login    = useAppStore((s) => s.login);
  const addToast = useAppStore((s) => s.addToast);

  const handleLogin = () => {
    if (!identifier.trim() || !password) { addToast('Fill all fields', 'error'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(identifier, password);
      if (!ok) setLoading(false);
    }, 700);
  };

  // ── Google OAuth handler ────────────────────────────────────────────────────
  // Replace the body of this function with your chosen provider.
  // See the cloud guide below for Firebase / Supabase examples.
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // ── Firebase example (uncomment after setup) ──────────────────────────
      // import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
      // const auth     = getAuth();
      // const provider = new GoogleAuthProvider();
      // const result   = await signInWithPopup(auth, provider);
      // const fbUser   = result.user;
      // login(fbUser.email, '__google__');   // store stores google users separately
      // ─────────────────────────────────────────────────────────────────────

      // ── Supabase example (uncomment after setup) ──────────────────────────
      // import { supabase } from '../lib/supabase';
      // const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      // if (error) throw error;
      // ─────────────────────────────────────────────────────────────────────

      // Placeholder until wired up:
      addToast('⚙️ Wire up Google OAuth — see README', 'info');
    } catch (err) {
      addToast('Google login failed: ' + err.message, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Constrained inner wrapper — this is what prevents overflow */}
      <div style={{ width: '100%', maxWidth: 380, boxSizing: 'border-box' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Bunny size={68} mood="happy" animate={false} />
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>Welcome Back!</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: 13 }}>
            Continue your coding journey 🐰
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',   // ← clips any child that tries to escape
          }}
        >
          {/* Google */}
          <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />

          <Divider />

          {/* Identifier */}
          <div style={fieldWrap}>
            <label style={labelStyle}>EMAIL, PHONE OR USERNAME</label>
            <input
              className="input"
              placeholder="you@example.com or +91…"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={inputOverride}
            />
          </div>

          {/* Password */}
          <div style={fieldWrap}>
            <label style={labelStyle}>PASSWORD</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            className="btn btn-primary btn-full"
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: 2 }}
          >
            {loading ? '🔄 Logging in…' : '🔐 Login'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--text2)', fontSize: 13 }}>
          No account?{' '}
          <button
            onClick={onSignup}
            style={{
              background: 'none', border: 'none',
              color: 'var(--accent)', cursor: 'pointer',
              fontFamily: 'var(--font)', fontWeight: 700,
            }}
          >
            Sign up →
          </button>
        </p>
      </div>
    </div>
  );
}

// ── Signup Page ───────────────────────────────────────────────────────────────
export function SignupPage({ onBack, onLogin }) {
  const [form,          setForm]          = useState({ username: '', email: '', phone: '', password: '' });
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const register = useAppStore((s) => s.register);
  const addToast = useAppStore((s) => s.addToast);

  const set      = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const strength = pwStrength(form.password);

  const handleSignup = () => {
    if (strength < 2) {
      addToast('Password too weak — add uppercase, numbers & symbols', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = register(form);
      if (!ok) setLoading(false);
    }, 700);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      // Same as LoginPage — swap in Firebase / Supabase call here.
      addToast('⚙️ Wire up Google OAuth — see README', 'info');
    } catch (err) {
      addToast('Google signup failed: ' + err.message, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const checks = [
    ['8+ characters',   form.password.length >= 8],
    ['Uppercase (A-Z)', /[A-Z]/.test(form.password)],
    ['Number (0-9)',    /[0-9]/.test(form.password)],
    ['Symbol (!@#…)',   /[^A-Za-z0-9]/.test(form.password)],
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px 40px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380, boxSizing: 'border-box' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Bunny size={68} mood="excited" animate={false} />
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>Join ByteBunny!</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: 13 }}>
            Start your coding adventure 🚀
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Google */}
          <GoogleButton onClick={handleGoogleSignup} loading={googleLoading} />

          <Divider />

          {/* Username */}
          <div style={fieldWrap}>
            <label style={labelStyle}>USERNAME *</label>
            <input
              className="input"
              placeholder="cool_coder_42"
              value={form.username}
              onChange={set('username')}
              style={inputOverride}
            />
          </div>

          {/* Email */}
          <div style={fieldWrap}>
            <label style={labelStyle}>EMAIL</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              style={inputOverride}
            />
          </div>

          {/* Phone */}
          <div style={fieldWrap}>
            <label style={labelStyle}>PHONE NUMBER</label>
            <input
              className="input"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={set('phone')}
              style={inputOverride}
            />
          </div>

          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: -6 }}>
            * Email or phone required
          </p>

          {/* Password */}
          <div style={fieldWrap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>PASSWORD *</label>
              {form.password && (
                <span style={{ fontSize: 11, fontWeight: 700, color: STRENGTH_COLORS[strength - 1] || '#ff4444' }}>
                  {STRENGTH_LABELS[strength]}
                </span>
              )}
            </div>

            <PasswordInput
              value={form.password}
              onChange={set('password')}
              placeholder="Min 8 chars, A-Z, 0-9, symbol"
            />

            {/* Strength bars */}
            {form.password && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="pw-bar"
                    style={{ background: i < strength ? STRENGTH_COLORS[strength - 1] : 'var(--border)' }}
                  />
                ))}
              </div>
            )}

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8, fontSize: 11 }}>
              {checks.map(([label, met]) => (
                <span key={label} style={{ color: met ? 'var(--green)' : 'var(--text3)' }}>
                  {met ? '✅' : '⬜'} {label}
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            className="btn btn-primary btn-full"
            onClick={handleSignup}
            disabled={loading}
            style={{ marginTop: 2 }}
          >
            {loading ? '🔄 Creating account…' : '🚀 Create Account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--text2)', fontSize: 13 }}>
          Have an account?{' '}
          <button
            onClick={onLogin}
            style={{
              background: 'none', border: 'none',
              color: 'var(--accent)', cursor: 'pointer',
              fontFamily: 'var(--font)', fontWeight: 700,
            }}
          >
            Login →
          </button>
        </p>
      </div>
    </div>
  );
}
