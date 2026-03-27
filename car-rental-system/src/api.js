/**
 * API base URL for resolveApiPath().
 * - REACT_APP_API_URL in .env overrides everything (include full origin, no trailing slash).
 * - In development, defaults to http://localhost:5000 so the browser talks to Express
 *   directly (CORS is enabled on the server). The CRA "proxy" is not required.
 * - In production builds, defaults to "" for same-origin relative URLs; set REACT_APP_API_URL
 *   if the API is on another host.
 */
function getOriginBase() {
  const explicit = process.env.REACT_APP_API_URL;
  if (explicit != null && String(explicit).trim() !== "") {
    return String(explicit).replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  return "";
}

const originBase = getOriginBase();

/** Path starting with "/", e.g. resolveApiPath("/login") */
export function resolveApiPath(path) {
  const p = path.startsWith("/") ? path : "/" + path;
  return originBase + p;
}

/** Read JSON from fetch Response; never throws (handles HTML error pages from dev server). */
export async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      message:
        "Unexpected response from server. Start the backend in a terminal: npm run server",
    };
  }
}
