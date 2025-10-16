import React, { useState } from "react";

export function LoginForm({ title, description, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg">
      <div className="flex flex-col p-6">
        <div className="mb-4 text-left">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@nitt.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-white py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
