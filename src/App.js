// react and useState hook import for state handling
import React, { useState } from "react";
// css import for styling the app
import "./App.css"; // Make sure styles are applied

function App() {
  // state variables: lat, lng, result, error
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // form submit handler, fetch uv data from backend api
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      // fetch call to /api/weather with lat and lng
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Error fetching data");
      }
    } catch {
      setError("Network error");
    }
  };

  // app UI layout: title, input form, error, result display
  return (
    <div className="App">
      <h1>🌞 UV Weather Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
        />
        <button type="submit">Check UV</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p><strong>📍 Location:</strong> {result.lat}, {result.lng}</p>
          <p><strong>🔆 Max UV Index Today:</strong> {result.uv}</p>
          <p><strong>⏱️ Current Time:</strong> {result.currentLocalTime}</p>
          <p><strong>🧴 Message:</strong> {result.message}</p>
          <p className="note">Note: UV index shown is the <em>maximum expected</em> for the day.</p>
        </div>
      )}
    </div>
  );
}

export default App;
