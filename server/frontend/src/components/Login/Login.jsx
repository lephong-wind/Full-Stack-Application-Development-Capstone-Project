import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./Login.css";
import Header from '../Header/Header';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/djangoapp/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      const json = await response.json();
      if (response.ok && json.status === "Authenticated") {
        sessionStorage.setItem("username", json.userName);
        sessionStorage.setItem("firstname", json.firstName || "");
        sessionStorage.setItem("lastname", json.lastName || "");
        navigate("/", { replace: true });
      } else {
        setError("Username or password is incorrect.");
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <main className="modalContainer">
        <form className="login_panel" onSubmit={login}>
          {location.state?.registered && <p role="status">Account created. Please sign in.</p>}
          {location.state?.loggedOut && <p role="status">You have been logged out.</p>}
          {error && <p role="alert">{error}</p>}
          <div>
            <label className="input_field" htmlFor="username">Username</label>
            <input id="username" type="text" name="username" placeholder="Username" className="input_field" autoComplete="username" required value={userName} onChange={(event) => setUserName(event.target.value)} />
          </div>
          <div>
            <label className="input_field" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" className="input_field" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div>
            <button className="action_button" type="submit">Login</button>
            <Link className="action_button" to="/">Cancel</Link>
          </div>
          <Link className="loginlink" to="/register">Create an account</Link>
        </form>
      </main>
    </div>
  );
};

export default Login;