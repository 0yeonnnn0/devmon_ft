import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import Highlight from "react-highlight";
import MonacoEditor from "@monaco-editor/react";

function App() {
  const [url, setUrl] = useState("https://www.acmicpc.net/problem/1463"); // State for URL input
  const [tagName, setTagName] = useState(""); // State for tag name
  const [related_problems, setRelatedProblems] = useState([]); // State for related problems
  const [explanation, setExplanation] = useState(""); //
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and result states
    setError("");
    setExplanation("");
    setRelatedProblems([]);
    setTagName("");

    // Validate the URL
    if (!url) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await axios.post(
        "http://localhost:8080/crawl",
        { url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response.data.tag_name", response.data.tag_name);
      setTagName(response.data.tag_name);
      console.log(
        "response.data.related_problems",
        response.data.related_problem
      );
      setRelatedProblems(response.data.related_problem);

      console.log("response.data.data", response.data.data);
      setExplanation(response.data.data);
    } catch (err) {
      console.log("err", err);
      setError(
        err.response?.data?.detail || "An error occurred. Please try again."
      ); // Handle error messages
    } finally {
      setLoading(false); // Stop loading
    }
  };

  function removeBackticks(input) {
    // 모든 백틱(``` 또는 `)을 제거
    const code = input.replace(/```python\n?/, "").replace(/```$/, "");
    return code.replace(/`+/g, "").trim();
  }

  const formatExplanation = (text) => {
    // 마침표 뒤에 줄바꿈을 추가 (기존 줄바꿈은 유지)
    return text.split(".").join(".\n\n").trim();
  };

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Submit a URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          placeholder="Enter a website URL"
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p style={{ marginTop: "10px" }}>Loading...</p>}

      {/* ChatGPT Result */}
      {!loading && explanation && (
        <div className="markdown-container">
          <h2>권장되는 알고리즘</h2>
          <ReactMarkdown>{explanation.required_algorithm}</ReactMarkdown>
          <h2>주요 개념</h2>
          <ReactMarkdown>
            {formatExplanation(explanation.key_concepts)}
          </ReactMarkdown>
          <h2>풀이 접근 방법</h2>
          <ReactMarkdown>
            {formatExplanation(explanation.solution_approach)}
          </ReactMarkdown>
          <h2>코드(Python)</h2>
          <div style={{ margin: "20px", minHeight: "300px" }}>
            <MonacoEditor
              height="300px"
              defaultLanguage="python"
              defaultValue={removeBackticks(explanation.solution.code)}
              theme="vs-dark"
            />
          </div>
          <h2>설명</h2>
          <ReactMarkdown>{explanation.explain}</ReactMarkdown>
          {/* <ReactMarkdown>{explanation.time_complexity}</ReactMarkdown> */}
        </div>
      )}
      {!loading && related_problems && (
        <div style={{ margin: "20px", textAlign: "left" }}>
          <h2>{tagName} - Related Problems</h2>
          {related_problems.map((problem, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <a
                href={`https://www.acmicpc.net/problem/${problem.url}`}
                style={{ color: "#3498db" }}
              >
                {problem}
              </a>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
