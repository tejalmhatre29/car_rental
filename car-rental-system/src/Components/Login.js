import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { resolveApiPath, parseJsonResponse } from "../api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formShake, setFormShake] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReduced ? 0 : 3000;
    const t = setTimeout(() => setShowForm(true), delay);
    return () => clearTimeout(t);
  }, []);

  const validate = useCallback(() => {
    const next = {};
    const email = data.email.trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!data.password) next.password = "Password is required.";
    else if (data.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setFormShake(true);
      setTimeout(() => setFormShake(false), 450);
      return;
    }
    setLoading(true);
    fetch(resolveApiPath("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email.trim(),
        password: data.password,
      }),
    })
      .then(async (res) => {
        const payload = await parseJsonResponse(res);
        setLoading(false);
        if (
          res.ok &&
          payload.message === "Login successful" &&
          payload.role
        ) {
          localStorage.setItem("userId", String(payload.userId ?? ""));
          localStorage.setItem("userRole", payload.role);
          if (payload.role === "admin") navigate("/admin");
          else if (payload.role === "customer") navigate("/customer");
        } else {
          alert(payload.message || "Login failed.");
        }
      })
      .catch(() => {
        setLoading(false);
        alert(
          "Cannot reach the server. Open a terminal in the project folder and run: npm run server (or npm run dev for frontend + backend together)."
        );
      });
  };

  const page = (
    <div className="login-page page-enter">
      <div className="login-bg-grid" aria-hidden />
      <div className="login-aurora" aria-hidden />
      <div className="login-hero-3d" aria-hidden="true">
        <div className="login-scene-3d">
          <div className="login-scene-perspective">
            <div className="login-road-3d">
              <div className="login-road-edge login-road-edge--left" />
              <div className="login-road-edge login-road-edge--right" />
              <div className="login-road-lanes" />
              <div className="login-road-shine" />
            </div>
            <div className="login-car-track-3d">
              <div className="login-car-3d">
                <div className="login-car-shadow" />
                <svg
                  viewBox="0 0 200 72"
                  className="login-car-svg-3d"
                  role="img"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="loginCarPaint"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="40%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="loginCarGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0.15)" />
                    </linearGradient>
                    <linearGradient id="loginCarHeadlight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef9c3" />
                      <stop offset="100%" stopColor="rgba(254,249,195,0)" />
                    </linearGradient>
                    <filter id="loginCarGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.2" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <ellipse cx="100" cy="64" rx="78" ry="5" fill="rgba(0,0,0,0.45)" />
                  <path
                    d="M12 46 L28 32 L52 26 L100 26 L148 26 L172 32 L188 46 L188 52 L12 52 Z"
                    fill="url(#loginCarPaint)"
                    stroke="#0e7490"
                    strokeWidth="1.2"
                    filter="url(#loginCarGlow)"
                  />
                  <path
                    d="M52 28 L100 26 L148 28 L140 22 L100 18 L60 22 Z"
                    fill="url(#loginCarGlass)"
                    opacity="0.9"
                  />
                  <path
                    d="M18 44 L28 36 L44 34 L56 34 L56 44 Z"
                    fill="rgba(15,23,42,0.35)"
                  />
                  <path
                    d="M144 44 L144 34 L172 34 L182 44 Z"
                    fill="rgba(15,23,42,0.35)"
                  />
                  <path
                    d="M188 40 L210 38 L210 48 L188 48 Z"
                    fill="url(#loginCarHeadlight)"
                    opacity="0.85"
                  />
                  <rect x="14" y="38" width="8" height="4" rx="1" fill="#fef08a" />
                  <rect x="178" y="38" width="8" height="4" rx="1" fill="#fef08a" />
                  <rect x="88" y="48" width="24" height="3" rx="1" fill="#0f172a" opacity="0.5" />
                  <g className="login-wheel login-wheel--front">
                    <circle cx="44" cy="52" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="44" cy="52" r="4" fill="#64748b" />
                  </g>
                  <g className="login-wheel login-wheel--rear">
                    <circle cx="156" cy="52" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="156" cy="52" r="4" fill="#64748b" />
                  </g>
                </svg>
                <div className="login-headlight-beam" />
              </div>
            </div>
          </div>
        </div>
        <p className="login-hero-tagline">Premium rentals · Real-time fleet</p>
      </div>

      <div
        className={`login-shell ${showForm ? "login-shell--visible" : ""}`}
      >
        <div className={`login-card ${formShake ? "login-card--shake" : ""}`}>
          <div className="login-brand">
            <span className="login-brand-icon">◆</span>
            <div>
              <h1 className="login-title">Welcome back</h1>
              <p className="login-sub">Sign in to your car rental account</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="At least 8 characters"
                  value={data.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
              <span className="field-hint">
                Use 8+ characters. For stronger security, mix letters and numbers.
              </span>
            </label>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <span className="login-spinner-wrap">
                  <span className="login-spinner" /> Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="login-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );

  const host =
    typeof document !== "undefined"
      ? document.getElementById("login-outside-root")
      : null;
  return host ? createPortal(page, host) : page;
}

export default Login;
