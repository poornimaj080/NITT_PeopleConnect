import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function DoubtThread({ doubt, onAnswer, userRole }) {
  const [answer, setAnswer] = React.useState("");

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    onAnswer(doubt.doubt_id, answer);
    setAnswer("");
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          <span className="font-bold text-zinc-300">
            {doubt.studentName || "You"}
          </span>{" "}
          asked:
        </p>
        {doubt.createdAt && (
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(new Date(doubt.createdAt), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>

      <p className="text-white">{doubt.question}</p>

      <div
        className={`mt-3 rounded-md p-3 ${
          doubt.status === "answered" ? "bg-green-900/50" : "bg-yellow-900/50"
        }`}
      >
        <p className="text-sm font-bold text-white">
          Status: <span className="capitalize">{doubt.status}</span>
        </p>
        {doubt.status === "answered" ? (
          <p className="mt-1 text-sm text-green-300">{doubt.answer}</p>
        ) : (
          <p className="mt-1 text-sm text-yellow-300">
            Awaiting faculty response.
          </p>
        )}
      </div>

      {userRole === "faculty" && doubt.status === "open" && (
        <form onSubmit={handleAnswerSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="h-9 flex-grow rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
          <button
            type="submit"
            className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Answer
          </button>
        </form>
      )}
    </div>
  );
}
