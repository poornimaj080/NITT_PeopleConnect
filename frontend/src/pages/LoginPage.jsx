import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const title = userType.charAt(0).toUpperCase() + userType.slice(1);

  const handleLogin = async (credentials) => {
    try {
      setError("");
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">People of NIT Trichy</h1>
        <p className="text-zinc-400">The central hub for our community.</p>
      </div>

      <LoginForm
        title={`${title} Login`}
        description={`Enter your credentials to access the ${userType} dashboard.`}
        onSubmit={handleLogin}
      />

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </main>
  );
}
