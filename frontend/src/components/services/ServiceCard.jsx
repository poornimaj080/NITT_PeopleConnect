import React from "react";

export default function ServiceCard({ service, onAction, actionLabel }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-md transition-transform hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-semibold text-white">{service.title}</h3>

        <p className="mt-1 text-sm text-zinc-400">{service.description}</p>
        <p className="mt-2 text-xs text-zinc-500">
          Provided by:{" "}
          <span className="font-medium text-zinc-400">
            {service.providedBy}
          </span>
        </p>
      </div>
      {onAction && (
        <button
          onClick={() => onAction(service.service_id)}
          className="mt-4 w-full rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
