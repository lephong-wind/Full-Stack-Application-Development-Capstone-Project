import React, { useEffect, useState } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dealerUrl = "/djangoapp/get_dealers";

  const loadDealers = async (state = "All") => {
    setLoading(true);
    setError("");
    try {
      const url = state === "All"
        ? dealerUrl
        : `${dealerUrl}/${encodeURIComponent(state)}`;
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.dealers)) {
        throw new Error("Invalid dealership response");
      }
      setDealersList(result.dealers);
      if (state === "All") {
        setStates([...new Set(result.dealers.map((dealer) => dealer.state))]);
      }
    } catch {
      setDealersList([]);
      setError("Dealership data is unavailable. Start MongoDB and the Node API, then try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealers();
  }, []);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));
  const columnCount = isLoggedIn ? 7 : 6;

  return (
    <div>
      <Header />
      <main>
        {error && <p role="alert">{error}</p>}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>
                <select name="state" id="state" value={selectedState} onChange={(event) => {
                  setSelectedState(event.target.value);
                  loadDealers(event.target.value);
                }}>
                  <option value="" disabled>State</option>
                  <option value="All">All States</option>
                  {states.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </th>
              {isLoggedIn && <th>Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={columnCount}>Loading dealerships...</td></tr>}
            {!loading && error && <tr><td colSpan={columnCount}>No dealership results.</td></tr>}
            {!loading && !error && dealersList.length === 0 && <tr><td colSpan={columnCount}>No dealerships found.</td></tr>}
            {!loading && !error && dealersList.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td><a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn && (
                  <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Dealers;