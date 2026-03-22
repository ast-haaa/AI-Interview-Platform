import React, { useEffect, useMemo, useState } from "react";
import { computeATSScore } from "../utils/atsScore";

function Bar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-700 dark:text-gray-200">{label}</span>
        <span className="font-semibold text-emerald-600">{value}%</span>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 h-2 sm:h-3 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ATSScoreCard({ answers }) {
  const result = useMemo(() => computeATSScore(answers), [answers]);
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(result.overall), 80);
    return () => window.clearTimeout(t);
  }, [result.overall]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-transparent dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            ATS Resume Compatibility Score
          </h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            {result.label}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">
            {result.overall}%
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="bg-gray-200 dark:bg-gray-700 h-3 sm:h-4 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${animated}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Bar label="Keyword Match Score" value={result.breakdown.keywordMatchScore} />
        <Bar label="Clarity Score" value={result.breakdown.clarityScore} />
        <Bar label="Structure Score" value={result.breakdown.structureScore} />
      </div>

      <div className="mt-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-2">
          Improvement Suggestions
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {result.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

