import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { resolveApiPath } from "../api";
import "./BrowseCars.css";

function BrowseCars() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch(resolveApiPath("/cars"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = cars.filter((c) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        String(c.car_name).toLowerCase().includes(q) ||
        String(c.brand).toLowerCase().includes(q)
      );
    });
    const max = maxPrice === "" ? null : Number(maxPrice);
    if (max !== null && !Number.isNaN(max) && max > 0) {
      list = list.filter((c) => Number(c.price_per_day) <= max);
    }
    const copy = [...list];
    if (sort === "price-asc") {
      copy.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
    } else if (sort === "price-desc") {
      copy.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
    } else if (sort === "name") {
      copy.sort((a, b) => String(a.car_name).localeCompare(String(b.car_name)));
    }
    return copy;
  }, [cars, query, sort, maxPrice]);

  return (
    <div className="browse-page page-enter">
      <div className="browse-bg" aria-hidden />
      <header className="browse-header">
        <Link to="/customer" className="browse-back">
          ← Dashboard
        </Link>
        <h1>Browse fleet</h1>
        <p className="browse-lead">
          Search by name or brand, filter by budget, then book in one tap.
        </p>
      </header>

      <div className="browse-toolbar">
        <div className="browse-search-wrap">
          <span className="browse-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            className="browse-search"
            placeholder="Search cars or brands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search cars"
          />
        </div>
        <div className="browse-filters">
          <label className="browse-filter">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="price-asc">Price · Low to high</option>
              <option value="price-desc">Price · High to low</option>
              <option value="name">Name · A–Z</option>
            </select>
          </label>
          <label className="browse-filter">
            <span>Max ₹ / day</span>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="browse-grid">
        {filtered.map((car, i) => (
          <article
            key={car.id}
            className="browse-card card-tilt-hover"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="browse-card-visual">
              <div className="browse-card-3d">
                <span className="browse-car-glyph" aria-hidden>
                  🚗
                </span>
              </div>
              <span className="browse-card-badge">{car.brand}</span>
            </div>
            <h2>{car.car_name}</h2>
            <p className="browse-card-price">
              ₹{Number(car.price_per_day).toLocaleString("en-IN")}
              <span>/day</span>
            </p>
            <Link
              to={`/book?car=${car.id}`}
              className="browse-card-cta"
            >
              Book this car
            </Link>
          </article>
        ))}
      </div>

      {cars.length === 0 && (
        <p className="browse-empty">No vehicles in the fleet yet.</p>
      )}
      {cars.length > 0 && filtered.length === 0 && (
        <p className="browse-empty">No matches — try another search or budget.</p>
      )}
    </div>
  );
}

export default BrowseCars;
