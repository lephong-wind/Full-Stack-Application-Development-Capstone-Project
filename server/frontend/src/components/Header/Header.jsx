import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => sessionStorage.getItem("username"));
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const djangoOrigin = window.location.port === "3000"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "";

  const logout = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/djangoapp/logout", { method: "GET" });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("firstname");
      sessionStorage.removeItem("lastname");
      setUsername(null);
      navigate("/login", { replace: true, state: { loggedOut: true } });
    } catch {
      setError("Could not log out. Please try again.");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:"darkturquoise",height:"1in"}}>
        <div className="container-fluid">
          <h2 style={{paddingRight: "5%"}}>Dealerships</h2>
          <button className="navbar-toggler" type="button" aria-controls="navbarText" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`} id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dealers">Dealerships</Link></li>
              <li className="nav-item"><a className="nav-link" href={`${djangoOrigin}/about/`}>About Us</a></li>
              <li className="nav-item"><a className="nav-link" href={`${djangoOrigin}/contact/`}>Contact Us</a></li>
            </ul>
            <span className="navbar-text">
              {username ? (
                <div className="input_panel">
                  <span className="username">{username}</span>
                  <a className="nav_item" href="/login" onClick={logout}>Logout</a>
                </div>
              ) : (
                <div className="input_panel">
                  <Link className="nav_item" to="/login">Login</Link>
                  <Link className="nav_item" to="/register">Register</Link>
                </div>
              )}
            </span>
          </div>
        </div>
      </nav>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};

export default Header;