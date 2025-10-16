import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import { useAuth } from "./context/AuthContext";

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-black text-white">
      <h1 className="text-5xl font-bold">Welcome to People of NIT Trichy</h1>
      <p className="text-zinc-400">Please select your login portal.</p>
      <div className="flex space-x-4">
        <Link
          to="/login/student"
          className="rounded-md bg-white px-4 py-2 text-black transition hover:bg-zinc-200"
        >
          Student Login
        </Link>
        <Link
          to="/login/faculty"
          className="rounded-md bg-white px-4 py-2 text-black transition hover:bg-zinc-200"
        >
          Faculty Login
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <p className="text-sm font-medium text-white">
          Logged in as {user.email}
        </p>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </nav>
      {user.role === "student" && <StudentDashboard />}
      {user.role === "faculty" && <FacultyDashboard />}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login/:userType" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
