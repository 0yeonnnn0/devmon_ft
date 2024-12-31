import React, { useState } from "react";
import InputForm from "./components/InputForm";
import AlgorithmDetails from "./components/AlgorithmDetails";
import RelatedProblems from "./components/RelatedProblems";
import useExplanationStore from "./stores/explanationStore";
import Spinner from "./components/Spinner";
import { useAlgorithmSubmit } from "./hooks/useAlgorithmSubmit";
import { Helmet } from "react-helmet";

const App = () => {
  const [url, setUrl] = useState("");
  const { loading, error, handleSubmit } = useAlgorithmSubmit();
  const { explanation, tagName, relatedProblems } = useExplanationStore();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(url);
  };

  return (
    <>
      <Helmet>
        <link rel="icon" href="/path/to/favicon.ico" />
        {explanation ? (
          <>
            <title>
              {explanation.required_algorithm
                ? `${explanation.required_algorithm} - Devmon`
                : "Devmon"}
            </title>
            <meta name="description" content={explanation.algorithm_concept} />
            <meta
              property="og:title"
              content={`${explanation.required_algorithm} - Devmon`}
            />
            <meta
              property="og:description"
              content={explanation.algorithm_concept}
            />
          </>
        ) : (
          <title>Devmon - 알고리즘 문제 해결 도우미</title>
        )}
      </Helmet>
      <div className="min-h-screen flex flex-col items-center p-10 bg-[hsl(20,40%,97%)] gap-4">
        <h1 className="text-3xl font-semibold text-[hsl(20,25%,25%)] mb-4">
          알고리즘 문제 해결 도우미
        </h1>

        {/* URL 입력 폼 */}
        <InputForm
          url={url}
          setUrl={setUrl}
          loading={loading}
          handleSubmit={onSubmit}
        />
        {loading && <Spinner />}
        {error && <div className="text-red-500">{error}</div>}

        {/* 알고리즘 설명 */}
        {explanation && <AlgorithmDetails />}

        {/* 관련 문제 */}
        {relatedProblems.length > 0 && (
          <RelatedProblems
            tagName={tagName}
            relatedProblems={relatedProblems}
          />
        )}
      </div>
    </>
  );
};

export default App;
