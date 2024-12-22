import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import MonacoEditor from "@monaco-editor/react";
import { Helmet } from "react-helmet";

const App = () => {
  const [url, setUrl] = useState("https://www.acmicpc.net/problem/2056");
  const [tagName, setTagName] = useState("");
  const [related_problems, setRelatedProblems] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [showCode, setShowCode] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = showCode
        ? removeBackticks(explanation.solution.code)
        : explanation.solution.pseudo_code;

      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);

      // 3초 후 복사 성공 메시지 제거
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error("복사 실패:", err);
      setError("코드 복사에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExplanation("");
    setRelatedProblems([]);
    setTagName("");
    setShowCode(false);

    if (!url) {
      setError("URL을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/crawl",
        { url },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setTagName(response.data.tag_name);
      setRelatedProblems(response.data.related_problem);
      setExplanation(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeBackticks = (input) => {
    const code = input.replace(/```python\n?/, "").replace(/```$/, "");
    return code.replace(/`+/g, "").trim();
  };

  const formatExplanation = (text) => {
    try {
      // 1. text가 undefined나 null인 경우
      if (text === undefined) {
        throw new Error("텍스트가 undefined입니다");
      }
      if (text === null) {
        throw new Error("텍스트가 null입니다");
      }

      // 2. text가 문자열이 아닌 경우
      if (typeof text !== "string") {
        throw new Error(
          `텍스트가 문자열이 아닙니다. 현재 타입: ${typeof text}`
        );
      }

      // 3. 텍스트가 비어있는 경우
      if (text.trim().length === 0) {
        throw new Error("텍스트가 비어있습니다");
      }

      // 4. 실제 포맷팅 처리
      const formattedText = text.replace(/(?<!\d)\.(?!\d)/g, ".\n\n").trim();

      // 5. 결과 검증
      if (!formattedText) {
        throw new Error("포맷팅 결과가 비어있습니다");
      }

      return formattedText;
    } catch (error) {
      // 에러 로깅
      console.error("formatExplanation 에러:", error.message);

      // 상태 업데이트를 위한 에러 메시지 설정
      setError(`텍스트 포맷팅 중 오류가 발생했습니다: ${error.message}`);

      // 기본값 반환
      return "텍스트를 표시할 수 없습니다.";
    }
  };

  const formatMarkdownExplanation = (text) => {
    // 텍스트를 그대로 Markdown 형식으로 포맷팅
    const formattedText = text
      .replace(/\\n/g, "\n") // 실제 줄바꿈으로 변환
      .replace(/\\t/g, "    "); // 탭 문자를 공백 4칸으로 변환

    console.log("Formatted Markdown Text:\n", formattedText);

    return formattedText;
  };

  return (
    <div className="min-h-screen bg-[hsl(20,40%,97%)] flex items-center justify-center p-10">
      <Helmet>
        <title>Devmon - 알고리즘 문제 해결 도우미</title>
      </Helmet>
      <div className="max-w-4xl w-full mx-auto px-4">
        <div className="text-center mb-8">
          {" "}
          <h1 className="text-3xl font-semibold text-[hsl(20,25%,25%)] mb-8">
            알고리즘 문제 해결 도우미
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="문제 URL을 입력하세요"
              className={`flex-1 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(20,40%,60%)] focus:border-transparent ${
                loading
                  ? "opacity-50 cursor-not-allowed border-[hsl(20,30%,85%)]"
                  : "border-[hsl(20,30%,80%)]"
              }`}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(20,40%,60%)] focus:ring-offset-2 transition-colors duration-200 ${
                loading
                  ? "bg-[hsl(20,40%,75%)] cursor-not-allowed"
                  : "bg-[hsl(20,40%,50%)] hover:bg-[hsl(20,40%,45%)]"
              } text-white`}
              disabled={loading}
            >
              {loading ? "분석중..." : "분석하기"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-[hsl(0,100%,97%)] border border-[hsl(0,100%,90%)] rounded-lg text-[hsl(0,70%,45%)]">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(20,40%,50%)]"></div>
          </div>
        )}

        {!loading && explanation && (
          <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-[hsl(20,30%,90%)]">
            <section>
              <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
                권장되는 알고리즘
              </h2>
              <div className="prose max-w-none text-[hsl(20,20%,30%)]">
                <ReactMarkdown>{explanation.required_algorithm}</ReactMarkdown>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
                주요 개념
              </h2>
              <div className="prose max-w-none text-[hsl(20,20%,30%)]">
                <ReactMarkdown>
                  {formatExplanation(explanation.key_concepts)}
                </ReactMarkdown>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
                풀이 접근 방법
              </h2>
              <div className="prose max-w-none text-[hsl(20,20%,30%)]">
                <ReactMarkdown>
                  {formatExplanation(explanation.solution_approach)}
                </ReactMarkdown>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)]">
                  {showCode ? "코드(Python)" : "수도 코드"}
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
                    <>
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
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </>
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
              <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
                코드 설명
              </h2>
              <div className="prose max-w-none text-[hsl(20,20%,30%)]">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        {...props}
                        className="text-3xl font-bold text-[hsl(20,25%,20%)] mt-6 mb-6"
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        {...props}
                        className="text-2xl font-semibold text-[hsl(20,30%,25%)] mt-6 mb-6"
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        {...props}
                        className="text-xl font-medium text-[hsl(20,35%,30%)] mt-6 mb-6"
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
                  {formatMarkdownExplanation(explanation.explain)}
                </ReactMarkdown>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
                시간복잡도
              </h2>
              <div className="prose max-w-none text-[hsl(20,20%,30%)]">
                <ReactMarkdown>{explanation.time_complexity}</ReactMarkdown>
              </div>
            </section>
          </div>
        )}

        {!loading && related_problems.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-[hsl(20,30%,90%)]">
            <h2 className="text-xl font-semibold text-[hsl(20,25%,25%)] mb-4">
              {tagName} - 관련 문제
            </h2>
            <ul className="space-y-2">
              {related_problems.map((problem, index) => (
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
        )}
      </div>
    </div>
  );
};

export default App;
