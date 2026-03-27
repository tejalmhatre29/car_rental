import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ViewCars.css";

import { resolveApiPath } from "../api";

function ViewCars() {
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  const [cars, setCars] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    car_name: "",
    brand: "",
    price_per_day: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchCars = () => {
    fetch(resolveApiPath("/cars"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const deleteCar = (id) => {
    if (!window.confirm("Delete this car from the fleet?")) return;
    fetch(resolveApiPath("/deletecar/" + id), { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetchCars();
      });
  };

  const openEdit = (car) => {
    setEditing(car);
    setForm({
      car_name: car.car_name,
      brand: car.brand,
      price_per_day: String(car.price_per_day),
    });
  };

  const closeEdit = () => {
    setEditing(null);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editing) return;
    const price = Number(form.price_per_day);
    if (!form.car_name.trim() || !form.brand.trim()) {
      alert("Name and brand are required.");
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      alert("Enter a valid price per day.");
      return;
    }
    setSaving(true);
    fetch(resolveApiPath("/updatecar/" + editing.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        car_name: form.car_name.trim(),
        brand: form.brand.trim(),
        price_per_day: price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaving(false);
        alert(data.message);
        if (data.message === "Car updated") {
          closeEdit();
          fetchCars();
        }
      })
      .catch(() => {
        setSaving(false);
        alert("Cannot reach server.");
      });
  };

  const dashLink = isAdmin ? "/admin" : "/customer";
  const dashLabel = isAdmin ? "← Admin" : "← Dashboard";

  return (
    <div className="cars-page page-enter">
      <div className="cars-bg" aria-hidden />
      <header className="cars-top">
        <Link to={dashLink} className="cars-back">
          {dashLabel}
        </Link>
        <h1 className="cars-title">
          {isAdmin ? "Fleet inventory" : "Fleet catalog"}
        </h1>
        <p className="cars-sub">
          {isAdmin
            ? "Manage vehicles, pricing, and availability."
            : "View pricing — use Browse & filter for search, or book below."}
        </p>
      </header>

      <div className="cars-container">
        <div className="cars-grid">
          {cars.map((car, index) => (
            <div
              className="car-card card-tilt-hover"
              key={car.id}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="car-card-visual" aria-hidden>
                <span className="car-card-icon">🚙</span>
              </div>
              <h3>{car.car_name}</h3>
              <p className="brand">{car.brand}</p>
              <p className="price">
                ₹{Number(car.price_per_day).toLocaleString("en-IN")}
                <span>/day</span>
              </p>
              {isAdmin ? (
                <div className="admin-actions">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => openEdit(car)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteCar(car.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <Link
                  to={`/book?car=${car.id}`}
                  className="cars-book-cta"
                >
                  Book this car
                </Link>
              )}
            </div>
          ))}
        </div>
        {cars.length === 0 && (
          <p className="cars-empty">
            No cars in the database yet. Add one from the admin panel.
          </p>
        )}
      </div>

      {isAdmin && editing && (
        <div className="modal-overlay" role="presentation" onClick={closeEdit}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-car-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-car-title">Edit car</h2>
            <form onSubmit={saveEdit}>
              <label className="modal-field">
                <span>Name</span>
                <input
                  value={form.car_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, car_name: e.target.value }))
                  }
                />
              </label>
              <label className="modal-field">
                <span>Brand</span>
                <input
                  value={form.brand}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brand: e.target.value }))
                  }
                />
              </label>
              <label className="modal-field">
                <span>Price per day (₹)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.price_per_day}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price_per_day: e.target.value }))
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeEdit}>
                  Cancel
                </button>
                <button type="submit" className="modal-save" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCars;
