import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MonacoEditor from "@monaco-editor/react";
import useExplanationStore from "../stores/explanationStore";
import { formatExplanation, removeBackticks } from "../utils/formatters";

const AlgorithmDetails = () => {
  const [showCode, setShowCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { explanation } = useExplanationStore();

  const handleCopy = async () => {
    const codeToCopy = showCode
      ? removeBackticks(explanation.solution.code)
      : explanation.solution.pseudo_code;

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  if (!explanation) return null;

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-[hsl(20,30%,90%)]">
      <section>
        <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          권장되는 알고리즘
        </h2>
        <div className="prose max-w-none text-[hsl(20,20%,30%)]">
          <ReactMarkdown>{explanation.required_algorithm}</ReactMarkdown>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          주요 개념
        </h2>
        <div className="prose max-w-none text-[hsl(20,20%,30%)] [&>p]:leading-loose [&>p]:mb-1">
          <ReactMarkdown>{explanation.algorithm_concept}</ReactMarkdown>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          풀이 접근 방법
        </h2>
        <div className="prose max-w-none text-[hsl(20,20%,30%)] [&>p]:leading-loose [&>p]:mb-1">
          <ReactMarkdown>
            {formatExplanation(explanation.solution_approach)}
          </ReactMarkdown>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)]">
            {showCode ? "Code(Python)" : "Pseudo Code"}
          </h2>
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-1 text-sm bg-[hsl(20,40%,50%)] text-white rounded-lg hover:bg-[hsl(20,40%,45%)] focus:outline-none focus:ring-2 focus:ring-[hsl(20,40%,60%)] focus:ring-offset-2 transition-colors duration-200"
          >
            {showCode ? "수도 코드 보기" : "코드 보기(Python)"}
          </button>
        </div>

        <div className="relative rounded-lg overflow-hidden border border-[hsl(20,30%,90%)]">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#cccccc] rounded-md text-sm flex items-center gap-2 transition-colors duration-200 z-10 border border-[#404040]"
          >
            {copySuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
          <MonacoEditor
            height="300px"
            defaultLanguage="python"
            value={
              showCode
                ? removeBackticks(explanation.solution.code)
                : explanation.solution.pseudo_code
            }
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          코드 설명
        </h2>
        <div className="prose max-w-none text-[hsl(20,20%,30%)]">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  {...props}
                  className="text-2xl font-bold text-[hsl(20,25%,20%)] mt-6 mb-6"
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  {...props}
                  className="text-xl font-semibold text-[hsl(20,30%,25%)] mt-6 mb-6"
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  {...props}
                  className="text-lg font-medium text-[hsl(20,35%,30%)] mt-6 mb-6"
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  {...props}
                  className="text-base text-[hsl(20,20%,40%)] leading-loose space-y-6"
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className="list-disc ml-6 text-[hsl(20,20%,40%)] space-y-6"
                />
              ),
              li: ({ node, ...props }) => (
                <li
                  {...props}
                  className="text-base text-[hsl(20,20%,40%)] leading-loose space-y-2"
                />
              ),
              code: ({ node, inline, ...props }) => (
                <code
                  {...props}
                  className={`${
                    inline
                      ? "bg-[hsl(20,30%,95%)] text-[hsl(20,40%,30%)] px-1 rounded"
                      : "bg-[hsl(20,30%,95%)] text-[hsl(20,40%,30%)] mx-1 px-2 py-2 rounded"
                  } font-mono text-sm`}
                />
              ),
            }}
          >
            {explanation.explain}
          </ReactMarkdown>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          시간복잡도
        </h2>
        <div className="prose max-w-none text-[hsl(20,20%,30%)]">
          <ReactMarkdown>{explanation.time_complexity}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
};

export default AlgorithmDetails;
