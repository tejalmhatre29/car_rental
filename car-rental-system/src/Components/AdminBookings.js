import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./AdminBookings.css";

function AdminBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(resolveApiPath("/admin/bookings"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    fetch(resolveApiPath("/admin/cancelbooking/" + id), { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        load();
      });
  };

  return (
    <div className="ab-page page-enter">
      <div className="ab-bg" aria-hidden />
      <header className="ab-header">
        <Link to="/admin" className="ab-back">
          ← Admin
        </Link>
        <h1>All reservations</h1>
        <p className="ab-lead">
          Cross-check customers, vehicles, and dates. Cancel if plans change.
        </p>
      </header>

      {loading && <p className="ab-muted">Loading…</p>}

      {!loading && rows.length === 0 && (
        <p className="ab-muted">No bookings yet.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="ab-table-wrap">
          <table className="ab-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  className="ab-row"
                >
                  <td>{r.id}</td>
                  <td>
                    <span className="ab-name">{r.user_name}</span>
                    <span className="ab-email">{r.user_email}</span>
                  </td>
                  <td>
                    {r.car_name}
                    <span className="ab-sub">{r.brand}</span>
                  </td>
                  <td>
                    {String(r.start_date).slice(0, 10)} →{" "}
                    {String(r.end_date).slice(0, 10)}
                  </td>
                  <td>
                    <span className={`ab-status ab-status--${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === "Booked" && (
                      <button
                        type="button"
                        className="ab-cancel"
                        onClick={() => cancel(r.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
