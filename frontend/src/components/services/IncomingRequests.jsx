import React from "react";

export default function IncomingRequests({ requests }) {
  return (
    <div className="space-y-3">
      {requests.length > 0 ? (
        requests.map((req, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
          >
            <p className="text-sm text-white">
              <span className="font-bold">{req.requesterName}</span> requested
              your service:
            </p>
            <p className="font-semibold text-zinc-300">{req.serviceTitle}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Contact: {req.requesterEmail}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-zinc-400">
          You have no incoming service requests.
        </p>
      )}
    </div>
  );
}
