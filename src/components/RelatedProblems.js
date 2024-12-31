import React from "react";

const RelatedProblems = ({ tagName, relatedProblems }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-[hsl(20,30%,90%)] w-full">
    <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
      {tagName} - 관련 문제
    </h2>
    <ul className="space-y-2">
      {relatedProblems.map((problem, index) => (
        <li key={index}>
          <a
            target="_blank"
            href={`https://www.acmicpc.net/problem/${problem}`}
            className="text-[hsl(20,40%,50%)] hover:text-[hsl(20,40%,40%)] hover:underline"
          >
            {problem}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default RelatedProblems;
