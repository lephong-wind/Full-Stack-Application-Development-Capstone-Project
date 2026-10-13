import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";
import Header from "../Header/Header";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const register = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/djangoapp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password, firstName, lastName, email }),
      });
      const json = await response.json();
      if (response.ok && json.status === "Registered") {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("firstname");
        sessionStorage.removeItem("lastname");
        navigate("/login", { replace: true, state: { registered: true } });
      } else if (json.error === "Already Registered") {
        setError("That username is already registered.");
      } else {
        setError("Could not create the account. Please check the details and try again.");
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="register_container" style={{width: "50%"}}>
        <div className="header" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <span className="text" style={{flexGrow: "1"}}>SignUp</span>
          <Link to="/" aria-label="Close registration">
            <img style={{width: "1cm"}} src={close_icon} alt="" />
          </Link>
          <hr />
        </div>
        <form onSubmit={register}>
          {error && <p role="alert">{error}</p>}
          <div className="inputs">
            <div className="input">
              <img src={user_icon} className="img_icon" alt="Username" />
              <input type="text" name="username" placeholder="Username" className="input_field" autoComplete="username" required value={userName} onChange={(event) => setUserName(event.target.value)} />
            </div>
            <div className="input">
              <img src={user_icon} className="img_icon" alt="First name" />
              <input type="text" name="first_name" placeholder="First Name" className="input_field" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="input">
              <img src={user_icon} className="img_icon" alt="Last name" />
              <input type="text" name="last_name" placeholder="Last Name" className="input_field" autoComplete="family-name" required value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="input">
              <img src={email_icon} className="img_icon" alt="Email" />
              <input type="email" name="email" placeholder="Email" className="input_field" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="input">
              <img src={password_icon} className="img_icon" alt="Password" />
              <input name="password" type="password" placeholder="Password" className="input_field" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
          <div className="submit_panel">
            <button className="submit" type="submit">Register</button>
          </div>
          <Link to="/login">Already have an account? Login</Link>
        </form>
      </div>
    </>
  );
};

export default Register;