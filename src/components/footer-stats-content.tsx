"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";

export function FooterStatsContent() {
  const { data } = useQuery(trpc.stats.queryOptions());
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFlow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="flex justify-center gap-6 font-mono text-sm text-text-tertiary">
      <span>
        {showFlow ? (
          <NumberFlow value={data.totalCodes} />
        ) : (
          data.totalCodes.toLocaleString()
        )}
        {" codes roasted"}
      </span>
      <span>·</span>
      <span>
        avg score:{" "}
        {showFlow ? (
          <NumberFlow value={data.avgScore} />
        ) : (
          data.avgScore.toLocaleString()
        )}
        /10
      </span>
    </div>
  );
}
