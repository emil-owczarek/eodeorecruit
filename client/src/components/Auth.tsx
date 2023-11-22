import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";

function Auth() {
  const [, setCookie] = useCookies();
  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const viewLogin = (status: boolean) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e: React.FormEvent, endpoint: string) => {
    e.preventDefault();
    if (!isLogIn && password !== confirmPassword) {
      setError("Make sure passwords match");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("email", data.email);
      setCookie("AuthToken", data.token);

      window.location.reload();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container__box">
        <form className="auth__form" onSubmit={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}>
          <h2 className="auth__title">{isLogIn ? "Sign In!" : "Sign Up!"}</h2>
          <input
            className="auth__email-input"
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth__password-input auth__password-input--1"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {!isLogIn && (
            <input
              className="auth__password-input auth__password-input--2"
              type="password"
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          )}
          {error && <p>{error}</p>}
          <input type="submit" className="auth__submit-button" />
        </form>
        <div className="auth__options">
          <button
          className="auth__options-button"
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogIn
                ? "rgb(188, 188, 188)"
                : "rgb(255,255,255)",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
          <button
                    className="auth__options-button"
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogIn
                ? "rgb(188, 188, 188)"
                : "rgb(255,255,255)",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
