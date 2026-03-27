import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./Profile.css";

function Profile() {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(resolveApiPath("/user/" + userId))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.email) {
          setName(data.name || "");
          setEmail(data.email);
          setRole(data.role || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const save = (e) => {
    e.preventDefault();
    if (!userId) return;
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    fetch(resolveApiPath("/user/" + userId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    })
      .then(async (res) => {
        const data = await res.json();
        setSaving(false);
        alert(data.message || "Updated");
      })
      .catch(() => {
        setSaving(false);
        alert("Cannot reach server.");
      });
  };

  return (
    <div className="profile-page page-enter">
      <div className="profile-bg" aria-hidden />
      <header className="profile-header">
        <Link to="/customer" className="profile-back">
          ← Dashboard
        </Link>
        <h1>Your profile</h1>
        <p className="profile-lead">
          Update how we greet you. Email is read-only for this demo.
        </p>
      </header>

      <div className="profile-card">
        {!userId && (
          <p className="profile-warning">
            <Link to="/">Sign in</Link> to view your profile.
          </p>
        )}
        {loading && userId && <p className="profile-muted">Loading…</p>}
        {!loading && userId && (
          <form className="profile-form" onSubmit={save}>
            <label className="profile-field">
              <span>Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="profile-field profile-field--readonly">
              <span>Email</span>
              <input value={email} readOnly />
            </label>
            <div className="profile-field profile-field--readonly">
              <span>Role</span>
              <input value={role} readOnly />
            </div>
            <button type="submit" className="profile-save" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
