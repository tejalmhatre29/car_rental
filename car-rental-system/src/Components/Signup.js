import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resolveApiPath, parseJsonResponse } from "../api";
import "./Signup.css";

function passwordChecks(pw) {
  return {
    length: pw.length >= 8,
    letter: /[a-zA-Z]/.test(pw),
    number: /\d/.test(pw),
  };
}

function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const checks = useMemo(
    () => passwordChecks(data.password),
    [data.password]
  );
  const passwordStrong = checks.length && checks.letter && checks.number;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = data.name.trim();
    if (name.length < 2) next.name = "Name must be at least 2 characters.";
    const email = data.email.trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!data.password) next.password = "Password is required.";
    else if (data.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    else if (!/[a-zA-Z]/.test(data.password) || !/\d/.test(data.password))
      next.password = "Include at least one letter and one number.";
    if (data.password !== data.confirm)
      next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setLoading(true);
    fetch(resolveApiPath("/signup"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      }),
    })
      .then(async (res) => {
        const payload = await parseJsonResponse(res);
        setLoading(false);
        if (!res.ok) {
          alert(payload.message || "Signup failed");
          return;
        }
        alert(payload.message || "Signup successful");
        if (res.status === 201 || payload.message === "Signup successful") {
          navigate("/");
        }
      })
      .catch(() => {
        setLoading(false);
        alert(
          "Cannot reach the server. Run npm run server in another terminal, or npm run dev for both."
        );
      });
  };

  return (
    <div className="signup-page page-enter">
      <div className="signup-bg-grid" aria-hidden />
      <div className={`signup-card ${shake ? "signup-card--shake" : ""}`}>
        <div className="signup-brand">
          <span className="signup-brand-icon">◆</span>
          <div>
            <h1 className="signup-title">Create account</h1>
            <p className="signup-sub">Join and start renting in minutes</p>
          </div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <label className="signup-field">
            <span>Full name</span>
            <input
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={data.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="signup-field">
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

          <label className="signup-field">
            <span>Password</span>
            <div className="signup-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={data.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
            <ul className="password-rules" aria-live="polite">
              <li className={checks.length ? "ok" : ""}>
                At least 8 characters
              </li>
              <li className={checks.letter ? "ok" : ""}>
                At least one letter (A–Z or a–z)
              </li>
              <li className={checks.number ? "ok" : ""}>
                At least one number (0–9)
              </li>
            </ul>
            {passwordStrong && (
              <span className="password-strong">Password looks strong.</span>
            )}
          </label>

          <label className="signup-field">
            <span>Confirm password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="confirm"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={data.confirm}
              onChange={handleChange}
              className={errors.confirm ? "input-error" : ""}
            />
            {errors.confirm && (
              <span className="field-error">{errors.confirm}</span>
            )}
          </label>

          <label className="signup-field">
            <span>Account type</span>
            <select name="role" value={data.role} onChange={handleChange}>
              <option value="customer">Customer — Rent cars</option>
              <option value="admin">Admin — Manage fleet</option>
            </select>
          </label>

          <button type="submit" className="signup-submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
